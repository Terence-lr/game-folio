# Gamefolio - Underwater Portfolio Experience

An immersive 3D underwater portfolio experience built with Three.js. Navigate through an underwater world to explore Terence Richardson's portfolio projects and skills.

## 🐠 Features

- **Interactive 3D Environment**: Swim through an underwater world with realistic physics and lighting
- **Portfolio Integration**: Discover projects by swimming to different underwater landmarks
- **Cross-Platform Controls**: 
  - Desktop: WASD/Arrow keys for movement, R/F for depth, Space for boost, mouse drag for camera
  - Mobile: Virtual joystick, touch controls, and gesture-based camera movement
- **Performance Optimized**: Built for smooth 60fps on both desktop and mobile devices
- **Responsive Design**: Adapts to different screen sizes and orientations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Terence-lr/game-folio.git
cd game-folio

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 🌐 Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

The project includes:
- `vercel.json` configuration for optimal performance
- Proper caching headers for static assets
- Security headers for production deployment

## 🎮 Controls

### Desktop
- **Movement**: WASD or Arrow Keys
- **Depth**: R (up) / F (down)
- **Boost**: Spacebar
- **Camera**: Mouse drag to rotate

### Mobile
- **Movement**: Virtual joystick
- **Depth**: Up/Down buttons
- **Boost**: Boost button
- **Camera**: Touch and drag to rotate

## 🛠️ Technology Stack

- **Three.js**: 3D graphics and WebGL rendering
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and better development experience
- **Vercel**: Hosting and deployment platform

## 📁 Project Structure

```
game-folio/
├── index.html          # Main HTML file with embedded Three.js code
├── favicon.svg         # Site favicon
├── manifest.json       # PWA manifest
├── robots.txt          # SEO robots file
├── sitemap.xml         # SEO sitemap
├── vercel.json         # Vercel deployment configuration
├── vite.config.ts      # Vite build configuration
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## 🎨 Customization

The portfolio items and their positions can be customized in the `portfolioItemData` array within `index.html`:

```javascript
const portfolioItemData = [
  { 
    type: 'crystal', 
    pos: new THREE.Vector3(-20, -5, 0), 
    color: 0x00ffff, 
    title: "Your Project", 
    desc: "Project description", 
    link: "https://your-project-link.com" 
  },
  // Add more projects...
];
```

## 🐛 Troubleshooting

### WebGL Issues
If the 3D environment doesn't load:
1. Ensure your browser supports WebGL
2. Check browser console for error messages
3. Try updating your graphics drivers

### Performance Issues
- On mobile devices, the experience is optimized for performance
- Reduce particle count or disable shadows if needed
- Check browser developer tools for performance metrics

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Terence Richardson**
- GitHub: [@Terence-lr](https://github.com/Terence-lr)
- Portfolio: [gamefolio.vercel.app](https://gamefolio.vercel.app)

## 🙏 Acknowledgments

- Three.js community for the amazing 3D library
- Vercel for seamless deployment platform
- All contributors and testers

---

Made with ❤️ and Three.js