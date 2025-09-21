<script>
  import { ShaderMaterial } from 'three';
  // Shader system without useFrame for now
  
  // Custom shader materials inspired by The Book of Shaders
  const createAuroraShader = () => {
    return new ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        color1: { value: new THREE.Color(0x87ceeb) },
        color2: { value: new THREE.Color(0x4a90e2) },
        color3: { value: new THREE.Color(0x1a3a5c) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // Noise function from The Book of Shaders
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          
          vec2 u = f * f * (3.0 - 2.0 * f);
          
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        
        // Aurora effect
        float aurora(vec2 uv, float time) {
          float a = 0.0;
          
          // Multiple layers of aurora
          for(int i = 0; i < 3; i++) {
            float f = float(i + 1) * 0.1;
            float n = noise(uv * f + time * 0.5);
            a += sin(uv.x * f + time * 0.3) * cos(uv.y * f + time * 0.2) * n * 0.1;
          }
          
          return a;
        }
        
        void main() {
          vec2 uv = vUv;
          
          // Create aurora effect
          float auroraEffect = aurora(uv, time);
          
          // Mix colors based on aurora
          vec3 color = mix(color1, color2, auroraEffect);
          color = mix(color, color3, auroraEffect * 0.5);
          
          // Add some sparkle
          float sparkle = random(uv + time * 0.1) - 0.5;
          color += sparkle * 0.1;
          
          // Vignette effect
          float vignette = 1.0 - length(uv - 0.5) * 0.8;
          color *= vignette;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: true,
      opacity: 0.8
    });
  };
  
  const createWaterShader = () => {
    return new ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        color: { value: new THREE.Color(0x1e3a8a) },
        opacity: { value: 0.9 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          // Add wave displacement
          vec3 pos = position;
          pos.y += sin(pos.x * 2.0 + time) * 0.1;
          pos.y += cos(pos.z * 2.0 + time) * 0.1;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float opacity;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec2 uv = vUv;
          
          // Ripple effect
          float ripple = sin(length(uv - 0.5) * 10.0 - time * 5.0) * 0.1;
          
          // Fresnel effect
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = 1.0 - dot(viewDirection, vec3(0.0, 1.0, 0.0));
          
          vec3 finalColor = color + ripple;
          finalColor *= fresnel;
          
          gl_FragColor = vec4(finalColor, opacity);
        }
      `,
      transparent: true
    });
  };
  
  const createCrystalShader = () => {
    return new ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        color: { value: new THREE.Color(0x87ceeb) },
        emissive: { value: new THREE.Color(0x1a3a5c) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform vec3 emissive;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vec2 uv = vUv;
          
          // Crystal refraction effect
          float refraction = sin(uv.x * 5.0 + time) * cos(uv.y * 5.0 + time);
          
          // Inner glow
          float glow = sin(time * 2.0) * 0.5 + 0.5;
          
          vec3 finalColor = color + refraction * 0.2;
          finalColor += emissive * glow * 0.3;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    });
  };
  
  // Update shader uniforms
  const updateShaderTime = (shader, time) => {
    if (shader && shader.uniforms && shader.uniforms.time) {
      shader.uniforms.time.value = time;
    }
  };
  
  // Export functions
  export { createAuroraShader, createWaterShader, createCrystalShader, updateShaderTime };
</script>

<!-- Shader system is now available to other components -->
