import { useLocation } from 'react-router-dom';
import { useMobileNav } from '../../contexts/MobileNavContext';
import MobileNav from './MobileNav';

export default function BlogMobileNavButton() {
  const location = useLocation();
  const { isMobileNavOpen, toggleMobileNav } = useMobileNav();
  
  // Only show on blog pages
  const isBlogPage = location.pathname.startsWith('/blog');
  
  if (!isBlogPage) return null;
  
  return (
    <MobileNav 
      isOpen={isMobileNavOpen}
      onToggle={toggleMobileNav}
    />
  );
}
