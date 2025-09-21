<script>
  import { onMount } from 'svelte';
  import Scene from './components/Scene.svelte';
  import UI from './components/UI.svelte';
  
  let canvas;
  
  onMount(() => {
    console.log('Svelte + Threlte 3D Portfolio loaded!');
  });
</script>

<main>
  <canvas bind:this={canvas} id="bg"></canvas>
  <Scene {canvas} />
  <UI />
</main>

<style>
  main {
    position: relative;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: linear-gradient(135deg, #0a0a2e 0%, #1a3a5c 50%, #2d5016 100%);
  }
  
  #bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
</style>
