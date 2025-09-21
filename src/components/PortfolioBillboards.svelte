<script>
  import { Mesh, Group, BoxGeometry, CylinderGeometry } from '@threlte/core';
  import { MeshStandardMaterial, TextGeometry, FontLoader } from 'three';
  import { onMount } from 'svelte';
  import { useFrame } from '@threlte/core';
  
  // Portfolio data
  const portfolioData = [
    {
      title: "Web Development",
      subtitle: "Full-Stack Projects",
      description: "Modern web applications built with React, Node.js, and modern frameworks.",
      color: 0x4a90e2,
      position: [15, 2, -10],
      link: "https://github.com/your-username"
    },
    {
      title: "3D Graphics",
      subtitle: "Three.js & WebGL",
      description: "Interactive 3D experiences and visualizations using WebGL technologies.",
      color: 0x87ceeb,
      position: [-15, 2, -10],
      link: "https://github.com/your-username"
    },
    {
      title: "Mobile Apps",
      subtitle: "React Native",
      description: "Cross-platform mobile applications with native performance.",
      color: 0x98d8e8,
      position: [0, 2, -20],
      link: "https://github.com/your-username"
    },
    {
      title: "AI/ML Projects",
      subtitle: "Machine Learning",
      description: "Artificial intelligence and machine learning implementations.",
      color: 0xa8e6cf,
      position: [25, 2, 5],
      link: "https://github.com/your-username"
    }
  ];
  
  let billboards = [];
  let font;
  
  // Materials
  const frameMaterial = new MeshStandardMaterial({ 
    color: 0x2a2a2a,
    metalness: 0.6,
    roughness: 0.4
  });
  
  const standMaterial = new MeshStandardMaterial({ 
    color: 0x1a1a1a,
    metalness: 0.6,
    roughness: 0.4
  });
  
  onMount(() => {
    // Load font for 3D text
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (loadedFont) => {
      font = loadedFont;
      console.log('Font loaded for billboards');
    });
  });
  
  // Animation loop
  useFrame(({ delta, camera }) => {
    billboards.forEach((billboard, index) => {
      if (billboard.group) {
        // Rotate billboard
        billboard.group.rotation.y += delta * 0.2;
        
        // Float up and down
        billboard.group.position.y = portfolioData[index].position[1] + Math.sin(Date.now() * 0.001 + index) * 0.3;
        
        // Pulsing light
        if (billboard.light) {
          billboard.light.intensity = 4 + Math.sin(Date.now() * 0.003 + index) * 2;
        }
      }
    });
  });
  
  const handleBillboardClick = (link) => {
    window.open(link, '_blank');
  };
</script>

{#each portfolioData as data, index}
  <group
    position={data.position}
    bind:this={(el) => billboards[index] = { group: el }}
    interactive
    cursor="pointer"
    on:click={() => handleBillboardClick(data.link)}
  >
      <!-- Billboard Frame -->
      <Mesh castShadow receiveShadow>
        <BoxGeometry args={[6, 4, 0.2]} />
        <MeshStandardMaterial attach="material" {...frameMaterial} />
      </Mesh>
      
      <!-- Screen -->
      <Mesh position={[0, 0, 0.1]} castShadow receiveShadow>
        <BoxGeometry args={[5.5, 3.5, 0.1]} />
        <MeshStandardMaterial 
          attach="material" 
          color={data.color}
          emissive={data.color}
          emissiveIntensity={0.3}
          metalness={0.3}
          roughness={0.1}
          envMapIntensity={1.0}
        />
      </Mesh>
      
      <!-- 3D Text Title -->
      {#if font}
        <Mesh position={[0, 0.5, 0.2]} castShadow>
          <TextGeometry 
            args={[data.title, { font, size: 0.3, height: 0.05 }]} 
          />
          <MeshStandardMaterial 
            attach="material" 
            color={0xffffff}
            metalness={0.8}
            roughness={0.2}
            emissive={0xffffff}
            emissiveIntensity={0.1}
          />
        </Mesh>
        
        <!-- 3D Text Subtitle -->
        <Mesh position={[0, -0.2, 0.2]} castShadow>
          <TextGeometry 
            args={[data.subtitle, { font, size: 0.2, height: 0.03 }]} 
          />
          <MeshStandardMaterial 
            attach="material" 
            color={0xcccccc}
            metalness={0.6}
            roughness={0.3}
          />
        </Mesh>
      {/if}
      
      <!-- Stand -->
      <Mesh position={[0, -2, 0]} castShadow receiveShadow>
        <CylinderGeometry args={[0.2, 0.3, 2, 8]} />
        <MeshStandardMaterial attach="material" {...standMaterial} />
      </Mesh>
      
      <!-- Glowing Light -->
      <pointLight
        bind:this={(el) => billboards[index].light = el}
        color={data.color}
        intensity={4}
        distance={25}
        position={[0, 3, 0]}
      />
    </group>
{/each}
