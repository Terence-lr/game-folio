import { useRef, useEffect, useState, useCallback } from "react";

interface JoystickInput {
  forward?: boolean;
  backward?: boolean;
  left?: boolean;
  right?: boolean;
  x?: number; // -1 to 1
  y?: number; // -1 to 1
}

interface VirtualJoystickProps {
  onMove: (input: JoystickInput) => void;
}

export default function VirtualJoystick({ onMove }: VirtualJoystickProps) {
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [joystickCenter, setJoystickCenter] = useState({ x: 0, y: 0 });
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 });

  // Calculate joystick center on mount and resize
  const updateJoystickCenter = useCallback(() => {
    if (joystickRef.current) {
      const rect = joystickRef.current.getBoundingClientRect();
      setJoystickCenter({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
    }
  }, []);

  useEffect(() => {
    updateJoystickCenter();
    window.addEventListener('resize', updateJoystickCenter);
    return () => window.removeEventListener('resize', updateJoystickCenter);
  }, [updateJoystickCenter]);

  // Handle touch/mouse movement
  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;

    const deltaX = clientX - joystickCenter.x;
    const deltaY = clientY - joystickCenter.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 40; // Half of joystick radius

    // Constrain knob to joystick circle
    let constrainedX = deltaX;
    let constrainedY = deltaY;
    
    if (distance > maxDistance) {
      constrainedX = (deltaX / distance) * maxDistance;
      constrainedY = (deltaY / distance) * maxDistance;
    }

    setKnobPosition({
      x: constrainedX,
      y: constrainedY
    });

    // Convert to normalized input (-1 to 1)
    const normalizedX = constrainedX / maxDistance;
    const normalizedY = -constrainedY / maxDistance; // Invert Y for game coordinates

    // Send input to movement handler
    onMove({
      x: normalizedX,
      y: normalizedY,
      forward: normalizedY > 0.3,
      backward: normalizedY < -0.3,
      left: normalizedX < -0.3,
      right: normalizedX > 0.3
    });

    console.log('🕹️ Joystick input:', { x: normalizedX, y: normalizedY });
  }, [isDragging, joystickCenter, onMove]);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateJoystickCenter();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isDragging) {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setKnobPosition({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
    console.log('🕹️ Joystick released');
  };

  // Mouse event handlers for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateJoystickCenter();
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setKnobPosition({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMove]);

  console.log('🕹️ VirtualJoystick rendered, dragging:', isDragging);

  return (
    <div
      ref={joystickRef}
      className="virtual-joystick"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      <div
        ref={knobRef}
        className="joystick-knob"
        style={{
          transform: `translate(${knobPosition.x}px, ${knobPosition.y}px)`
        }}
      />
    </div>
  );
}
