# GameFolio - 3D Portfolio Experience

An immersive 3D portfolio experience built with Three.js, showcasing projects in an interactive underwater world.

## 🚀 Current Status: MVP Visual-First Version

This project has evolved through multiple iterations and is currently in an **MVP (Minimum Viable Product)** state that prioritizes **visibility and visual appeal** over complex features.

### 🎯 What's Working Now

- **Pure Three.js Implementation**: Simple, reliable 3D scene without complex dependencies
- **Guaranteed Visibility**: All objects are visible and properly lit
- **Interactive Portfolio Items**: Click on colored cubes to interact with portfolio projects
- **Smooth Controls**: Mouse look + WASD movement with OrbitControls
- **Visual Appeal**: Starry night theme with atmospheric lighting and fog
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Project Evolution

### Phase 1: Initial Three.js Implementation
- Started as a React/Three.js application
- Migrated to pure HTML/JavaScript for better performance
- Implemented underwater fish portfolio with swimming animations

### Phase 2: Visual Enhancements
- Added Bruno Simon-inspired low-poly 3D world
- Transformed from underwater to starry night theme
- Implemented interactive billboards and 3D text
- Added post-processing effects (bloom, color grading, film grain)

### Phase 3: Advanced Features (Threlte Migration)
- Migrated to Svelte + Threlte architecture
- Integrated Rapier physics engine
- Added Theatre.js animations
- Implemented VR/AR support with WebXR
- Created custom GLSL shaders

### Phase 4: MVP Simplification
- **Current State**: Simplified to pure Three.js for maximum compatibility
- Removed complex dependencies that caused deployment issues
- Focused on core visual experience with guaranteed functionality

## 🎮 Controls

- **W/A/S/D**: Move around the world
- **Mouse**: Look around (OrbitControls)
- **Click**: Interact with portfolio items
- **Scroll**: Zoom in/out

## 🛠️ Technical Stack

### Current MVP Stack
- **Three.js**: 3D graphics and rendering
- **Vanilla JavaScript**: No framework dependencies
- **HTML5/CSS3**: Modern web standards
- **OrbitControls**: Camera controls

### Previous Advanced Stack (Archived)
- **Svelte**: Reactive JavaScript framework
- **Threlte**: Svelte components for Three.js
- **Rapier**: Physics engine
- **Theatre.js**: Animation system
- **WebXR**: VR/AR support
- **GLSL Shaders**: Custom visual effects

## 📁 Project Structure

```
game-folio/
├── index.html              # Main application (MVP version)
├── package.json            # Dependencies and scripts
├── vercel.json            # Vercel deployment configuration
├── README.md              # This file
├── src/                   # Advanced Svelte components (archived)
│   ├── App.svelte
│   ├── components/
│   │   ├── Scene.svelte
│   │   ├── Environment.svelte
│   │   ├── Character.svelte
│   │   ├── PortfolioBillboards.svelte
│   │   ├── UI.svelte
│   │   ├── Animations.svelte
│   │   ├── XRSupport.svelte
│   │   └── Shaders.svelte
│   └── main.js
└── client/                # Legacy React components (archived)
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── data/
    │   └── lib/
    └── public/
```

## 🚀 Deployment

### Vercel (Current)
The project is optimized for Vercel deployment with:
- Static site generation
- Optimized asset loading
- Security headers
- Performance optimizations

### Local Development
```bash
# Serve the MVP version
python -m http.server 8000
# or
npx serve .

# For advanced Svelte version (archived)
npm install
npm run dev
```

## 🎨 Visual Features

### Current MVP Features
- **Starry Night Theme**: Deep blue gradient background with atmospheric fog
- **Interactive Portfolio Cubes**: Three colored cubes representing different project categories
- **Decorative Objects**: Random colored spheres for visual interest
- **Dynamic Lighting**: Ambient + directional lighting with shadows
- **Smooth Animations**: Rotating and floating portfolio items

### Advanced Features (Archived)
- **3D Text Billboards**: TextGeometry with custom fonts
- **Particle Systems**: Bubbles, stars, and environmental effects
- **Post-Processing**: Bloom, color grading, film grain effects
- **Physics Simulation**: Realistic object interactions
- **VR/AR Support**: WebXR integration
- **Custom Shaders**: GLSL effects for enhanced visuals

## 🔧 Development History

### Key Commits
- **Initial Setup**: React/Three.js underwater portfolio
- **Vercel Optimization**: Static site deployment configuration
- **Visual Enhancements**: Bruno Simon-inspired low-poly world
- **Starry Night Theme**: Natural environment with billboards
- **Advanced Features**: Physics, animations, XR, shaders
- **Threlte Migration**: Svelte-based architecture
- **MVP Simplification**: Pure Three.js for maximum compatibility

### Challenges Overcome
- **Visibility Issues**: Ensured all 3D objects are properly visible
- **Deployment Problems**: Simplified architecture for reliable deployment
- **Performance Optimization**: Balanced visual quality with performance
- **Cross-Platform Compatibility**: Works on desktop and mobile

## 🎯 Future Roadmap

### Phase 1: MVP Enhancement
- [ ] Add more interactive portfolio items
- [ ] Implement smooth character movement
- [ ] Add sound effects and background music
- [ ] Create portfolio detail modals

### Phase 2: Visual Polish
- [ ] Add particle effects
- [ ] Implement better lighting
- [ ] Create custom 3D models
- [ ] Add post-processing effects

### Phase 3: Advanced Features
- [ ] Re-integrate physics engine
- [ ] Add VR/AR support
- [ ] Implement custom shaders
- [ ] Create animation system

## 📝 License

MIT License - feel free to use this project as inspiration for your own portfolio!

## 🤝 Contributing

This is a personal portfolio project, but suggestions and improvements are welcome!

## 📞 Contact

- **GitHub**: [Terence-lr](https://github.com/Terence-lr)
- **Portfolio**: [Live Demo](https://game-folio.vercel.app)

---

*Built with ❤️ and Three.js*