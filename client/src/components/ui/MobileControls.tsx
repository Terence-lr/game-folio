import { useEffect } from "react";
import VirtualJoystick from "./VirtualJoystick";
import { useGamefolio } from "../../lib/stores/useGamefolio";

export default function MobileControls() {
  const { setMobileInput, setIsBoosting, triggerInteraction } = useGamefolio();

  // Handle boost button
  const handleBoostStart = () => {
    console.log('📱 Boost button pressed');
    setIsBoosting(true);
  };

  const handleBoostEnd = () => {
    console.log('📱 Boost button released');
    setIsBoosting(false);
  };

  // Handle depth controls
  const handleDepthUp = () => {
    console.log('📱 Swim up');
    setMobileInput({ up: true });
    setTimeout(() => setMobileInput({ up: false }), 100);
  };

  const handleDepthDown = () => {
    console.log('📱 Swim down');
    setMobileInput({ down: true });
    setTimeout(() => setMobileInput({ down: false }), 100);
  };

  const handleInteract = () => {
    console.log('📱 Interact button pressed');
    triggerInteraction();
  };

  const handleExit = () => {
    console.log('📱 Exit/Back button pressed');
    // Could be used to close overlays or go back
  };

  console.log('📱 MobileControls rendered');

  return (
    <div className="mobile-controls">
      {/* Virtual Joystick (Bottom Left) */}
      <VirtualJoystick onMove={setMobileInput} />

      {/* Boost Button (Bottom Right) */}
      <button
        className="boost-button"
        onTouchStart={handleBoostStart}
        onTouchEnd={handleBoostEnd}
        onMouseDown={handleBoostStart}
        onMouseUp={handleBoostEnd}
        onMouseLeave={handleBoostEnd}
      >
        BOOST
      </button>

      {/* Depth Controls (Right Side Stack) */}
      <div className="depth-controls">
        {/* Swim Up */}
        <button
          className="depth-control-btn"
          onTouchStart={handleDepthUp}
          onMouseDown={handleDepthUp}
        >
          ▲
        </button>

        {/* Interact */}
        <button
          className="depth-control-btn"
          onTouchStart={handleInteract}
          onMouseDown={handleInteract}
        >
          ●
        </button>

        {/* Exit/Back */}
        <button
          className="depth-control-btn"
          onTouchStart={handleExit}
          onMouseDown={handleExit}
        >
          ✕
        </button>

        {/* Swim Down */}
        <button
          className="depth-control-btn"
          onTouchStart={handleDepthDown}
          onMouseDown={handleDepthDown}
        >
          ▼
        </button>
      </div>
    </div>
  );
}
