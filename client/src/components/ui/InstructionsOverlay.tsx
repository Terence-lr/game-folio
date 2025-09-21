import { useGamefolio } from "../../lib/stores/useGamefolio";
import { useIsMobile } from "../../hooks/use-is-mobile";

export default function InstructionsOverlay() {
  const { hideInstructions } = useGamefolio();
  const isMobile = useIsMobile();

  console.log('📖 InstructionsOverlay rendered for:', isMobile ? 'mobile' : 'desktop');

  return (
    <div className="instructions-overlay">
      <h2>Welcome to Gamefolio</h2>
      
      <p>Navigate through the underwater world to explore Terence Richardson's portfolio projects and skills.</p>
      
      <div className="instructions-list">
        {isMobile ? (
          <ul>
            <li><strong>Virtual Joystick:</strong> Control fish swimming direction</li>
            <li><strong>Boost Button:</strong> Hold for speed burst</li>
            <li><strong>Depth Controls:</strong> ▲ Swim up, ▼ Swim down</li>
            <li><strong>Interact:</strong> ● to examine objects</li>
            <li><strong>Touch & Drag:</strong> Rotate camera view</li>
            <li><strong>Pinch:</strong> Zoom in/out</li>
            <li><strong>Double Tap:</strong> Quick interact with nearby items</li>
          </ul>
        ) : (
          <ul>
            <li><strong>Arrow Keys or WASD:</strong> Fish movement</li>
            <li><strong>Q/E Keys:</strong> Swim up/down</li>
            <li><strong>Space Bar:</strong> Speed boost</li>
            <li><strong>Mouse:</strong> Camera control</li>
            <li><strong>Click:</strong> Interact with portfolio elements</li>
            <li><strong>Tab:</strong> Cycle through interactive elements</li>
            <li><strong>F or Enter:</strong> Interact with focused element</li>
          </ul>
        )}
      </div>
      
      <p>Explore 6 underwater sections: Surface Entry, Intro Reef, Project Kelp Forest, Skills Cavern, Experience Shipwreck, and Contact Depths.</p>
      
      <button 
        className="close-instructions"
        onClick={() => {
          hideInstructions();
          // Play interaction sound when starting
          setTimeout(() => {
            try {
              if ('AudioContext' in window || 'webkitAudioContext' in window) {
                // Audio will be initialized when hideInstructions is called
              }
            } catch (error) {
              console.log('Audio not supported');
            }
          }, 100);
        }}
      >
        Start Swimming
      </button>
    </div>
  );
}
