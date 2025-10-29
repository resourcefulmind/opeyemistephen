import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import MeteorShower from './MeteroShower';

// Custom X (formerly Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Animation constants
const ANIMATION_DELAYS = {
  GLOW: 1500,
  FALLING: 4000,
  STEPHEN: 500,
  LETTER_INTERVAL: 0.4,
} as const;

const SPRING_ANIMATION = {
  type: "spring",
  stiffness: 200,
  damping: 20,
} as const;

const EASE_ANIMATION = {
  duration: 1.2,
  ease: [0.43, 0.13, 0.23, 0.96],
} as const;

export function TwinklingBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createStar = () => {
      const star = document.createElement('div');
      star.className = 'twinkle';
      star.style.setProperty('--twinkle-duration', `${Math.random() * 3 + 1}s`);
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      return star;
    };

    const createComet = () => {
      const comet = document.createElement('div');
      comet.className = 'comet';
      
      // Random duration between 45-60 seconds for slower movement
      comet.style.setProperty('--comet-duration', `${Math.random() * 15 + 45}s`);
      
      // Always start from top-left
      comet.style.left = '-100px';
      comet.style.top = '-100px';
      
      // Fixed rotation for diagonal trajectory
      comet.style.transform = 'rotate(45deg)';
      
      return comet;
    };

    // Create initial stars with performance optimization
    const baseStarCount = Math.floor((window.innerWidth * window.innerHeight) / 3000);
    const maxStars = window.innerWidth < 768 ? 50 : window.innerWidth < 1024 ? 100 : 200;
    const starCount = Math.min(baseStarCount, maxStars);
    const stars = Array.from({ length: starCount }, createStar);
    stars.forEach(star => container.appendChild(star));

    // Create comets periodically
    const createCometPeriodically = () => {
      if (!document.documentElement.classList.contains('dark')) return;
      
      const comet = createComet();
      container.appendChild(comet);
      
      // Remove comet after animation
      comet.addEventListener('animationend', () => {
        comet.remove();
      });
    };

    // Create comets less frequently (every 15-20 seconds)
    const createRandomComet = () => {
      createCometPeriodically();
      const nextDelay = Math.random() * 5000 + 15000; // 15-20 seconds
      setTimeout(createRandomComet, nextDelay);
    };

    // Start creating comets
    createRandomComet();
    
    // Create initial comets with longer delay
    for (let i = 0; i < 2; i++) {
      setTimeout(createCometPeriodically, i * 5000);
    }

    // Cleanup
    return () => {
      stars.forEach(star => star.remove());
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 overflow-hidden" />;
}

function ShootingStar() {
  const [direction, setDirection] = useState<'north' | 'south' | 'east' | 'west'>('east');
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const directions = ['north', 'south', 'east', 'west'] as const;
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    setDirection(randomDirection);

    // Set initial position based on direction
    switch (randomDirection) {
      case 'north':
        setPosition({ x: Math.random() * window.innerWidth, y: window.innerHeight + 100 });
        break;
      case 'south':
        setPosition({ x: Math.random() * window.innerWidth, y: -100 });
        break;
      case 'east':
        setPosition({ x: -100, y: Math.random() * window.innerHeight });
        break;
      case 'west':
        setPosition({ x: window.innerWidth + 100, y: Math.random() * window.innerHeight });
        break;
    }
  }, []);

  const getEndPosition = () => {
    switch (direction) {
      case 'north':
        return { x: position.x, y: -100 };
      case 'south':
        return { x: position.x, y: window.innerHeight + 100 };
      case 'east':
        return { x: window.innerWidth + 100, y: position.y };
      case 'west':
        return { x: -100, y: position.y };
    }
  };

  return (
    <motion.div
      className="absolute w-1 h-1 bg-white rounded-full"
      initial={{ x: position.x, y: position.y, opacity: 0 }}
      animate={{ 
        x: getEndPosition().x, 
        y: getEndPosition().y, 
        opacity: [0, 1, 0]
      }}
      transition={{ 
        duration: 1.5,
        ease: "linear",
        opacity: {
          times: [0, 0.2, 1]
        }
      }}
    >
      <div className="absolute inset-0 bg-white blur-sm" />
      <div className="absolute top-1/2 right-0 w-20 h-[1px] bg-gradient-to-l from-white to-transparent transform -translate-y-1/2" />
    </motion.div>
  );
}

