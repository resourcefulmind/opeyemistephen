import { Moon, Sun } from 'lucide-react';
import { useTheme } from "../hooks/useTheme";
import { cn } from "../lib/utils";

// Create a global event for theme changes
const themeChangeEvent = new CustomEvent('themeChange');

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "rounded-lg p-2 hover:bg-secondary/20 transition-colors duration-200",
        "backdrop-blur-sm border border-primary/10",
        "group shadow-lg",
        className
      )}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-6 w-6 text-primary" />
      ) : (
        <Moon className="h-6 w-6 text-primary" />
      )}
    </button>
  );
}