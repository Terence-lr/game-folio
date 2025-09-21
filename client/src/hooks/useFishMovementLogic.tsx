import { useCallback, useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGamefolio } from "../lib/stores/useGamefolio";
import { audioManager } from "../lib/audioManager";

export function useFishMovementLogic() {
  const {
    fishPosition,
    fishRotation,
    isMoving,
    isBoosting,
    mobileInput,
    setFishPosition,
    setFishRotation,
    setIsMoving
  } = useGamefolio();

  // Movement physics
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const targetRotation = useRef(new THREE.Euler(0, 0, 0));
  
  // Get keyboard controls
  const [, getKeys] = useKeyboardControls();

  // Movement parameters
  const MOVE_SPEED = 8;
  const BOOST_MULTIPLIER = 2;
  const TURN_SPEED = 3;
  const DAMPING = 0.85;

  // Update fish movement each frame
  useFrame((state, delta) => {
    const keys = getKeys();
    
    // Combine keyboard and mobile inputs
    const input = {
      forward: keys.forward || mobileInput.forward || (mobileInput.y || 0) > 0.3,
      backward: keys.backward || mobileInput.backward || (mobileInput.y || 0) < -0.3,
      left: keys.left || mobileInput.left || (mobileInput.x || 0) < -0.3,
      right: keys.right || mobileInput.right || (mobileInput.x || 0) > 0.3,
      up: keys.up || mobileInput.up,
      down: keys.down || mobileInput.down,
      boost: keys.boost || isBoosting
    };

    // Calculate movement vector
    const moveVector = new THREE.Vector3(0, 0, 0);
    
    if (input.forward) moveVector.z -= 1;
    if (input.backward) moveVector.z += 1;
    if (input.left) moveVector.x -= 1;
    if (input.right) moveVector.x += 1;
    if (input.up) moveVector.y += 1;
    if (input.down) moveVector.y -= 1;

    // Apply mobile joystick analog input
    if (mobileInput.x !== undefined && Math.abs(mobileInput.x) > 0.1) {
      moveVector.x += mobileInput.x;
    }
    if (mobileInput.y !== undefined && Math.abs(mobileInput.y) > 0.1) {
      moveVector.z -= mobileInput.y;
    }

    // Normalize movement vector
    if (moveVector.length() > 0) {
      moveVector.normalize();
      setIsMoving(true);
    } else {
      setIsMoving(false);
    }

    // Apply speed multipliers
    const currentSpeed = MOVE_SPEED * (input.boost ? BOOST_MULTIPLIER : 1);
    moveVector.multiplyScalar(currentSpeed * delta);

    // Update velocity with damping
    velocity.current.multiplyScalar(DAMPING);
    velocity.current.add(moveVector);

    // Update position
    const newPosition = fishPosition.clone().add(velocity.current);
    
    // Apply boundary constraints (optional - keep fish in reasonable area)
    newPosition.x = Math.max(-50, Math.min(50, newPosition.x));
    newPosition.y = Math.max(-35, Math.min(20, newPosition.y));
    newPosition.z = Math.max(-70, Math.min(20, newPosition.z));
    
    setFishPosition(newPosition);

    // Update rotation to face movement direction
    if (moveVector.length() > 0) {
      const direction = moveVector.clone().normalize();
      
      // Calculate target rotation based on movement direction
      targetRotation.current.y = Math.atan2(direction.x, -direction.z);
      targetRotation.current.x = Math.asin(direction.y) * 0.3; // Subtle pitch
      
      // Smooth rotation interpolation
      const currentRotation = fishRotation.clone();
      currentRotation.x += (targetRotation.current.x - currentRotation.x) * TURN_SPEED * delta;
      currentRotation.y += (targetRotation.current.y - currentRotation.y) * TURN_SPEED * delta;
      
      setFishRotation(currentRotation);
    }

    // Debug logging and audio feedback
    if (moveVector.length() > 0) {
      // Play swimming sounds based on movement intensity
      const intensity = Math.min(velocity.current.length() / 10, 1);
      if (Math.random() < 0.1) { // Play sound occasionally to avoid spam
        audioManager.playSwimSound(intensity);
      }
      
      console.log('🐠 Fish moving:', {
        position: { x: newPosition.x.toFixed(1), y: newPosition.y.toFixed(1), z: newPosition.z.toFixed(1) },
        velocity: velocity.current.length().toFixed(2),
        boosting: input.boost
      });
    }
  });

  return {
    fishPosition,
    fishRotation,
    isMoving,
    isBoosting
  };
}