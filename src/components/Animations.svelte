<script>
  import { onMount } from 'svelte';
  // Animation system without useFrame for now
  import { getContext } from 'svelte';
  
  // Theatre.js integration for smooth animations
  let animationState = {
    billboardScale: 1.0,
    characterBob: 0.0,
    environmentRotation: 0.0,
    lightIntensity: 1.0,
    fogDensity: 0.005
  };
  
  let time = 0;
  
  // Animation functions inspired by Theatre.js timeline concepts
  const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOutElastic = (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  };
  
  // Timeline-based animations
  const createTimeline = () => {
    return {
      // Billboard entrance animation
      animateBillboardEntrance: (billboard, delay = 0) => {
        const startTime = time + delay;
        const duration = 1.5;
        
        return {
          startTime,
          duration,
          update: (currentTime) => {
            const elapsed = currentTime - startTime;
            if (elapsed >= 0 && elapsed <= duration) {
              const progress = elapsed / duration;
              const easedProgress = easeOutElastic(progress);
              
              if (billboard.group) {
                billboard.group.scale.setScalar(easedProgress);
                billboard.group.position.y = data.position[1] + (1 - easedProgress) * 5;
              }
            }
          }
        };
      },
      
      // Character idle animation
      animateCharacterIdle: (character) => {
        return {
          update: (currentTime) => {
            if (character.group) {
              // Subtle head bobbing
              const bobAmount = Math.sin(currentTime * 2) * 0.05;
              character.group.children[0].position.y = 1.8 + bobAmount;
              
              // Slight body sway
              const swayAmount = Math.sin(currentTime * 1.5) * 0.02;
              character.group.rotation.z = swayAmount;
            }
          }
        };
      },
      
      // Environment ambient animation
      animateEnvironment: () => {
        return {
          update: (currentTime) => {
            animationState.environmentRotation = currentTime * 0.1;
            animationState.lightIntensity = 1.0 + Math.sin(currentTime * 0.5) * 0.2;
            animationState.fogDensity = 0.005 + Math.sin(currentTime * 0.3) * 0.002;
          }
        };
      },
      
      // Portfolio interaction animation
      animatePortfolioInteraction: (billboard, isHovered) => {
        const targetScale = isHovered ? 1.1 : 1.0;
        const targetGlow = isHovered ? 1.5 : 1.0;
        
        return {
          update: (currentTime) => {
            if (billboard.group) {
              // Smooth scale transition
              const currentScale = billboard.group.scale.x;
              const newScale = currentScale + (targetScale - currentScale) * 0.1;
              billboard.group.scale.setScalar(newScale);
              
              // Glow intensity
              if (billboard.light) {
                const currentIntensity = billboard.light.intensity;
                const newIntensity = currentIntensity + (targetGlow - currentIntensity) * 0.1;
                billboard.light.intensity = newIntensity;
              }
            }
          }
        };
      }
    };
  };
  
  let timeline = createTimeline();
  let activeAnimations = [];
  
  // Animation loop - simplified for now
  onMount(() => {
    const animate = () => {
      time += 0.016; // ~60fps
      
      // Update all active animations
      activeAnimations.forEach(animation => {
        animation.update(time);
      });
      
      // Clean up finished animations
      activeAnimations = activeAnimations.filter(animation => {
        return !animation.startTime || time - animation.startTime < animation.duration;
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  });
  
  // Export animation functions
  export const addBillboardEntranceAnimation = (billboard, delay = 0) => {
    const animation = timeline.animateBillboardEntrance(billboard, delay);
    activeAnimations.push(animation);
  };
  
  export const addCharacterIdleAnimation = (character) => {
    const animation = timeline.animateCharacterIdle(character);
    activeAnimations.push(animation);
  };
  
  export const addEnvironmentAnimation = () => {
    const animation = timeline.animateEnvironment();
    activeAnimations.push(animation);
  };
  
  export const addPortfolioInteractionAnimation = (billboard, isHovered) => {
    const animation = timeline.animatePortfolioInteraction(billboard, isHovered);
    activeAnimations.push(animation);
  };
  
  // Provide animation context
  const animationContext = {
    addBillboardEntranceAnimation,
    addCharacterIdleAnimation,
    addEnvironmentAnimation,
    addPortfolioInteractionAnimation,
    animationState
  };
  
  setContext('animations', animationContext);
</script>

<!-- Animation system is now available to child components -->
