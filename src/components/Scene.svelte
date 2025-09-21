<script>
  import { onMount } from 'svelte';
  import { Canvas } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { World, RigidBody, Collider } from '@threlte/rapier';
  import XRSupport from './XRSupport.svelte';
  import Animations from './Animations.svelte';
  
  export let canvas;
  
  let sceneReady = false;
  
  onMount(() => {
    sceneReady = true;
    console.log('3D Scene initialized with Threlte + Physics + XR + Animations!');
  });
</script>

{#if sceneReady}
  <Canvas
    {canvas}
    gl={{
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
      preserveDrawingBuffer: false
    }}
    camera={{
      fov: 75,
      near: 0.1,
      far: 1000,
      position: [0, 5, 15]
    }}
    scene={{
      fog: {
        type: 'FogExp2',
        color: 0x0a0a2e,
        density: 0.005
      }
    }}
  >
    <!-- Lighting -->
    <ambientLight intensity={0.4} color={0x1a1a3a}></ambientLight>
    <directionalLight
      position={[10, 10, 5]}
      intensity={0.8}
      color={0x87ceeb}
      castShadow
      shadow={{
        mapSize: { width: 4096, height: 4096 },
        camera: { near: 0.5, far: 50 }
      }}
    ></directionalLight>
    
    <!-- Physics World -->
    <World
      gravity={[0, -9.81, 0]}
      debug={false}
      paused={false}
      timeStep={1/60}
    >
      <!-- Environment -->
      <Environment />
      
      <!-- Character -->
      <Character />
      
      <!-- Portfolio Billboards -->
      <PortfolioBillboards />
    </World>
    
    <!-- Controls -->
    <OrbitControls
      enableDamping
      dampingFactor={0.05}
      enableZoom={true}
      enablePan={true}
      enableRotate={true}
    ></OrbitControls>
    
    <!-- Animation System -->
    <Animations />
    
    <!-- XR Support -->
    <XRSupport />
    
    <!-- Physics-based 3D Portfolio with Rapier -->
  </Canvas>
{/if}
