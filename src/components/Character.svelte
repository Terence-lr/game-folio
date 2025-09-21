<script>
  import { Mesh, Group, CylinderGeometry, SphereGeometry } from '@threlte/core';
  import { MeshStandardMaterial } from 'three';
  import { onMount, onDestroy } from 'svelte';
  import { useFrame } from '@threlte/core';
  
  // Materials
  const personMaterial = new MeshStandardMaterial({ 
    color: 0x6b7280,
    roughness: 0.8,
    metalness: 0.1
  });
  
  const legMaterial = new MeshStandardMaterial({ 
    color: 0x4a4a4a,
    roughness: 0.8,
    metalness: 0.1
  });
  
  // Movement state
  let moveState = { forward: 0, strafe: 0, up: 0 };
  let isBoosting = false;
  let characterGroup;
  
  // Movement constants
  const baseSpeed = 10.0;
  const boostMultiplier = 2.5;
  
  // Keyboard controls
  const handleKeyDown = (event) => {
    switch(event.key.toLowerCase()) {
      case 'w': moveState.forward = 1; break;
      case 's': moveState.forward = -1; break;
      case 'a': moveState.strafe = -1; break;
      case 'd': moveState.strafe = 1; break;
      case 'q': moveState.up = 1; break;
      case 'e': moveState.up = -1; break;
      case ' ': isBoosting = true; break;
    }
  };
  
  const handleKeyUp = (event) => {
    switch(event.key.toLowerCase()) {
      case 'w':
      case 's': moveState.forward = 0; break;
      case 'a':
      case 'd': moveState.strafe = 0; break;
      case 'q':
      case 'e': moveState.up = 0; break;
      case ' ': isBoosting = false; break;
    }
  };
  
  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  });
  
  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  });
  
  // Animation loop
  useFrame(({ delta }) => {
    if (characterGroup) {
      const speedMultiplier = isBoosting ? boostMultiplier : 1.0;
      const speed = baseSpeed * speedMultiplier;
      
      // Calculate movement direction
      const forward = new THREE.Vector3(0, 0, -moveState.forward);
      const strafe = new THREE.Vector3(moveState.strafe, 0, 0);
      const up = new THREE.Vector3(0, moveState.up, 0);
      
      // Apply movement
      const movement = forward.add(strafe).add(up).multiplyScalar(speed * delta);
      characterGroup.position.add(movement);
      
      // Character rotation based on movement
      if (moveState.forward !== 0 || moveState.strafe !== 0) {
        const angle = Math.atan2(moveState.strafe, -moveState.forward);
        characterGroup.rotation.y = angle;
      }
    }
  });
</script>

<group bind:this={characterGroup} position={[0, 2, 0]}>
    <!-- Head -->
    <Mesh position={[0, 1.8, 0]} castShadow receiveShadow>
      <SphereGeometry args={[0.4, 8, 6]} />
      <MeshStandardMaterial attach="material" {...personMaterial} />
    </Mesh>
    
    <!-- Body -->
    <Mesh position={[0, 1, 0]} castShadow receiveShadow>
      <CylinderGeometry args={[0.3, 0.4, 1.2, 8]} />
      <MeshStandardMaterial attach="material" {...personMaterial} />
    </Mesh>
    
    <!-- Left Arm -->
    <Mesh position={[-0.5, 1.2, 0]} castShadow receiveShadow>
      <CylinderGeometry args={[0.1, 0.1, 0.8, 6]} />
      <MeshStandardMaterial attach="material" {...personMaterial} />
    </Mesh>
    
    <!-- Right Arm -->
    <Mesh position={[0.5, 1.2, 0]} castShadow receiveShadow>
      <CylinderGeometry args={[0.1, 0.1, 0.8, 6]} />
      <MeshStandardMaterial attach="material" {...personMaterial} />
    </Mesh>
    
    <!-- Left Leg -->
    <Mesh position={[-0.2, 0.2, 0]} castShadow receiveShadow>
      <CylinderGeometry args={[0.15, 0.15, 0.8, 6]} />
      <MeshStandardMaterial attach="material" {...legMaterial} />
    </Mesh>
    
    <!-- Right Leg -->
    <Mesh position={[0.2, 0.2, 0]} castShadow receiveShadow>
      <CylinderGeometry args={[0.15, 0.15, 0.8, 6]} />
      <MeshStandardMaterial attach="material" {...legMaterial} />
    </Mesh>
    
    <!-- Eyes -->
    <Mesh position={[-0.15, 1.9, 0.35]} castShadow>
      <SphereGeometry args={[0.05, 6, 4]} />
      <MeshStandardMaterial attach="material" color={0x000000} />
    </Mesh>
    
    <Mesh position={[0.15, 1.9, 0.35]} castShadow>
      <SphereGeometry args={[0.05, 6, 4]} />
      <MeshStandardMaterial attach="material" color={0x000000} />
    </Mesh>
</group>
