import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import { ThemeToggle } from './ThemeToggle';
import MeteorShower from './MeteroShower';

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

function TwinklingBackground() {
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

    // Create initial stars
    const starCount = Math.floor((window.innerWidth * window.innerHeight) / 3000);
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

function ShootingStars() {
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
      className="inline-block"
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
    { Icon: Github, href: "https://github.com", label: "GitHub" },
    { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { Icon: Mail, href: "mailto:contact@example.com", label: "Email" }
  ] as const;

  const SKILLS = ['React', 'TypeScript', 'Node.js', 'Web3', 'Technical Writing'] as const;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8">
      <ThemeToggle className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50" />
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
            "text-[3rem] sm:text-[4.75rem] md:text-[5.75rem] lg:text-[6.75rem] font-display mb-8 sm:mb-10 flex justify-center items-center gap-3 sm:gap-5 text-primary leading-none",
            nameAnimation && "metallic-text", 
            "text-primary"
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
                className="relative inline-block" 
                style={{ minWidth: '520px', minHeight: '150px' }}
              >
                <motion.div
                  className="metallic-text absolute top-0 left-0"
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
          className="typewriter text-lg sm:text-xl md:text-2xl lg:text-3xl text-primary/90 mb-12 sm:mb-16 tracking-normal font-display font-medium"
        >
          Software Engineer, Technical Writer & Ecosystem Buildoor
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-4 sm:gap-8 mb-12 sm:mb-16"
        >
          {SOCIAL_LINKS.map(({ Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "p-3 sm:p-4 rounded-full transition-all duration-300",
                "bg-secondary/20 hover:bg-secondary/40",
                "group relative",
                "backdrop-blur-sm"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-primary group-hover:scale-110 transition-transform" />
              <span className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs sm:text-sm text-primary whitespace-nowrap">
                {label}
              </span>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-4"
        >
          {SKILLS.map((skill, index) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className={cn(
                "px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg",
                "bg-secondary/20 text-primary",
                "backdrop-blur-sm",
                "border border-primary/10",
                "transition-all duration-300 hover:scale-105",
                "shine-effect hover:glow-effect"
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