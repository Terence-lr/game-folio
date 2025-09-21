import { useEffect, useState } from "react";
import * as THREE from "three";
import { useGamefolio } from "../lib/stores/useGamefolio";
import { projects } from "../data/projects";

export function useProximityDetection(fishPosition: THREE.Vector3) {
  const { setActiveProject, triggerInteraction } = useGamefolio();
  const [nearbyObjects, setNearbyObjects] = useState<string[]>([]);
  
  const INTERACTION_DISTANCE = 5;
  const HINT_DISTANCE = 8;

  // Define positions of portfolio sections (should match GameScene positions)
  const sectionPositions = [
    { id: 'intro', position: new THREE.Vector3(10, 0, -5), type: 'intro', project: undefined },
    ...projects.map((project, index) => ({
      id: project.id,
      position: new THREE.Vector3(-15 + (index * 8), -5, -10 - (index * 5)),
      type: 'project',
      project
    })),
    { id: 'experience', position: new THREE.Vector3(0, -20, -40), type: 'experience', project: undefined },
    { id: 'contact', position: new THREE.Vector3(0, -30, -60), type: 'contact', project: undefined }
  ];

  useEffect(() => {
    const nearby: string[] = [];
    let closestProject: any = null;
    let closestDistance = Infinity;

    // Check proximity to each section
    sectionPositions.forEach((section) => {
      const distance = fishPosition.distanceTo(section.position);
      
      // Track nearby objects for hints
      if (distance < HINT_DISTANCE) {
        nearby.push(section.id);
      }
      
      // Find closest project for interaction
      if (distance < INTERACTION_DISTANCE && section.type === 'project' && section.project) {
        if (distance < closestDistance) {
          closestDistance = distance;
          closestProject = section.project;
        }
      }
    });

    setNearbyObjects(nearby);

    // Auto-trigger project details when very close
    if (closestProject && closestDistance < 3) {
      setActiveProject(closestProject);
      console.log('📍 Auto-triggered project:', closestProject.title);
    }

    // Debug logging
    if (nearby.length > 0) {
      console.log('🎯 Fish near objects:', nearby, 'distance to closest:', closestDistance.toFixed(1));
    }
  }, [fishPosition, setActiveProject]);

  // Handle manual interaction trigger
  const handleInteraction = () => {
    const closestSection = sectionPositions.find(section => 
      fishPosition.distanceTo(section.position) < INTERACTION_DISTANCE
    );

    if (closestSection) {
      if (closestSection.type === 'project' && closestSection.project) {
        setActiveProject(closestSection.project);
        console.log('🎯 Manual interaction with project:', closestSection.project.title);
      } else {
        console.log('🎯 Manual interaction with section:', closestSection.id);
        // Could trigger other section-specific interactions
      }
    }
  };

  return {
    nearbyObjects,
    handleInteraction
  };
}
