import { Moon, Sun } from 'lucide-react';
import { useTheme } from "../lib/hooks/useTheme";
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
        "relative group p-3 rounded-full",
        "hover:scale-105 transition-all duration-300",
        className
      )}
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary/5 backdrop-blur-md rounded-full border border-primary/10 transition-all duration-300"></div>
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-primary relative" />
      ) : (
        <Moon className="h-5 w-5 text-primary relative" />
      )}
    </button>
  );
}