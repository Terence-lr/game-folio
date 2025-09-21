import * as THREE from "three";

// Fish Movement Types
export interface FishMovement {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  velocity: THREE.Vector3;
  isMoving: boolean;
  isBoosting: boolean;
  currentSpeed: number;
}

// Mobile Control Types
export interface MobileInput {
  forward?: boolean;
  backward?: boolean;
  left?: boolean;
  right?: boolean;
  up?: boolean;
  down?: boolean;
  x?: number; // -1 to 1 for analog input
  y?: number; // -1 to 1 for analog input
}

export interface TouchInput {
  x: number;
  y: number;
  pressure?: number;
  timestamp: number;
}

// Portfolio Section Types
export interface PortfolioSection {
  id: string;
  type: 'surface' | 'intro' | 'project' | 'experience' | 'contact' | 'skills';
  position: THREE.Vector3;
  title: string;
  description: string;
  color: string;
  interactionRadius: number;
  isActive: boolean;
}

// Project Data Types
export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  color: string;
  category: string;
  features?: string[];
  techDetails?: Record<string, string>;
}

// Skill Types
export interface Skill {
  name: string;
  level: number; // 1-10 scale
  color: string;
  category: 'frontend' | 'backend' | 'database' | 'tools';
  description?: string;
}

// Underwater Environment Types
export interface UnderwaterParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  size: number;
  life: number;
  maxLife: number;
}

export interface SeaweedProps {
  position: THREE.Vector3;
  height: number;
  swayAmount: number;
  color: string;
}

// Interaction Types
export interface InteractionEvent {
  type: 'proximity' | 'click' | 'touch' | 'keyboard';
  target: string;
  position: THREE.Vector3;
  timestamp: number;
}

export interface ProximityDetection {
  targetId: string;
  distance: number;
  isInRange: boolean;
  threshold: number;
}

// Camera and Controls
export interface CameraState {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
  near: number;
  far: number;
}

export interface ControlsConfig {
  keyboard: Record<string, string[]>;
  mouse: {
    sensitivity: number;
    invertY: boolean;
  };
  mobile: {
    joystickDeadzone: number;
    buttonSize: number;
    hapticFeedback: boolean;
  };
}

// Performance and Optimization
export interface PerformanceSettings {
  targetFPS: number;
  particleCount: number;
  shadowQuality: 'low' | 'medium' | 'high';
  renderDistance: number;
  levelOfDetail: boolean;
}

// Game State Types
export interface GameState {
  phase: 'loading' | 'instructions' | 'playing' | 'paused';
  currentSection: string;
  fishDepth: number;
  exploredSections: string[];
  discoveredProjects: string[];
  achievements: string[];
  sessionStartTime: number;
  totalPlayTime: number;
}

// Audio Types
export interface AudioConfig {
  ambientVolume: number;
  effectsVolume: number;
  musicVolume: number;
  isMuted: boolean;
}

// Analytics and Metrics
export interface AnalyticsEvent {
  event: string;
  data: Record<string, any>;
  timestamp: number;
  sessionId: string;
}

export interface SessionMetrics {
  sessionId: string;
  startTime: number;
  endTime?: number;
  sectionsVisited: string[];
  projectsViewed: string[];
  interactionCount: number;
  averageDepth: number;
  maxDepth: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  userAgent: string;
}
