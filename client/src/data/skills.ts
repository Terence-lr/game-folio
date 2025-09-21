// Skills data representing Terence Richardson's technical expertise
export const skills = [
  // Frontend Technologies
  {
    name: 'React',
    level: 9,
    color: '#61dafb',
    category: 'frontend' as const,
    description: 'Advanced proficiency in React 18+ with hooks, context, and modern patterns'
  },
  {
    name: 'TypeScript',
    level: 8,
    color: '#3178c6',
    category: 'frontend' as const,
    description: 'Strong typing skills for scalable and maintainable code'
  },
  {
    name: 'Next.js',
    level: 8,
    color: '#000000',
    category: 'frontend' as const,
    description: 'Full-stack React framework with App Router and server components'
  },
  {
    name: 'Tailwind CSS',
    level: 9,
    color: '#06b6d4',
    category: 'frontend' as const,
    description: 'Utility-first CSS framework for rapid UI development'
  },
  {
    name: 'Three.js',
    level: 7,
    color: '#000000',
    category: 'frontend' as const,
    description: '3D graphics and WebGL for immersive web experiences'
  },
  
  // Backend & Database
  {
    name: 'Node.js',
    level: 7,
    color: '#339933',
    category: 'backend' as const,
    description: 'Server-side JavaScript runtime and API development'
  },
  {
    name: 'Supabase',
    level: 8,
    color: '#3ecf8e',
    category: 'database' as const,
    description: 'PostgreSQL database with real-time features and authentication'
  },
  {
    name: 'PostgreSQL',
    level: 7,
    color: '#336791',
    category: 'database' as const,
    description: 'Relational database design and optimization'
  },
  
  // Development Tools
  {
    name: 'Git',
    level: 8,
    color: '#f05032',
    category: 'tools' as const,
    description: 'Version control and collaborative development workflows'
  },
  {
    name: 'Vercel',
    level: 8,
    color: '#000000',
    category: 'tools' as const,
    description: 'Deployment platform with CI/CD integration'
  },
  {
    name: 'Figma',
    level: 7,
    color: '#f24e1e',
    category: 'tools' as const,
    description: 'UI/UX design and prototyping for web applications'
  },
  {
    name: 'Vite',
    level: 8,
    color: '#646cff',
    category: 'tools' as const,
    description: 'Fast build tool and development server'
  }
];

export type Skill = typeof skills[0];
