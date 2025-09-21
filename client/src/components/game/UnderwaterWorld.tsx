import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EnhancedParticles, UnderwaterCurrent, GodRays } from "./EnhancedParticles";

export default function UnderwaterWorld() {
  const particlesRef = useRef<THREE.Points>(null);
  const seaweedGroupRef = useRef<THREE.Group>(null);

  // Create underwater particles (bubbles and plankton)
  const particles = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Random positions in underwater space
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 50 - 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      // Subtle blue-green colors for underwater effect
      const color = new THREE.Color();
      color.setHSL(
        0.55 + Math.random() * 0.1, // Blue-cyan hue
        0.6 + Math.random() * 0.4,
        0.3 + Math.random() * 0.4
      );
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, []);

  // Create seaweed positions
  const seaweedPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 50; i++) {
      positions.push({
        x: (Math.random() - 0.5) * 80,
        z: (Math.random() - 0.5) * 80,
        height: 3 + Math.random() * 4,
        offset: Math.random() * Math.PI * 2
      });
    }
    return positions;
  }, []);

  // Animate particles and seaweed
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Animate floating particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Gentle floating motion
        positions[i + 1] += Math.sin(time * 0.5 + positions[i]) * 0.001;
        
        // Reset particles that float too high
        if (positions[i + 1] > 30) {
          positions[i + 1] = -10;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate seaweed swaying
    if (seaweedGroupRef.current) {
      seaweedGroupRef.current.children.forEach((seaweed, index) => {
        const offset = seaweedPositions[index]?.offset || 0;
        seaweed.rotation.x = Math.sin(time * 0.8 + offset) * 0.1;
        seaweed.rotation.z = Math.cos(time * 0.6 + offset) * 0.05;
      });
    }
  });

  console.log('🌊 UnderwaterWorld rendered with', particles.positions.length / 3, 'particles');

  return (
    <group>
      {/* Enhanced Particle Systems */}
      <EnhancedParticles
        count={150}
        type="bubbles"
        position={[0, -10, 0]}
        area={[60, 40, 60]}
      />
      
      <EnhancedParticles
        count={80}
        type="debris"
        position={[0, 0, 0]}
        area={[80, 50, 80]}
      />
      
      <EnhancedParticles
        count={200}
        type="bioluminescent"
        position={[0, -20, -30]}
        area={[40, 30, 40]}
      />
      
      <EnhancedParticles
        count={100}
        type="current"
        position={[-20, 0, 0]}
        area={[80, 20, 80]}
      />

      {/* Underwater Current Lines */}
      <UnderwaterCurrent />

      {/* God Rays from Surface */}
      <GodRays />
      {/* Underwater Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation={true}
        />
      </points>

      {/* Seaweed Forest */}
      <group ref={seaweedGroupRef}>
        {seaweedPositions.map((pos, index) => (
          <mesh
            key={index}
            position={[pos.x, -25 + pos.height / 2, pos.z]}
            castShadow
          >
            <cylinderGeometry args={[0.1, 0.2, pos.height, 6]} />
            <meshLambertMaterial color="#2d8659" />
          </mesh>
        ))}
      </group>

      {/* Coral Formations */}
      <group>
        {[...Array(20)].map((_, index) => (
          <mesh
            key={index}
            position={[
              (Math.random() - 0.5) * 60,
              -28 + Math.random() * 3,
              (Math.random() - 0.5) * 60
            ]}
            castShadow
          >
            <sphereGeometry args={[0.5 + Math.random() * 1, 8, 6]} />
            <meshLambertMaterial color="#ff6b6b" />
          </mesh>
        ))}
      </group>

      {/* Rock Formations */}
      <group>
        {[...Array(15)].map((_, index) => (
          <mesh
            key={index}
            position={[
              (Math.random() - 0.5) * 80,
              -30,
              (Math.random() - 0.5) * 80
            ]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[
              1 + Math.random() * 2,
              1 + Math.random() * 1.5,
              1 + Math.random() * 2
            ]} />
            <meshLambertMaterial color="#444444" />
          </mesh>
        ))}
      </group>

      {/* Original Basic Particles (kept for compatibility) */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.3}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
}
