import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { audioManager } from "../../lib/audioManager";

interface ParticleSystemProps {
  count: number;
  type: 'bubbles' | 'debris' | 'bioluminescent' | 'current';
  position?: [number, number, number];
  area?: [number, number, number];
}

export function EnhancedParticles({ count, type, position = [0, 0, 0], area = [50, 50, 50] }: ParticleSystemProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const velocityRef = useRef<Float32Array>();
  const lifetimeRef = useRef<Float32Array>();

  // Create particle system based on type
  const { positions, colors, sizes, velocities, lifetimes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Set initial positions within area
      positions[i3] = position[0] + (Math.random() - 0.5) * area[0];
      positions[i3 + 1] = position[1] + (Math.random() - 0.5) * area[1];
      positions[i3 + 2] = position[2] + (Math.random() - 0.5) * area[2];

      // Configure based on particle type
      switch (type) {
        case 'bubbles':
          // Blue-white bubbles that rise upward
          colors[i3] = 0.8 + Math.random() * 0.2;     // R
          colors[i3 + 1] = 0.9 + Math.random() * 0.1; // G
          colors[i3 + 2] = 1.0;                       // B
          sizes[i] = 0.5 + Math.random() * 1.5;
          velocities[i3] = (Math.random() - 0.5) * 0.5;     // X drift
          velocities[i3 + 1] = 1 + Math.random() * 2;       // Y upward
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.5; // Z drift
          lifetimes[i] = 5 + Math.random() * 10;
          break;

        case 'debris':
          // Dark floating debris
          const grayValue = 0.2 + Math.random() * 0.3;
          colors[i3] = grayValue;
          colors[i3 + 1] = grayValue;
          colors[i3 + 2] = grayValue;
          sizes[i] = 0.3 + Math.random() * 0.8;
          velocities[i3] = (Math.random() - 0.5) * 0.3;
          velocities[i3 + 1] = (Math.random() - 0.5) * 0.2;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.3;
          lifetimes[i] = 20 + Math.random() * 30;
          break;

        case 'bioluminescent':
          // Glowing blue-green particles
          colors[i3] = 0.2 + Math.random() * 0.3;     // R
          colors[i3 + 1] = 0.8 + Math.random() * 0.2; // G
          colors[i3 + 2] = 1.0;                       // B
          sizes[i] = 0.1 + Math.random() * 0.4;
          velocities[i3] = (Math.random() - 0.5) * 0.1;
          velocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
          lifetimes[i] = 8 + Math.random() * 12;
          break;

        case 'current':
          // Transparent flow indicators
          colors[i3] = 0.4 + Math.random() * 0.3;
          colors[i3 + 1] = 0.7 + Math.random() * 0.3;
          colors[i3 + 2] = 1.0;
          sizes[i] = 0.2 + Math.random() * 0.3;
          velocities[i3] = 0.5 + Math.random() * 1.0;      // Horizontal flow
          velocities[i3 + 1] = (Math.random() - 0.5) * 0.2;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.2;
          lifetimes[i] = 15 + Math.random() * 20;
          break;
      }
    }

    return { positions, colors, sizes, velocities, lifetimes };
  }, [count, type, position, area]);

  // Store references for animation
  useEffect(() => {
    velocityRef.current = velocities;
    lifetimeRef.current = lifetimes;
  }, [velocities, lifetimes]);

  // Animate particles
  useFrame((state, delta) => {
    if (!particlesRef.current || !velocityRef.current || !lifetimeRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;
    const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Update lifetime
      lifetimeRef.current[i] -= delta;

      // Reset particle if lifetime expired
      if (lifetimeRef.current[i] <= 0) {
        // Reset position
        positions[i3] = position[0] + (Math.random() - 0.5) * area[0];
        positions[i3 + 1] = position[1] + (Math.random() - 0.5) * area[1];
        positions[i3 + 2] = position[2] + (Math.random() - 0.5) * area[2];

        // Reset lifetime
        switch (type) {
          case 'bubbles':
            lifetimeRef.current[i] = 5 + Math.random() * 10;
            // Play bubble sound occasionally
            if (Math.random() < 0.02) {
              audioManager.playBubbleSound();
            }
            break;
          case 'debris':
            lifetimeRef.current[i] = 20 + Math.random() * 30;
            break;
          case 'bioluminescent':
            lifetimeRef.current[i] = 8 + Math.random() * 12;
            break;
          case 'current':
            lifetimeRef.current[i] = 15 + Math.random() * 20;
            break;
        }
      } else {
        // Update position based on velocity
        positions[i3] += velocityRef.current[i3] * delta;
        positions[i3 + 1] += velocityRef.current[i3 + 1] * delta;
        positions[i3 + 2] += velocityRef.current[i3 + 2] * delta;

        // Add some wave motion for organic feel
        if (type === 'bioluminescent') {
          positions[i3] += Math.sin(time * 2 + i * 0.1) * 0.01;
          positions[i3 + 2] += Math.cos(time * 1.5 + i * 0.1) * 0.01;
          
          // Pulsing glow effect
          const pulse = 0.5 + 0.5 * Math.sin(time * 3 + i * 0.5);
          colors[i3] = (0.2 + Math.random() * 0.3) * pulse;
          colors[i3 + 1] = (0.8 + Math.random() * 0.2) * pulse;
          colors[i3 + 2] = 1.0 * pulse;
        }

        // Boundary wrapping for bubbles (they rise and reset)
        if (type === 'bubbles' && positions[i3 + 1] > position[1] + area[1] / 2) {
          positions[i3 + 1] = position[1] - area[1] / 2;
        }

        // Boundary wrapping for current particles (horizontal flow)
        if (type === 'current' && positions[i3] > position[0] + area[0] / 2) {
          positions[i3] = position[0] - area[0] / 2;
        }

        // Fade out based on lifetime for smooth transitions
        const lifetimeNormalized = lifetimeRef.current[i] / 15; // Approximate average lifetime
        const opacity = Math.min(1, lifetimeNormalized);
        sizes[i] = (sizes[i] || 1) * opacity;
      }
    }

    // Mark attributes as needing update
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.color.needsUpdate = true;
    particlesRef.current.geometry.attributes.size.needsUpdate = true;
  });

  // Get material properties based on type
  const getMaterialProps = () => {
    switch (type) {
      case 'bubbles':
        return {
          transparent: true,
          opacity: 0.6,
          size: 2,
          sizeAttenuation: true,
          blending: THREE.AdditiveBlending
        };
      case 'debris':
        return {
          transparent: true,
          opacity: 0.4,
          size: 1.5,
          sizeAttenuation: true
        };
      case 'bioluminescent':
        return {
          transparent: true,
          opacity: 0.8,
          size: 3,
          sizeAttenuation: true,
          blending: THREE.AdditiveBlending
        };
      case 'current':
        return {
          transparent: true,
          opacity: 0.3,
          size: 1,
          sizeAttenuation: true
        };
    }
  };

  console.log(`✨ EnhancedParticles ${type} rendered with ${count} particles`);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        {...getMaterialProps()}
      />
    </points>
  );
}

