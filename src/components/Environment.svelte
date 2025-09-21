<script>
  import { Mesh, BoxGeometry, PlaneGeometry, CylinderGeometry, SphereGeometry } from '@threlte/core';
  import { MeshStandardMaterial } from 'three';
  // Physics temporarily disabled for compatibility
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
<Mesh position={[0, -1, 0]} castShadow receiveShadow>
  <BoxGeometry args={[50, 1, 50]} />
  <MeshStandardMaterial attach="material" {...groundMaterial} />
</Mesh>

<!-- Procedural Terrain -->
<Mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} castShadow receiveShadow>
  <PlaneGeometry args={[100, 100, 64, 64]} />
  <MeshStandardMaterial attach="material" {...groundMaterial} />
</Mesh>

<!-- Water Body -->
<Mesh position={[0, 0, 0]} castShadow receiveShadow>
  <CylinderGeometry args={[15, 15, 0.5, 32]} />
  <MeshStandardMaterial attach="material" {...waterMaterial} />
</Mesh>

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
  <group position={obj.position}>
    {#if obj.type === 'crystal'}
      <Mesh castShadow receiveShadow>
        <ConeGeometry args={[0.5 + Math.random() * 1, 2 + Math.random() * 2, 6]} />
        <MeshStandardMaterial attach="material" {...obj.material} />
      </Mesh>
    {:else if obj.type === 'rock'}
      <Mesh castShadow receiveShadow>
        <SphereGeometry args={[0.5 + Math.random() * 1, 8, 6]} />
        <MeshStandardMaterial attach="material" {...obj.material} />
      </Mesh>
    {:else if obj.type === 'tree'}
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
  </group>
{/each}
