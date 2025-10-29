import { useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

interface ConditionalHeaderProps {
  children: React.ReactNode;
}

export default function ConditionalHeader({ children }: ConditionalHeaderProps) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className={cn(
      'fixed top-0 left-0 right-0 flex justify-between items-center px-6 z-50',
      isHomePage 
        ? '' // Completely transparent on home page
        : 'bg-background/40 backdrop-blur-xl' // Glassmorphism on other pages
    )}>
      {children}
    </div>
  );
}