export function ShootingStars() {
  const stars = [...Array(10)].map((_, index) => ({
    id: `${Date.now()}-${index}`,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {stars.map((star) => (
          <ShootingStar key={star.id} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function FallingLetter({ letter, delay, onComplete }: { letter: string; delay: number; onComplete?: () => void }) {
  return (
    <motion.span
      className="inline-block relative"
      initial={{ y: 0, rotateX: 0, opacity: 1 }}
      animate={{ 
        y: 100,
        rotateX: 90,
        opacity: 0
      }}
      transition={{ 
        delay,
        ...EASE_ANIMATION
      }}
      onAnimationComplete={onComplete}
      style={{ 
        position: 'relative',
        zIndex: 1
      }}
    >
      {letter}
    </motion.span>
  );
}

function Sweeper() {
  return (
    <motion.div
      className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 4, duration: 1 }}
    >
      <div className="w-8 h-8 bg-white rounded-full" />
    </motion.div>
  );
}

function PaintSplashes() {
  const [splashes, setSplashes] = useState<Array<{ id: number; color: number; x: number; y: number; size: number }>>([]);

  useEffect(() => {
    const createSplash = () => {
      const newSplashes = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        color: (i % 4) + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 800 + 400
      }));
      setSplashes(newSplashes);
    };

    if (document.documentElement.classList.contains('light')) {
      createSplash();
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target instanceof HTMLElement && mutation.target.classList.contains('light')) {
          setSplashes([]);
          setTimeout(createSplash, 50);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {splashes.map((splash) => (
        <div
          key={splash.id}
          className="paint-splash"
          style={{
            left: `${splash.x}%`,
            top: `${splash.y}%`,
            width: `${splash.size}px`,
            height: `${splash.size}px`,
            backgroundColor: `hsla(var(--paint-${splash.color}), 0.8)`,
            transform: `rotate(${Math.random() * 360}deg) scale(${0.8 + Math.random() * 0.4})`,
            filter: 'blur(40px)'
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const [nameAnimation, setNameAnimation] = useState(false);
  const [lettersFalling, setLettersFalling] = useState(false);
  const [showStephen, setShowStephen] = useState(false);
  const fallenLettersCount = useRef(0);

  useEffect(() => {
    const glowTimer = setTimeout(() => {
      setNameAnimation(true);
    }, ANIMATION_DELAYS.GLOW);

    const fallingTimer = setTimeout(() => {
      setLettersFalling(true);
    }, ANIMATION_DELAYS.FALLING);

    return () => {
      clearTimeout(glowTimer);
      clearTimeout(fallingTimer);
    };
  }, []);

  const handleLetterFall = () => {
    fallenLettersCount.current += 1;
    if (fallenLettersCount.current === 7) {
      setTimeout(() => {
        setShowStephen(true);
      }, ANIMATION_DELAYS.STEPHEN);
    }
  };

  const SOCIAL_LINKS = [
    { Icon: Github, href: "https://github.com/resourcefulmind", label: "GitHub" },
    { Icon: Linkedin, href: "https://www.linkedin.com/in/opeyemistephen/", label: "LinkedIn" },
    { Icon: XIcon, href: "https://x.com/devvgbg", label: "X" },
    { Icon: Mail, href: "mailto:omodaraopeyemi754@gmail.com", label: "Email" }
  ] as const;

  const SKILLS = ['React', 'TypeScript', 'Node.js', 'Web3', 'Technical Writing'] as const;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 w-full h-full bg-background transition-colors duration-700">
        <TwinklingBackground />
        <ShootingStars />
        <MeteorShower />
        <PaintSplashes />
        <div className="nebula nebula-left" />
        <div className="nebula nebula-right" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_100%)] animate-float dark:opacity-100 light:opacity-30" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center w-full max-w-4xl mx-auto"
      >
        <motion.h1 
          className={cn(
            // Mobile: Single line, smaller text to fit
            "text-[2rem] flex flex-row items-center justify-center gap-2 text-primary leading-tight",
            // Small mobile: Slightly larger but still single line
            "sm:text-[2.5rem] sm:gap-3",
            // Tablet: Medium size
            "md:text-[3.5rem] md:gap-4",
            // Desktop: Large size
            "lg:text-[4.5rem] lg:gap-5",
            // Large desktop: Extra large
            "xl:text-[5.5rem] xl:gap-6",
            "font-display mb-6 sm:mb-8 md:mb-10 lg:mb-12",
            nameAnimation && "metallic-text"
          )}
          data-text="Opeyemi Bangkok"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.span
            className="metallic-text"
            data-text="Opeyemi"
            layout
            transition={SPRING_ANIMATION}
          >
            Opeyemi
          </motion.span>
          
          <AnimatePresence mode="wait">
            {showStephen ? (
              <motion.span
                key="stephen"
                className="metallic-text"
                data-text="Stephen"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={EASE_ANIMATION}
              >
                Stephen
              </motion.span>
            ) : lettersFalling ? (
              <motion.div 
                key="bangkok-falling"
                className="relative flex justify-center items-center" 
                style={{ 
                  minWidth: 'clamp(200px, 50vw, 520px)', 
                  minHeight: 'clamp(80px, 12vw, 150px)',
                  width: 'clamp(200px, 50vw, 520px)'
                }}
              >
                <motion.div
                  className="metallic-text relative flex justify-center items-center"
                  data-text="Bangkok"
                >
                  {['B', 'a', 'n', 'g', 'k', 'o', 'k'].map((letter, index) => (
                    <FallingLetter 
                      key={index} 
                      letter={letter} 
                      delay={index * ANIMATION_DELAYS.LETTER_INTERVAL}
                      onComplete={handleLetterFall}
                    />
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <motion.span
                key="bangkok"
                className="metallic-text"
                data-text="Bangkok"
                exit={{ 
                  opacity: 0,
                  transition: { duration: 0.5 }
                }}
              >
                Bangkok
              </motion.span>
            )}
          </AnimatePresence>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "typewriter text-primary/90 tracking-normal font-display font-medium",
            // Mobile: Smaller text, allow wrapping, more padding
            "text-sm px-4 mb-8 leading-relaxed",
            // Small mobile: Slightly larger, still allow wrapping
            "sm:text-base sm:px-2 sm:mb-10 sm:leading-normal",
            // Tablet: Medium size, single line
            "md:text-lg md:px-0 md:mb-12 md:whitespace-nowrap",
            // Desktop: Large size, single line
            "lg:text-xl lg:mb-14 lg:whitespace-nowrap",
            // Large desktop: Extra large, single line
            "xl:text-2xl xl:mb-16 xl:whitespace-nowrap"
          )}
        >
          SDE, Technical Writer & Ecosystem Buildoor
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={cn(
            "flex justify-center mb-8 sm:mb-12 md:mb-14 lg:mb-16",
            // Mobile: Smaller gaps, more compact
            "gap-3 px-4",
            // Small mobile: Slightly larger gaps
            "sm:gap-4 sm:px-2",
            // Tablet: Medium gaps
            "md:gap-6 md:px-0",
            // Desktop: Large gaps
            "lg:gap-8"
          )}
        >
          {SOCIAL_LINKS.map(({ Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "rounded-full transition-all duration-300",
                "bg-secondary/20 hover:bg-secondary/40",
                "group relative backdrop-blur-sm",
                // Mobile: Smaller touch targets
                "p-2.5 min-h-[40px] min-w-[40px]",
                // Small mobile: Slightly larger
                "sm:p-3 sm:min-h-[44px] sm:min-w-[44px]",
                // Tablet: Medium size
                "md:p-4",
                // Desktop: Large size
                "lg:p-5"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className={cn(
                "text-primary group-hover:scale-110 transition-transform",
                // Mobile: Smaller icons
                "w-4 h-4",
                // Small mobile: Slightly larger
                "sm:w-5 sm:h-5",
                // Tablet: Medium size
                "md:w-6 md:h-6",
                // Desktop: Large size
                "lg:w-7 lg:h-7"
              )} />
              <span className={cn(
                "absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-primary whitespace-nowrap",
                // Mobile: Closer to icon
                "-bottom-5 text-xs",
                // Small mobile: Slightly further
                "sm:-bottom-6 sm:text-sm",
                // Tablet: Further away
                "md:-bottom-8"
              )}>
                {label}
              </span>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={cn(
            "flex flex-wrap justify-center",
            // Mobile: Smaller gaps, more padding
            "gap-1.5 px-4",
            // Small mobile: Slightly larger gaps
            "sm:gap-2 sm:px-2",
            // Tablet: Medium gaps
            "md:gap-3 md:px-0",
            // Desktop: Large gaps
            "lg:gap-4"
          )}
        >
          {SKILLS.map((skill, index) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className={cn(
                "rounded-full bg-secondary/20 text-primary backdrop-blur-sm border border-primary/10 transition-all duration-300 hover:scale-105 shine-effect hover:glow-effect",
                // Mobile: Smaller text and padding
                "px-2.5 py-1.5 text-xs",
                // Small mobile: Slightly larger
                "sm:px-3 sm:py-2 sm:text-sm",
                // Tablet: Medium size
                "md:px-4 md:py-2.5 md:text-base",
                // Desktop: Large size
                "lg:px-6 lg:py-3 lg:text-lg"
              )}
              whileHover={{
                textShadow: "0 0 15px hsla(var(--primary), 0.8), 0 0 30px hsla(var(--primary), 0.4)"
              }}
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
      {lettersFalling && <Sweeper />}
    </div>
  );
}