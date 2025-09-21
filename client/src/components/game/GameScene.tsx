import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

import UnderwaterWorld from "./UnderwaterWorld";
import Fish from "./Fish";
import PortfolioSection from "./PortfolioSection";
import SkillsCrystal from "./SkillsCrystal";
import { useFishMovementLogic } from "../../hooks/useFishMovementLogic";
import { useProximityDetection } from "../../hooks/useProximityDetection";
import { useCameraControls } from "../../hooks/useCameraControls";
import { projects } from "../../data/projects";
import { skills } from "../../data/skills";

export default function GameScene() {
  const sceneRef = useRef<THREE.Group>(null);
  const { fishPosition, fishRotation } = useFishMovementLogic();
  
  // Use proximity detection for interactive elements
  useProximityDetection(fishPosition);
  
  // Enhanced camera controls with touch support
  const cameraControls = useCameraControls({
    target: fishPosition,
    followOffset: new THREE.Vector3(0, 3, 8),
    smoothing: 2.5,
    enableTouch: true,
    enableZoom: true
  });

  // Fish movement is handled by useFishMovementLogic hook
  // Camera is handled by useCameraControls hook

  // Track scene connectivity properly
  useEffect(() => {
    const checkSceneConnection = () => {
      if (sceneRef.current) {
        console.log('🎮 Scene connected with children:', sceneRef.current.children.length);
        console.log('🎮 Scene UUID:', sceneRef.current.uuid);
        console.log('🎮 Scene parent:', sceneRef.current.parent?.type || 'No parent');
        
        // Log each child type for debugging
        sceneRef.current.children.forEach((child, index) => {
          console.log(`🎮 Child ${index}:`, child.type, child.name || 'unnamed');
        });
      }
    };
    
    // Check immediately
    checkSceneConnection();
    
    // Check again after scene has time to populate
    const timeout = setTimeout(checkSceneConnection, 200);
    return () => clearTimeout(timeout);
  }, []);

  console.log('🎮 GameScene rendered with fish at:', fishPosition);
  console.log('📷 Camera controls active with touch/zoom support');

  return (
    <group ref={sceneRef}>
      {/* Enhanced Bruno Simon-style Lighting Setup */}
      <ambientLight intensity={0.4} color="#4da6ff" />
      
      {/* Main directional light with high-quality shadows */}
      <directionalLight
        position={[10, 20, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={100}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0001}
      />
      
      {/* Underwater god rays effect - enhanced */}
      <directionalLight
        position={[0, 30, 0]}
        intensity={0.6}
        color="#80d4ff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Additional fill lights for depth */}
      <pointLight
        position={[-20, 5, -10]}
        intensity={0.5}
        color="#66b3ff"
        distance={50}
        decay={2}
      />
      
      <pointLight
        position={[20, -10, -20]}
        intensity={0.3}
        color="#4d79ff"
        distance={40}
        decay={2}
      />

      {/* Underwater World Environment */}
      <UnderwaterWorld />

      {/* Main Fish Character */}
      <Fish 
        position={fishPosition} 
        rotation={fishRotation}
      />

      {/* SECTION 1: SURFACE ENTRY - "THE DIVE" */}
      <PortfolioSection
        position={[0, 15, 0]}
        type="surface"
        title="Welcome to Gamefolio"
        description="Dive deep to explore Terence Richardson's portfolio"
        color="#4da6ff"
      />

      {/* SECTION 2: INTRO REEF - "WELCOME WATERS" */}
      <PortfolioSection
        position={[10, 0, -5]}
        type="intro"
        title="About Terence"
        description="AI-Native Software Engineer & Builder in NYC"
        color="#ff6b6b"
      />

      {/* SECTION 3: PROJECT KELP FOREST - "INNOVATION DEPTHS" */}
      {projects.map((project, index) => (
        <PortfolioSection
          key={project.id}
          position={[
            -15 + (index * 8), 
            -5, 
            -10 - (index * 5)
          ]}
          type="project"
          title={project.title}
          description={project.description}
          color={project.color}
          project={project}
        />
      ))}

      {/* SECTION 4: SKILLS CAVERN - "CRYSTAL CHAMBERS" */}
      {skills.map((skill, index) => (
        <SkillsCrystal
          key={skill.name}
          position={[
            -25 + (index % 4) * 5,
            -15,
            -25 - Math.floor(index / 4) * 5
          ]}
          skill={skill}
        />
      ))}

      {/* SECTION 5: EXPERIENCE SHIPWRECK - "CAREER TIMELINE" */}
      <PortfolioSection
        position={[0, -20, -40]}
        type="experience"
        title="Career Journey"
        description="Professional experience and achievements"
        color="#8b4513"
      />

      {/* SECTION 6: CONTACT DEPTHS - "COMMUNICATION TRENCH" */}
      <PortfolioSection
        position={[0, -30, -60]}
        type="contact"
        title="Let's Connect"
        description="Get in touch for opportunities and collaboration"
        color="#40e0d0"
      />

      {/* Enhanced Ocean Floor */}
      <mesh position={[0, -35, -30]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial 
          color="#2c1810"
          roughness={0.8}
          metalness={0.1}
          envMapIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
