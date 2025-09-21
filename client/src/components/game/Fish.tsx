import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FishProps {
  position: THREE.Vector3;
  rotation: THREE.Euler;
}

export default function Fish({ position, rotation }: FishProps) {
  const fishGroupRef = useRef<THREE.Group>(null);

  // Update fish position and rotation each frame
  useFrame(() => {
    if (fishGroupRef.current) {
      fishGroupRef.current.position.copy(position);
      fishGroupRef.current.rotation.copy(rotation);
    }
  });

  useEffect(() => {
    if (fishGroupRef.current) {
      console.log('🐠 Fish connected to scene successfully');
    }
  }, []);

  console.log('🐠 Fish rendering at position:', { x: position.x.toFixed(2), y: position.y.toFixed(2), z: position.z.toFixed(2) });

  return (
    <group ref={fishGroupRef}>
      {/* Simple visible fish body - bright orange */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 1, 0.5]} />
        <meshBasicMaterial color="#FF6600" />
      </mesh>

      {/* Fish tail - bright red */}
      <mesh position={[-1.5, 0, 0]} castShadow>
        <coneGeometry args={[0.5, 1, 3]} />
        <meshBasicMaterial color="#FF0000" />
      </mesh>

      {/* Eyes - white with black pupils */}
      <mesh position={[0.8, 0.2, 0.2]} castShadow>
        <sphereGeometry args={[0.15]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      
      <mesh position={[0.8, 0.2, -0.2]} castShadow>
        <sphereGeometry args={[0.15]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* Pupils */}
      <mesh position={[0.9, 0.2, 0.2]} castShadow>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      <mesh position={[0.9, 0.2, -0.2]} castShadow>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Fins */}
      <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.3, 0.8, 3]} />
        <meshBasicMaterial color="#FF9900" />
      </mesh>
    </group>
  );
}