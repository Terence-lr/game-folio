<script>
  import { onMount } from 'svelte';
  import { XR, ARButton, VRButton, XRButton } from '@threlte/xr';
  // XR support without useFrame for now
  
  let xrSupported = false;
  let vrSupported = false;
  let arSupported = false;
  let isXRActive = false;
  
  onMount(() => {
    // Check XR support
    if (navigator.xr) {
      xrSupported = true;
      
      // Check VR support
      navigator.xr.isSessionSupported('immersive-vr').then(supported => {
        vrSupported = supported;
      });
      
      // Check AR support
      navigator.xr.isSessionSupported('immersive-ar').then(supported => {
        arSupported = supported;
      });
    }
  });
  
  const handleXRStart = () => {
    isXRActive = true;
    console.log('XR session started');
  };
  
  const handleXREnd = () => {
    isXRActive = false;
    console.log('XR session ended');
  };
  
  // XR-specific animations - simplified for now
  onMount(() => {
    const animate = () => {
      if (isXRActive) {
        // Adjust UI for XR mode
        // Reduce complexity for better performance in VR/AR
      }
      requestAnimationFrame(animate);
    };
    animate();
  });
</script>

<!-- XR Support -->
<XR
  on:sessionstart={handleXRStart}
  on:sessionend={handleXREnd}
>
  <!-- VR Button -->
  {#if vrSupported}
    <VRButton
      style="position: fixed; bottom: 20px; right: 20px; z-index: 1000; background: linear-gradient(45deg, #4a90e2, #87ceeb); color: white; border: none; padding: 15px 25px; border-radius: 25px; font-weight: bold; cursor: pointer; font-family: 'Courier New', monospace;"
    />
  {/if}
  
  <!-- AR Button -->
  {#if arSupported}
    <ARButton
      style="position: fixed; bottom: 80px; right: 20px; z-index: 1000; background: linear-gradient(45deg, #87ceeb, #98d8e8); color: white; border: none; padding: 15px 25px; border-radius: 25px; font-weight: bold; cursor: pointer; font-family: 'Courier New', monospace;"
    />
  {/if}
  
  <!-- XR Button (fallback) -->
  {#if xrSupported && !vrSupported && !arSupported}
    <XRButton
      style="position: fixed; bottom: 20px; right: 20px; z-index: 1000; background: linear-gradient(45deg, #4a90e2, #87ceeb); color: white; border: none; padding: 15px 25px; border-radius: 25px; font-weight: bold; cursor: pointer; font-family: 'Courier New', monospace;"
    />
  {/if}
</XR>

<!-- XR Status Indicator -->
{#if xrSupported}
  <div class="xr-status" class:active={isXRActive}>
    {#if isXRActive}
      <span class="xr-indicator">🥽 XR Active</span>
    {:else}
      <span class="xr-indicator">🥽 XR Ready</span>
    {/if}
  </div>
{/if}

<style>
  .xr-status {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    z-index: 1000;
    border: 2px solid rgba(135, 206, 235, 0.3);
    backdrop-filter: blur(10px);
  }
  
  .xr-status.active {
    border-color: #4a90e2;
    background: rgba(74, 144, 226, 0.2);
  }
  
  .xr-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
