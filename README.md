# Opeyemi's Portfolio

Welcome to my digital space! This is where elegance meets functionality - a portfolio that showcases my work through modern design and smooth animations. Built with React and TypeScript, featuring a unique dark/light theme transition that brings creativity to life.

![Portfolio Preview](public/preview.png)

## ✨ What Makes This Special

- **Creative Name Animation** - Watch as "Opeyemi Bangkok" transforms into "Opeyemi Stephen" with a unique falling letter effect
- **Dynamic Themes** 
  - Dark mode features twinkling stars and shooting comets
  - Light mode comes alive with colorful paint splashes
- **Metallic Text Effect** - Custom-built metallic text with dynamic glow animations
- **Responsive & Smooth** - Fluid animations and perfect responsiveness across all devices
- **Modern Stack** - Built with the latest web technologies for optimal performance

## 🎯 Technical Highlights

- **Optimized Animations** - Utilizing Framer Motion's `AnimatePresence` for seamless transitions
- **Custom Hooks** - Efficient theme management and animation state handling
- **Advanced CSS** - Blend modes, dynamic shadows, and custom keyframe animations
- **Performance First** - Lazy loading, optimized assets, and smooth 60fps animations
- **Type Safety** - Strict TypeScript implementation for robust code quality

## 🛠 Built With

- React & TypeScript for robust development
- Framer Motion for butter-smooth animations
- Tailwind CSS for sleek styling
- Satoshi font for modern typography
- Lucide Icons for clean, consistent iconography

## 🚀 Running the Project

1. Clone it:
```bash
git clone https://github.com/opeyemibami/portfolio-blog.git
cd portfolio-blog
```

2. Install what you need:
```bash
npm install
```

3. Start it up:
```bash
npm run dev
```

4. View it at [http://localhost:3000](http://localhost:3000)

## 🎨 Making It Your Own

### Colors

The theme colors live in `src/index.css`:

```css
:root {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --paint-1: 0 90% 60%;
  --paint-2: 240 90% 60%;
  --paint-3: 180 90% 60%;
  --paint-4: 120 90% 60%;
}
```

### Animation Timing

Want to adjust the animations? Check `src/components/Hero.tsx`:

```typescript
const ANIMATION_DELAYS = {
  GLOW: 1500,
  FALLING: 4000,
  STEPHEN: 500,
  LETTER_INTERVAL: 0.4,
};
```

### Key Features Implementation

```typescript
// Metallic Text Effect
const metallic = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 1, ease: "easeOut" }
};

// Dynamic Theme Toggle
const themeTransition = {
  duration: 0.7,
  ease: [0.43, 0.13, 0.23, 0.96]
};
```

## 📱 Responsive Breakpoints

Everything scales beautifully across:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)
- Large Screens (1280px+)

## 🔧 Project Layout

```
portfolio-blog/
├── src/
│   ├── components/        # React components
│   │   ├── Hero.tsx      # Main animated hero section
│   │   ├── ThemeToggle.tsx   # Theme switcher
│   │   ├── Background/    # Background effects
│   │   └── Animations/    # Reusable animations
│   ├── lib/              # Utility functions
│   │   ├── hooks/        # Custom React hooks
│   │   └── utils.ts      # Helper functions
│   └── styles/           # Global styles
├── public/               # Static assets
└── package.json         
```

## 📦 Core Dependencies

- react & react-dom
- framer-motion
- tailwindcss
- lucide-react
- clsx & tailwind-merge

## 🔮 Future Updates

I'm constantly improving this portfolio. Here's what's coming:
- Blog section with MDX support
- Interactive project showcases
- Advanced animation sequences
- Performance optimizations
- More theme variations

## 👤 About Me

Opeyemi Stephen - Full Stack Developer & Technical Writer
- Portfolio: [opeyemi.dev](https://opeyemi.dev)
- GitHub: [@opeyemibami](https://github.com/opeyemibami)
- LinkedIn: [Opeyemi Stephen](https://linkedin.com/in/opeyemibami)

## 🙏 Special Thanks To

- [Satoshi Font](https://www.fontshare.com/fonts/satoshi) - The elegant typeface you see
- [Framer Motion](https://www.framer.com/motion/) - Powers all the smooth animations
- [Tailwind CSS](https://tailwindcss.com) - Makes the styling a breeze
- [Lucide Icons](https://lucide.dev) - Beautiful, consistent icons

---

Built with precision and passion 🚀 