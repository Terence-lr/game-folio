import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Project } from "../../data/projects";
import { audioManager } from "../audioManager";
import * as THREE from "three";

interface MobileInput {
  forward?: boolean;
  backward?: boolean;
  left?: boolean;
  right?: boolean;
  up?: boolean;
  down?: boolean;
  x?: number; // -1 to 1
  y?: number; // -1 to 1
}

interface GamefolioState {
  // UI State
  showInstructions: boolean;
  activeProject: Project | null;
  currentSection: string;
  
  // Game State
  isUnderwater: boolean;
  fishDepth: number;
  interactionMode: boolean;
  audioInitialized: boolean;
  
  // Fish Movement State
  fishPosition: THREE.Vector3;
  fishRotation: THREE.Euler;
  isMoving: boolean;
  isBoosting: boolean;
  mobileInput: MobileInput;
  
  // Actions
  hideInstructions: () => void;
  showInstructionsDialog: () => void;
  setActiveProject: (project: Project) => void;
  clearActiveProject: () => void;
  setCurrentSection: (section: string) => void;
  triggerInteraction: () => void;
  setFishDepth: (depth: number) => void;
  initializeAudio: () => void;
  
  // Fish Movement Actions
  setFishPosition: (position: THREE.Vector3) => void;
  setFishRotation: (rotation: THREE.Euler) => void;
  setIsMoving: (moving: boolean) => void;
  setIsBoosting: (boosting: boolean) => void;
  setMobileInput: (input: MobileInput) => void;
}

export const useGamefolio = create<GamefolioState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    showInstructions: true,
    activeProject: null,
    currentSection: 'surface',
    isUnderwater: false,
    fishDepth: 0,
    interactionMode: false,
    audioInitialized: false,
    
    // Fish Movement State
    fishPosition: new THREE.Vector3(0, 0, 0),
    fishRotation: new THREE.Euler(0, 0, 0),
    isMoving: false,
    isBoosting: false,
    mobileInput: {},
    
    // UI Actions
    hideInstructions: () => {
      set({ showInstructions: false, isUnderwater: true });
      console.log('📖 Instructions hidden, diving underwater');
      
      // Initialize and start ambient audio when entering the game
      const state = get();
      if (!state.audioInitialized) {
        state.initializeAudio();
      }
    },
    
    showInstructionsDialog: () => {
      set({ showInstructions: true });
      console.log('📖 Instructions shown');
    },
    
    setActiveProject: (project: Project) => {
      set({ activeProject: project, interactionMode: true });
      console.log('📋 Active project set:', project.title);
      
      // Play interaction sound
      audioManager.playInteractionSound();
    },
    
    clearActiveProject: () => {
      set({ activeProject: null, interactionMode: false });
      console.log('📋 Active project cleared');
    },
    
    setCurrentSection: (section: string) => {
      set({ currentSection: section });
      console.log('📍 Current section:', section);
    },
    
    // Game Actions
    triggerInteraction: () => {
      const { activeProject } = get();
      if (!activeProject) {
        console.log('🎯 Interaction triggered but no active project');
        // Could trigger other interactions based on current section
      } else {
        console.log('🎯 Interaction with active project:', activeProject.title);
      }
    },
    
    setFishDepth: (depth: number) => {
      set({ fishDepth: depth });
      
      // Update section based on depth
      let section = 'surface';
      if (depth < -5) section = 'intro';
      if (depth < -15) section = 'projects';
      if (depth < -25) section = 'skills';
      if (depth < -35) section = 'experience';
      if (depth < -45) section = 'contact';
      
      const currentSection = get().currentSection;
      if (section !== currentSection) {
        set({ currentSection: section });
        console.log('📍 Depth section changed:', section, 'at depth:', depth);
      }
    },
    
    // Audio initialization
    initializeAudio: async () => {
      try {
        await audioManager.initialize();
        await audioManager.resume();
        audioManager.playAmbient();
        set({ audioInitialized: true });
        console.log('🔊 Audio system initialized');
      } catch (error) {
        console.error('❌ Failed to initialize audio:', error);
      }
    },
    
    // Fish Movement Actions
    setFishPosition: (position: THREE.Vector3) => {
      set({ fishPosition: position });
    },
    
    setFishRotation: (rotation: THREE.Euler) => {
      set({ fishRotation: rotation });
    },
    
    setIsMoving: (moving: boolean) => {
      set({ isMoving: moving });
    },
    
    setIsBoosting: (boosting: boolean) => {
      console.log('🚀 Fish boost:', boosting);
      set({ isBoosting: boosting });
    },
    
    setMobileInput: (input: MobileInput) => {
      set({ mobileInput: input });
      console.log('📱 Mobile input updated:', input);
    }
  }))
);

// Subscribe to state changes for debugging
useGamefolio.subscribe(
  (state) => state.activeProject,
  (activeProject) => {
    if (activeProject) {
      console.log('🔔 Project activated:', activeProject.title);
    } else {
      console.log('🔔 Project deactivated');
    }
  }
);

useGamefolio.subscribe(
  (state) => state.currentSection,
  (currentSection) => {
    console.log('🔔 Section changed to:', currentSection);
  }
);
