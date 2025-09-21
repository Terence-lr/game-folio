import { useEffect } from "react";
import { useGamefolio } from "../../lib/stores/useGamefolio";

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  color: string;
}

interface ProjectOverlayProps {
  project: Project;
}

export default function ProjectOverlay({ project }: ProjectOverlayProps) {
  const { clearActiveProject } = useGamefolio();

  // Auto-close overlay after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      clearActiveProject();
    }, 10000);

    return () => clearTimeout(timer);
  }, [clearActiveProject]);

  // Handle escape key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearActiveProject();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [clearActiveProject]);

  console.log('📋 ProjectOverlay rendered for:', project.title);

  return (
    <div className="project-overlay">
      <div 
        className="absolute top-2 right-2 cursor-pointer text-white/60 hover:text-white"
        onClick={clearActiveProject}
      >
        ✕
      </div>
      
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      
      <div className="project-tech-stack">
        {project.techStack.map((tech) => (
          <span key={tech} className="tech-tag">
            {tech}
          </span>
        ))}
      </div>
      
      <div className="project-links">
        {project.liveUrl && (
          <a 
            href={project.liveUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="project-link"
          >
            Live Demo
          </a>
        )}
        {project.githubUrl && (
          <a 
            href={project.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="project-link"
          >
            GitHub
          </a>
        )}
      </div>
    </div>
  );
}
