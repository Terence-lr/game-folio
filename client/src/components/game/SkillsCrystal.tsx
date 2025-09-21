import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

interface Skill {
  name: string;
  level: number; // 1-10 scale
  color: string;
  category: 'frontend' | 'backend' | 'database' | 'tools';
}

interface SkillsCrystalProps {
  position: [number, number, number];
  skill: Skill;
}

export default function SkillsCrystal({ position, skill }: SkillsCrystalProps) {
  const crystalRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Create crystal geometry based on skill level
  const crystalGeometry = useMemo(() => {
    const height = 1 + (skill.level / 10) * 3; // Height based on proficiency
    return new THREE.ConeGeometry(0.5, height, 6);
  }, [skill.level]);

  // Calculate glow intensity based on skill level
  const glowIntensity = useMemo(() => {
    return (skill.level / 10) * 0.8 + 0.2; // 0.2 to 1.0 range
  }, [skill.level]);

  // Animate the crystal
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      // Gentle floating motion
      groupRef.current.position.y = position[1] + Math.sin(time * 1.5 + position[0]) * 0.1;
      
      // Slow rotation
      groupRef.current.rotation.y = time * 0.3;
    }

    if (crystalRef.current) {
      // Pulsing glow effect based on skill level
      const material = crystalRef.current.material as THREE.MeshStandardMaterial;
      material.emissive.setHex(parseInt(skill.color.replace('#', ''), 16));
      material.emissiveIntensity = glowIntensity * (0.8 + Math.sin(time * 2) * 0.2);
    }
  });

  console.log(`💎 SkillsCrystal ${skill.name} (level ${skill.level}) rendered at:`, position);

  return (
    <group ref={groupRef} position={position}>
      {/* Main Crystal */}
      <mesh ref={crystalRef} castShadow>
        <primitive object={crystalGeometry} />
        <meshStandardMaterial 
          color={skill.color}
          transparent
          opacity={0.8}
          metalness={0.4}
          roughness={0.1}
          envMapIntensity={1.2}
          emissive={skill.color}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Crystal Base */}
      <mesh position={[0, -0.8, 0]} receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 8]} />
        <meshStandardMaterial 
          color="#444444" 
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Skill Name */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        {skill.name}
      </Text>

      {/* Skill Level Indicator */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.25}
        color={skill.color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        Level {skill.level}/10
      </Text>

      {/* Particle Effect Around Crystal */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={skill.level * 5} // More particles for higher skill levels
            array={new Float32Array(Array.from({ length: skill.level * 15 }, () => (Math.random() - 0.5) * 4))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={skill.color}
          size={0.03}
          transparent
          opacity={glowIntensity}
        />
      </points>

      {/* Skill Category Indicator */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.1, 8]} />
        <meshBasicMaterial 
          color={skill.color}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}
