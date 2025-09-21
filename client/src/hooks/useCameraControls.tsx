import { useRef, useCallback, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "./use-is-mobile";

interface CameraControlsProps {
  target: THREE.Vector3;
  followOffset?: THREE.Vector3;
  smoothing?: number;
  enableTouch?: boolean;
  enableZoom?: boolean;
}

export function useCameraControls({
  target,
  followOffset = new THREE.Vector3(0, 3, 8),
  smoothing = 2,
  enableTouch = true,
  enableZoom = true
}: CameraControlsProps) {
  const { camera, gl } = useThree();
  const isMobile = useIsMobile();
  
  // Touch/mouse interaction state
  const isInteracting = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const cameraRotation = useRef({ phi: 0, theta: 0 });
  const cameraDistance = useRef(8);
  const targetRotation = useRef({ phi: 0, theta: 0 });
  const targetDistance = useRef(8);
  
  // Pinch zoom state
  const lastPinchDistance = useRef(0);
  const isPinching = useRef(false);

  // Calculate pointer position from event
  const getPointerPosition = useCallback((event: TouchEvent | MouseEvent) => {
    if ('touches' in event && event.touches.length > 0) {
      return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    } else if ('clientX' in event) {
      return {
        x: event.clientX,
        y: event.clientY
      };
    }
    return { x: 0, y: 0 };
  }, []);

  // Calculate distance between two touches
  const getTouchDistance = useCallback((touches: TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!enableTouch) return;

    if (event.touches.length === 1) {
      // Single touch - camera rotation
      isInteracting.current = true;
      const pointer = getPointerPosition(event);
      lastPointer.current = pointer;
    } else if (event.touches.length === 2) {
      // Two touches - pinch zoom
      isPinching.current = true;
      lastPinchDistance.current = getTouchDistance(event.touches);
    }

    event.preventDefault();
  }, [enableTouch, getPointerPosition, getTouchDistance]);

  // Handle touch move
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!enableTouch) return;

    if (event.touches.length === 1 && isInteracting.current && !isPinching.current) {
      // Camera rotation
      const pointer = getPointerPosition(event);
      const deltaX = pointer.x - lastPointer.current.x;
      const deltaY = pointer.y - lastPointer.current.y;

      // Update target rotation
      targetRotation.current.theta -= deltaX * 0.005;
      targetRotation.current.phi = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, targetRotation.current.phi - deltaY * 0.005)
      );

      lastPointer.current = pointer;
    } else if (event.touches.length === 2 && isPinching.current) {
      // Pinch zoom
      const distance = getTouchDistance(event.touches);
      const deltaDistance = distance - lastPinchDistance.current;
      
      targetDistance.current = Math.max(
        3,
        Math.min(20, targetDistance.current - deltaDistance * 0.02)
      );
      
      lastPinchDistance.current = distance;
    }

    event.preventDefault();
  }, [enableTouch, getPointerPosition, getTouchDistance]);

  // Handle touch end
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (event.touches.length === 0) {
      isInteracting.current = false;
      isPinching.current = false;
    } else if (event.touches.length === 1) {
      isPinching.current = false;
      const pointer = getPointerPosition(event);
      lastPointer.current = pointer;
    }
    
    event.preventDefault();
  }, [getPointerPosition]);

  // Handle mouse events for desktop
  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (isMobile || !enableTouch) return;

    isInteracting.current = true;
    const pointer = getPointerPosition(event);
    lastPointer.current = pointer;
    event.preventDefault();
  }, [isMobile, enableTouch, getPointerPosition]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isMobile || !enableTouch || !isInteracting.current) return;

    const pointer = getPointerPosition(event);
    const deltaX = pointer.x - lastPointer.current.x;
    const deltaY = pointer.y - lastPointer.current.y;

    targetRotation.current.theta -= deltaX * 0.005;
    targetRotation.current.phi = Math.max(
      -Math.PI / 3,
      Math.min(Math.PI / 3, targetRotation.current.phi - deltaY * 0.005)
    );

    lastPointer.current = pointer;
    event.preventDefault();
  }, [isMobile, enableTouch, getPointerPosition]);

  const handleMouseUp = useCallback(() => {
    isInteracting.current = false;
  }, []);

  // Handle mouse wheel for zoom
  const handleWheel = useCallback((event: WheelEvent) => {
    if (!enableZoom) return;

    targetDistance.current = Math.max(
      3,
      Math.min(20, targetDistance.current + event.deltaY * 0.01)
    );
    
    event.preventDefault();
  }, [enableZoom]);

  // Set up event listeners
  useEffect(() => {
    const canvas = gl.domElement;

    if (isMobile) {
      // Touch events for mobile
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    } else {
      // Mouse events for desktop
      canvas.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (isMobile) {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
      } else {
        canvas.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('wheel', handleWheel);
      }
    };
  }, [
    gl.domElement,
    isMobile,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel
  ]);

  // Update camera position each frame
  useFrame((state, delta) => {
    // Smooth interpolation of rotation and distance
    cameraRotation.current.theta += (targetRotation.current.theta - cameraRotation.current.theta) * smoothing * delta;
    cameraRotation.current.phi += (targetRotation.current.phi - cameraRotation.current.phi) * smoothing * delta;
    cameraDistance.current += (targetDistance.current - cameraDistance.current) * smoothing * delta;

    // Calculate camera position based on spherical coordinates
    const spherical = new THREE.Spherical(
      cameraDistance.current,
      Math.PI / 2 - cameraRotation.current.phi,
      cameraRotation.current.theta
    );

    const cameraOffset = new THREE.Vector3().setFromSpherical(spherical);
    const targetPosition = target.clone().add(followOffset).add(cameraOffset);

    // Smooth camera movement
    camera.position.lerp(targetPosition, smoothing * delta);
    
    // Look at target with offset
    const lookAtTarget = target.clone().add(new THREE.Vector3(0, 1, 0));
    camera.lookAt(lookAtTarget);

    // Log camera activity for debugging
    if (isInteracting.current || isPinching.current) {
      console.log('📷 Camera interaction:', {
        rotation: {
          theta: cameraRotation.current.theta.toFixed(2),
          phi: cameraRotation.current.phi.toFixed(2)
        },
        distance: cameraDistance.current.toFixed(2),
        position: {
          x: camera.position.x.toFixed(1),
          y: camera.position.y.toFixed(1),
          z: camera.position.z.toFixed(1)
        }
      });
    }
  });

  // Return camera state for external use
  return {
    isInteracting: isInteracting.current,
    isPinching: isPinching.current,
    cameraDistance: cameraDistance.current,
    cameraRotation: cameraRotation.current,
    resetCamera: () => {
      targetRotation.current = { phi: 0, theta: 0 };
      targetDistance.current = 8;
    }
  };
}