// Underwater Current Effect Component
export function UnderwaterCurrent() {
  const currentRef = useRef<THREE.Group>(null);

  // Create flowing current lines
  const currentLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 20; i++) {
      const points = [];
      const startX = (Math.random() - 0.5) * 80;
      const startY = (Math.random() - 0.5) * 40;
      const startZ = (Math.random() - 0.5) * 80;

      for (let j = 0; j < 10; j++) {
        points.push(new THREE.Vector3(
          startX + j * 2 + Math.sin(j * 0.5) * 0.5,
          startY + Math.sin(j * 0.3) * 0.3,
          startZ + Math.cos(j * 0.4) * 0.5
        ));
      }

      lines.push(points);
    }
    return lines;
  }, []);

  useFrame((state) => {
    if (!currentRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Gentle rotation to simulate water movement
    currentRef.current.rotation.y = time * 0.05;
    
    // Subtle position offset
    currentRef.current.position.x = Math.sin(time * 0.3) * 0.5;
    currentRef.current.position.z = Math.cos(time * 0.2) * 0.3;
  });

  return (
    <group ref={currentRef}>
      {currentLines.map((points, index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#4da6ff"
            transparent
            opacity={0.1}
          />
        </line>
      ))}
    </group>
  );
}

// God Rays Effect
export function GodRays() {
  const raysRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!raysRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Gentle swaying motion
    raysRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
    raysRef.current.children.forEach((ray, index) => {
      ray.rotation.z = Math.sin(time * 0.3 + index * 0.2) * 0.05;
    });
  });

  return (
    <group ref={raysRef} position={[0, 10, 0]}>
      {[...Array(8)].map((_, index) => (
        <mesh
          key={index}
          position={[
            (index - 4) * 5,
            0,
            0
          ]}
          rotation={[0, 0, Math.PI / 8]}
        >
          <planeGeometry args={[2, 30]} />
          <meshBasicMaterial
            color="#80d4ff"
            transparent
            opacity={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}