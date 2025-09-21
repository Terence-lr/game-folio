// WebGL Detection and Fallback Utility
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

export function isWebGL2Supported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    return !!gl;
  } catch (e) {
    return false;
  }
}

export function getWebGLErrorMessage(): string {
  const messages = {
    no_webgl: 'Your browser does not support WebGL, which is required for this 3D experience.',
    no_webgl2: 'Your browser supports WebGL but not WebGL2. Some features may be limited.',
    blacklisted: 'WebGL is disabled for your graphics card/driver. Please update your drivers.',
    context_lost: 'WebGL context was lost. Please refresh the page.'
  };

  if (!isWebGLSupported()) {
    return messages.no_webgl;
  } else if (!isWebGL2Supported()) {
    return messages.no_webgl2;
  }

  return messages.context_lost;
}

export function createWebGLFallbackMessage(): HTMLElement {
  const fallback = document.createElement('div');
  fallback.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(to bottom, #001122 0%, #000511 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-family: 'Inter', sans-serif;
    text-align: center;
    padding: 2rem;
    z-index: 9999;
  `;

  fallback.innerHTML = `
    <div style="max-width: 600px;">
      <h1 style="color: #dc143c; font-size: 2rem; margin-bottom: 1rem;">
        🐠 Gamefolio - Underwater Portfolio
      </h1>
      <p style="font-size: 1.2rem; margin-bottom: 2rem; color: #b3d9ff;">
        ${getWebGLErrorMessage()}
      </p>
      <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="color: #4da6ff; margin-bottom: 1rem;">About This Portfolio</h3>
        <p style="color: #e5e5e5; line-height: 1.6;">
          Gamefolio is an immersive 3D underwater world where you control a fish swimming through 
          different sections to explore Terence Richardson's portfolio projects and skills.
        </p>
      </div>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <a href="https://total-job-tracker.vercel.app/" target="_blank" 
           style="background: #dc143c; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 4px;">
          View Job Tracker Project
        </a>
        <a href="https://www.trichardson.dev/" target="_blank"
           style="background: #0066cc; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 4px;">
          View Portfolio Site
        </a>
        <a href="https://github.com/Terence-lr" target="_blank"
           style="background: #2d8659; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 4px;">
          GitHub Profile
        </a>
      </div>
      <p style="margin-top: 2rem; color: #6bb6ff; font-size: 0.9rem;">
        To experience the full 3D underwater portfolio, please try:
        <br>• Updating your browser to the latest version
        <br>• Enabling hardware acceleration in browser settings
        <br>• Using Chrome, Firefox, or Safari
      </p>
    </div>
  `;

  return fallback;
}