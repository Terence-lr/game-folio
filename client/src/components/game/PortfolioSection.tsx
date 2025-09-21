import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  color: string;
}

interface PortfolioSectionProps {
  position: [number, number, number];
  type: 'surface' | 'intro' | 'project' | 'experience' | 'contact';
  title: string;
  description: string;
  color: string;
  project?: Project;
}

export default function PortfolioSection({ 
  position, 
  type, 
  title, 
  description, 
  color, 
  project 
}: PortfolioSectionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Create different geometries based on section type
  const geometry = useMemo(() => {
    switch (type) {
      case 'surface':
        return new THREE.SphereGeometry(3, 16, 12); // Sun-like sphere
      case 'intro':
        return new THREE.OctahedronGeometry(2.5); // Crystal formation
      case 'project':
        return new THREE.BoxGeometry(3, 3, 3); // Treasure chest
      case 'experience':
        return new THREE.CylinderGeometry(2, 4, 6, 8); // Shipwreck mast
      case 'contact':
        return new THREE.TorusGeometry(2, 0.8, 8, 16); // Portal ring
      default:
        return new THREE.BoxGeometry(2, 2, 2);
    }
  }, [type]);

  // Animate the portfolio section
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = position[1] + Math.sin(time * 0.8 + position[0]) * 0.2;
      
      // Rotation based on type
      switch (type) {
        case 'surface':
          groupRef.current.rotation.y = time * 0.2;
          break;
        case 'intro':
          groupRef.current.rotation.x = time * 0.3;
          groupRef.current.rotation.y = time * 0.2;
          break;
        case 'project':
          groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
          break;
        case 'experience':
          groupRef.current.rotation.y = time * 0.1;
          break;
        case 'contact':
          groupRef.current.rotation.x = time * 0.4;
          groupRef.current.rotation.z = time * 0.2;
          break;
      }
    }

    // Pulsing glow effect
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshLambertMaterial;
      material.emissive.setHex(parseInt(color.replace('#', ''), 16));
      material.emissiveIntensity = 0.2 + Math.sin(time * 2) * 0.1;
    }
  });

  console.log(`📍 PortfolioSection ${type} rendered at:`, position);

  return (
    <group ref={groupRef} position={position}>
      {/* Main Section Mesh */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <primitive object={geometry} />
        <meshStandardMaterial 
          color={color}
          transparent
          opacity={0.8}
          metalness={0.3}
          roughness={0.2}
          envMapIntensity={1.0}
        />
      </mesh>

      {/* Section Title */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        {title}
      </Text>

      {/* Interaction Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={50}
            array={new Float32Array(Array.from({ length: 150 }, () => (Math.random() - 0.5) * 8))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={0.05}
          transparent
          opacity={0.6}
        />
      </points>

      {/* Type-specific decorations */}
      {type === 'project' && (
        <mesh position={[0, 2, 0]} castShadow>
          <sphereGeometry args={[0.3, 8, 6]} />
          <meshLambertMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} />
        </mesh>
      )}

      {type === 'contact' && (
        <>
          <mesh position={[3, 0, 0]} castShadow>
            <sphereGeometry args={[0.2, 6, 4]} />
            <meshLambertMaterial color="#40e0d0" emissive="#40e0d0" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[-3, 0, 0]} castShadow>
            <sphereGeometry args={[0.2, 6, 4]} />
            <meshLambertMaterial color="#40e0d0" emissive="#40e0d0" emissiveIntensity={0.5} />
          </mesh>
        </>
      )}
    </group>
  );
}
