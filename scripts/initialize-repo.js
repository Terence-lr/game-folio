import { Octokit } from '@octokit/rest';

let connectionSettings;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function initializeRepository() {
  try {
    console.log('🔗 Connecting to GitHub...');
    const octokit = await getUncachableGitHubClient();
    
    const owner = 'Terence-lr';
    const repo = 'game-folio';
    
    console.log('📝 Creating initial README.md...');
    const readmeContent = `# Gamefolio - 3D Underwater Portfolio

An immersive 3D underwater fish portfolio game built with React Three Fiber and Three.js. Navigate as a fish through 6 distinct underwater sections to explore Terence Richardson's projects and technical skills interactively.

## Features

🌊 **Immersive 3D Underwater World** - Navigate through beautifully rendered underwater environments
🐠 **Fish Character** - Smooth swimming controls with realistic physics and animations
📱 **Mobile-Friendly** - Virtual joystick controls optimized for touch devices
🎨 **Enhanced Visual Effects** - Particle systems, underwater currents, and god rays
🔊 **Spatial Audio** - Immersive underwater soundscape with responsive audio feedback
📚 **Real Project Integration** - Connected to actual GitHub repositories with live project data
🎮 **Interactive Portfolio Sections**:
  - Surface Entry - Welcome area
  - Intro Reef - Introduction and overview
  - Project Kelp Forest - Showcase of real projects
  - Skills Cavern - Technical skills with proficiency levels
  - Experience Shipwreck - Work experience and background
  - Contact Depths - Get in touch section

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **3D Graphics**: Three.js, React Three Fiber, @react-three/drei
- **Audio**: Web Audio API with spatial audio effects
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animation**: Framer Motion, GSAP
- **Mobile**: Touch controls with virtual joystick

## Controls

### Desktop
- **WASD** or **Arrow Keys**: Move fish
- **Space**: Boost speed
- **Mouse**: Camera rotation and interaction

### Mobile
- **Virtual Joystick**: Fish movement
- **Boost Button**: Increase swimming speed
- **Depth Controls**: Swim up/down
- **Touch**: Camera rotation and zoom

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

Visit \`http://localhost:5000\` to explore the underwater portfolio!

## Inspiration

Visual quality inspired by [Bruno Simon's portfolio](https://bruno-simon.com/) while maintaining a unique underwater theme and interactive portfolio concept.

---

*Dive into the depths and explore this unique underwater portfolio experience!* 🌊
`;

    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: 'README.md',
      message: 'docs: Add comprehensive README for Gamefolio underwater portfolio',
      content: Buffer.from(readmeContent).toString('base64'),
      branch: 'main'
    });

    console.log('✅ Repository initialized with README.md');
    console.log('🔗 Repository: https://github.com/Terence-lr/game-folio');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize repository:', error.message);
    if (error.response) {
      console.error('📄 Error details:', error.response.data);
    }
    throw error;
  }
}

// Run the initialization
initializeRepository()
  .then(() => {
    console.log('🎉 Repository successfully initialized!');
    console.log('📄 Next: Run the push script to upload all project files');
  })
  .catch(error => {
    console.error('💥 Initialization failed:', error.message);
    process.exit(1);
  });