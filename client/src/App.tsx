import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";
import * as THREE from "three";
import { isWebGLSupported, createWebGLFallbackMessage } from "./lib/webglDetection";

import GameScene from "./components/game/GameScene";
import MobileControls from "./components/ui/MobileControls";
import InstructionsOverlay from "./components/ui/InstructionsOverlay";
import ProjectOverlay from "./components/ui/ProjectOverlay";
import { useGamefolio } from "./lib/stores/useGamefolio";
import { useIsMobile } from "./hooks/use-is-mobile";

// Define control keys for the underwater fish game
enum Controls {
  forward = 'forward',
  backward = 'backward',
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
  boost = 'boost',
  interact = 'interact'
}

// Main App component for Gamefolio
function App() {
  const { showInstructions, activeProject } = useGamefolio();
  const isMobile = useIsMobile();
  const [showCanvas, setShowCanvas] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // Define key mappings for desktop controls
  const keyMap = [
    { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
    { name: Controls.backward, keys: ['ArrowDown', 'KeyS'] },
    { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
    { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
    { name: Controls.up, keys: ['KeyQ'] },
    { name: Controls.down, keys: ['KeyE'] },
    { name: Controls.boost, keys: ['Space'] },
    { name: Controls.interact, keys: ['Enter', 'KeyF'] },
  ];

  // Check WebGL support and show the canvas once everything is loaded
  useEffect(() => {
    console.log('🐠 Gamefolio initializing...');
    console.log(`📱 Mobile device detected: ${isMobile}`);
    
    // Force WebGL context creation test
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const hasWebGL = !!gl;
    
    console.log('🎮 WebGL supported:', hasWebGL);
    console.log('🎮 WebGL context:', gl);
    
    if (!hasWebGL) {
      setWebglSupported(false);
      console.error('❌ WebGL not supported - showing fallback');
      // Add fallback message to the DOM
      const fallbackElement = createWebGLFallbackMessage();
      document.body.appendChild(fallbackElement);
    } else {
      setWebglSupported(true);
      setShowCanvas(true);
      console.log('✅ WebGL supported - showing canvas');
    }
  }, [isMobile]);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden',
      background: 'linear-gradient(to bottom, #001122 0%, #000511 100%)',
      zIndex: 1
    }}>
      {webglSupported && showCanvas && (
        <KeyboardControls map={keyMap}>
          {/* Main 3D Canvas */}
          <Canvas
            shadows
            camera={{
              position: [0, 5, 10],
              fov: 60,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: !isMobile,
              powerPreference: isMobile ? "low-power" : "high-performance",
              alpha: false,
              preserveDrawingBuffer: false,
              failIfMajorPerformanceCaveat: false,
              shadowMap: {
                enabled: true,
                type: THREE.PCFSoftShadowMap
              },
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2,
              outputColorSpace: THREE.SRGBColorSpace
            }}
            style={{ 
              width: '100%', 
              height: '100%',
              display: 'block'
            }}
            onCreated={(state) => {
              console.log('🎨 Canvas created successfully');
              console.log('🎨 WebGL context:', state.gl.getContext());
              console.log('✅ WebGL supported - showing canvas');
            }}
          >
            {/* Underwater gradient background */}
            <color attach="background" args={["#001122"]} />
            
            <Suspense fallback={null}>
              <GameScene />
            </Suspense>
          </Canvas>

          {/* Mobile Controls Overlay */}
          {isMobile && <MobileControls />}

          {/* Instructions Overlay */}
          {showInstructions && <InstructionsOverlay />}

          {/* Project Details Overlay */}
          {activeProject && <ProjectOverlay project={activeProject} />}

          {/* Section Hint */}
          <div className="section-hint">
            {isMobile ? 
              "Use joystick to swim, boost button for speed" : 
              "Arrow keys or WASD to swim, Space for boost"
            }
          </div>
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
