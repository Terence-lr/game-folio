// Real project data from Terence Richardson's GitHub repositories
export const projects = [
  {
    id: 'total-job-tracker',
    title: 'Total Job Tracker',
    description: 'A modern, full-stack SaaS application for tracking job applications with secure user authentication and real-time data persistence. Features multi-user authentication, job application tracking, status management, dashboard analytics, and search & filtering.',
    techStack: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'PostgreSQL', 'Vercel'],
    liveUrl: 'https://total-job-tracker.vercel.app/',
    githubUrl: 'https://github.com/Terence-lr/total-job-tracker-',
    color: '#dc143c',
    category: 'Full-Stack SaaS',
    features: [
      'Multi-user Authentication with email verification',
      'Job Application Tracking through Applied → Interview → Offer/Rejected pipeline',
      'Dashboard Analytics with visual overview',
      'Search & Filtering by company, position, status, or date range',
      'Real-time Data updates across all user sessions',
      'Professional Onboarding with guided email confirmation flow'
    ],
    techDetails: {
      frontend: 'React 18 with TypeScript for type-safe development',
      backend: 'Supabase PostgreSQL with Row Level Security (RLS)',
      styling: 'Tailwind CSS utility-first styling',
      deployment: 'Vercel with automatic deployments from GitHub',
      security: 'JWT Authentication, Email Verification, HTTPS Encryption'
    }
  },
  {
    id: 'portfolio-site',
    title: 'Portfolio Website',
    description: 'Clean, fast, and discoverable portfolio showcasing modern web development with a focus on performance, accessibility, and user experience. Features 95+ Lighthouse scores, WCAG AA compliance, and custom design system.',
    techStack: ['Next.js', 'TypeScript', 'CSS', 'Framer Motion', 'Vercel'],
    liveUrl: 'https://www.trichardson.dev/',
    githubUrl: 'https://github.com/Terence-lr/Portfolio-site',
    color: '#0066cc',
    category: 'Portfolio',
    features: [
      'Performance Optimized with 95+ Lighthouse scores',
      'Accessibility First with WCAG AA compliance',
      'Responsive Design tested across 5+ device breakpoints',
      'Custom Design System with pure CSS and custom properties',
      'SEO Optimized with complete meta tags and structured data',
      'Interactive Elements with custom cursor and magnetic buttons'
    ],
    techDetails: {
      framework: 'Next.js 14 with App Router',
      styling: 'Pure CSS with custom design system and CSS modules',
      animations: 'Framer Motion for advanced interactions',
      performance: 'Optimized images, lazy loading, and fluid typography',
      accessibility: 'Semantic HTML, keyboard navigation, screen reader support'
    }
  },
  {
    id: 'distance-converter',
    title: 'Distance Converter',
    description: 'A web-based distance unit converter application with clean, user-friendly interface and real-time conversion capabilities. Built with modern web technologies for seamless user experience.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    liveUrl: 'https://tlr-distance-converter.replit.app/',
    githubUrl: 'https://github.com/Terence-lr/distance-converter',
    color: '#2d8659',
    category: 'Utility App',
    features: [
      'Convert between different distance units',
      'Clean, user-friendly interface',
      'Real-time conversion calculations',
      'Responsive design for all devices',
      'Modern UI with Tailwind CSS',
      'Built with Vite for fast development'
    ],
    techDetails: {
      frontend: 'React with TypeScript for type safety',
      styling: 'Tailwind CSS for rapid UI development',
      build: 'Vite for optimized build and development',
      hosting: 'Replit for quick deployment and testing'
    }
  }
];

export type Project = typeof projects[0];
