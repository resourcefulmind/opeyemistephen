import { cn } from '../../lib/utils';

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MobileNav({ isOpen, onToggle }: MobileNavProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'lg:hidden', // Only visible on mobile
        'flex flex-col justify-center items-center',
        'w-10 h-10 rounded-lg',
        'bg-secondary/20 backdrop-blur-sm',
        'border border-primary/10',
        'transition-all duration-300 ease-out',
        'hover:bg-secondary/30 hover:border-primary/20',
        'focus:outline-none focus:ring-2 focus:ring-primary/30',
        'active:scale-95'
      )}
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={isOpen}
    >
      {/* Hamburger Icon */}
      <div className="relative w-5 h-5">
        <span
          className={cn(
            'absolute top-1 left-0 w-5 h-0.5 bg-foreground transition-all duration-300 ease-out',
            isOpen ? 'rotate-45 translate-y-1.5' : 'translate-y-0'
          )}
        />
        <span
          className={cn(
            'absolute top-2 left-0 w-5 h-0.5 bg-foreground transition-all duration-300 ease-out',
            isOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
          )}
        />
        <span
          className={cn(
            'absolute top-3 left-0 w-5 h-0.5 bg-foreground transition-all duration-300 ease-out',
            isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-0'
          )}
        />
      </div>
    </button>
  );
}
