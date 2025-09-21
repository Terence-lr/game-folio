<script>
  import { Mesh, BoxGeometry, PlaneGeometry, CylinderGeometry, SphereGeometry } from '@threlte/core';
  import { MeshStandardMaterial } from 'three';
  import { RigidBody, Collider } from '@threlte/rapier';
  import { onMount } from 'svelte';
  
  // Materials
  const groundMaterial = new MeshStandardMaterial({ 
    color: 0x2d5016,
    roughness: 0.9,
    metalness: 0.0
  });
  
  const waterMaterial = new MeshStandardMaterial({ 
    color: 0x1e3a8a,
    roughness: 0.0,
    metalness: 1.0,
    transparent: true,
    opacity: 0.9,
    envMapIntensity: 1.0
  });
  
  const grassMaterial = new MeshStandardMaterial({ 
    color: 0x4a7c59,
    roughness: 0.8,
    metalness: 0.1
  });
  
  const rockMaterial = new MeshStandardMaterial({ 
    color: 0x4a4a4a,
    roughness: 0.9,
    metalness: 0.1
  });
  
  const crystalMaterial = new MeshStandardMaterial({ 
    color: 0x87ceeb,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x1a3a5c,
    emissiveIntensity: 0.2
  });
  
  const treeTrunkMaterial = new MeshStandardMaterial({ 
    color: 0x3a3a3a,
    roughness: 0.8,
    metalness: 0.1
  });
  
  const treeTopMaterial = new MeshStandardMaterial({ 
    color: 0x4a7c59,
    emissive: 0x1a3a5c,
    emissiveIntensity: 0.1
  });
  
  // Procedural generation
  let proceduralObjects = [];
  
  onMount(() => {
    // Generate procedural objects
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      const y = Math.random() * 3 + 1;
      
      const objectType = Math.random();
      let object;
      
      if (objectType < 0.3) {
        // Crystal
        object = {
          type: 'crystal',
          position: [x, y, z],
          geometry: 'cone',
          material: crystalMaterial
        };
      } else if (objectType < 0.6) {
        // Rock
        object = {
          type: 'rock',
          position: [x, y, z],
          geometry: 'sphere',
          material: rockMaterial
        };
      } else {
        // Tree
        object = {
          type: 'tree',
          position: [x, y, z],
          geometry: 'cylinder',
          material: treeTrunkMaterial
        };
      }
      
      proceduralObjects.push(object);
    }
  });
</script>

<!-- Main Ground -->
<RigidBody type="fixed" position={[0, -1, 0]}>
  <Collider type="cuboid" args={[25, 0.5, 25]} />
  <Mesh castShadow receiveShadow>
    <BoxGeometry args={[50, 1, 50]} />
    <MeshStandardMaterial attach="material" {...groundMaterial} />
  </Mesh>
</RigidBody>

<!-- Procedural Terrain -->
<Mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} castShadow receiveShadow>
  <PlaneGeometry args={[100, 100, 64, 64]} />
  <MeshStandardMaterial attach="material" {...groundMaterial} />
</Mesh>

<!-- Water Body -->
<RigidBody type="fixed" position={[0, 0, 0]}>
  <Collider type="cylinder" args={[15, 0.25]} />
  <Mesh castShadow receiveShadow>
    <CylinderGeometry args={[15, 15, 0.5, 32]} />
    <MeshStandardMaterial attach="material" {...waterMaterial} />
  </Mesh>
</RigidBody>

<!-- Grass Patches -->
{#each Array(15) as _, i}
  <Mesh
    position={[
      (Math.random() - 0.5) * 40,
      0,
      (Math.random() - 0.5) * 40
    ]}
    castShadow
    receiveShadow
  >
    <CylinderGeometry args={[0.5, 0.5, 0.3, 6]} />
    <MeshStandardMaterial attach="material" {...grassMaterial} />
  </Mesh>
{/each}

<!-- Procedural Objects -->
{#each proceduralObjects as obj}
  <RigidBody 
    type="dynamic" 
    position={obj.position} 
    mass={obj.type === 'crystal' ? 0.5 : obj.type === 'rock' ? 2.0 : 5.0}
  >
    {#if obj.type === 'crystal'}
      <Collider type="cone" args={[0.5, 2]} />
      <Mesh castShadow receiveShadow>
        <ConeGeometry args={[0.5 + Math.random() * 1, 2 + Math.random() * 2, 6]} />
        <MeshStandardMaterial attach="material" {...obj.material} />
      </Mesh>
    {:else if obj.type === 'rock'}
      <Collider type="ball" args={[0.5]} />
      <Mesh castShadow receiveShadow>
        <SphereGeometry args={[0.5 + Math.random() * 1, 8, 6]} />
        <MeshStandardMaterial attach="material" {...obj.material} />
      </Mesh>
    {:else if obj.type === 'tree'}
      <Collider type="cuboid" args={[0.3, 2, 0.3]} />
      <group>
        <!-- Trunk -->
        <Mesh position={[0, 1, 0]} castShadow receiveShadow>
          <CylinderGeometry args={[0.2, 0.3, 2 + Math.random() * 2, 6]} />
          <MeshStandardMaterial attach="material" {...obj.material} />
        </Mesh>
        <!-- Leaves -->
        <Mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <SphereGeometry args={[1 + Math.random(), 6, 4]} />
          <MeshStandardMaterial attach="material" {...treeTopMaterial} />
        </Mesh>
      </group>
    {/if}
  </RigidBody>
{/each}
