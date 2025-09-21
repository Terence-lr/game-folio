<script>
  import { onMount } from 'svelte';
  
  let showInstructions = true;
  let currentSpeed = 0;
  let isBoosting = false;
  
  onMount(() => {
    // Hide instructions after 5 seconds
    setTimeout(() => {
      showInstructions = false;
    }, 5000);
  });
</script>

<!-- Instructions Panel -->
{#if showInstructions}
  <div class="instructions-panel">
    <h2>🎮 GAMEFOLIO</h2>
    <p>Interactive 3D Portfolio Experience</p>
    
    <div class="controls-section">
      <h3>Controls</h3>
      <div class="controls-grid">
        <div class="control-item">
          <span class="key">W</span>
          <span>Forward</span>
        </div>
        <div class="control-item">
          <span class="key">S</span>
          <span>Backward</span>
        </div>
        <div class="control-item">
          <span class="key">A</span>
          <span>Left</span>
        </div>
        <div class="control-item">
          <span class="key">D</span>
          <span>Right</span>
        </div>
        <div class="control-item">
          <span class="key">Q</span>
          <span>Up</span>
        </div>
        <div class="control-item">
          <span class="key">E</span>
          <span>Down</span>
        </div>
        <div class="control-item">
          <span class="key">SPACE</span>
          <span>Boost</span>
        </div>
      </div>
    </div>
    
    <div class="info-section">
      <p>🎯 Click on billboards to view projects</p>
      <p>🌍 Explore the starry night world</p>
      <p>⚡ Physics-based interactions</p>
    </div>
    
    <button class="close-btn" on:click={() => showInstructions = false}>
      ✕
    </button>
  </div>
{/if}

<!-- Speed Indicator -->
<div class="speed-indicator">
  <div class="speed-bar">
    <div class="speed-fill" style="width: {currentSpeed}%"></div>
  </div>
  <span class="speed-text">
    Speed: {Math.round(currentSpeed)}%
    {#if isBoosting}
      <span class="boost-indicator">⚡ BOOST</span>
    {/if}
  </span>
</div>

<!-- Portfolio Info Panel -->
<div class="portfolio-panel" class:hidden={!showPortfolio}>
  <h3 id="portfolio-title">Portfolio Project</h3>
  <p id="portfolio-description">Project description will appear here.</p>
  <a id="portfolio-link" href="https://github.com" target="_blank" rel="noopener noreferrer">
    View Project →
  </a>
  <button class="close-btn" on:click={() => showPortfolio = false}>
    ✕
  </button>
</div>

<!-- XR Controls -->
<div class="xr-controls">
  <button class="xr-btn" on:click={() => enterXR()}>
    🥽 Enter VR
  </button>
</div>

<style>
  .instructions-panel {
    position: fixed;
    top: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px;
    border-radius: 15px;
    border: 2px solid rgba(135, 206, 235, 0.3);
    backdrop-filter: blur(10px);
    max-width: 300px;
    z-index: 1000;
    font-family: 'Courier New', monospace;
  }
  
  .instructions-panel h2 {
    margin: 0 0 10px 0;
    color: #87ceeb;
    font-size: 1.5rem;
  }
  
  .instructions-panel p {
    margin: 0 0 15px 0;
    color: #98d8e8;
  }
  
  .controls-section h3 {
    color: #87ceeb;
    margin: 0 0 10px 0;
    font-size: 1.1rem;
  }
  
  .controls-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 15px;
  }
  
  .control-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
  }
  
  .key {
    background: linear-gradient(45deg, #4a90e2, #87ceeb);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: bold;
    min-width: 30px;
    text-align: center;
    font-size: 0.8rem;
  }
  
  .info-section p {
    margin: 5px 0;
    font-size: 0.9rem;
    color: #a8e6cf;
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: #87ceeb;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 5px;
  }
  
  .speed-indicator {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px;
    border-radius: 10px;
    border: 2px solid rgba(135, 206, 235, 0.3);
    backdrop-filter: blur(10px);
    z-index: 1000;
    font-family: 'Courier New', monospace;
  }
  
  .speed-bar {
    width: 200px;
    height: 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
  }
  
  .speed-fill {
    height: 100%;
    background: linear-gradient(90deg, #4a90e2, #87ceeb);
    transition: width 0.3s ease;
  }
  
  .speed-text {
    font-size: 0.9rem;
    color: #98d8e8;
  }
  
  .boost-indicator {
    color: #ff6b35;
    font-weight: bold;
    margin-left: 10px;
  }
  
  .portfolio-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 30px;
    border-radius: 20px;
    border: 2px solid rgba(135, 206, 235, 0.5);
    backdrop-filter: blur(15px);
    max-width: 500px;
    z-index: 1001;
    font-family: 'Courier New', monospace;
  }
  
  .portfolio-panel.hidden {
    display: none;
  }
  
  .portfolio-panel h3 {
    color: #87ceeb;
    margin: 0 0 15px 0;
    font-size: 1.5rem;
  }
  
  .portfolio-panel p {
    color: #98d8e8;
    margin: 0 0 20px 0;
    line-height: 1.5;
  }
  
  .portfolio-panel a {
    color: #4a90e2;
    text-decoration: none;
    font-weight: bold;
    border: 2px solid #4a90e2;
    padding: 10px 20px;
    border-radius: 25px;
    display: inline-block;
    transition: all 0.3s ease;
  }
  
  .portfolio-panel a:hover {
    background: #4a90e2;
    color: white;
  }
  
  .xr-controls {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
  }
  
  .xr-btn {
    background: linear-gradient(45deg, #4a90e2, #87ceeb);
    color: white;
    border: none;
    padding: 15px 25px;
    border-radius: 25px;
    font-weight: bold;
    cursor: pointer;
    font-family: 'Courier New', monospace;
    transition: all 0.3s ease;
  }
  
  .xr-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(74, 144, 226, 0.6);
  }
</style>
