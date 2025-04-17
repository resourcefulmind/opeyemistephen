import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

// NavLink component for all links
const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <Link 
      to={to} 
      className="relative group py-3 px-3 outline-none"
      onClick={(e) => {
        // If we're already on this page, blur the element to remove focus states
        if (isActive(to)) {
          e.currentTarget.blur();
        }
      }}
    >
      <div className={cn(
        "absolute inset-0 bg-primary/5 backdrop-blur-md rounded-lg border border-primary/10 transition-all duration-300 -z-10",
        isActive(to) 
          ? "opacity-100" 
          : "opacity-0 group-hover:opacity-100 group-focus:opacity-100"
      )}></div>
      <span className={cn(
        'text-foreground group-hover:text-primary group-focus:text-primary transition-colors duration-300 font-medium text-sm',
        isActive(to) && 'text-primary'
      )}>
        {children}
      </span>
    </Link>
  );
};

const Navbar = () => {
  const location = useLocation();
  const isBlogActive = location.pathname.startsWith('/blog');
  
  return (
    <nav className='py-6'>
      <ul className='flex items-center gap-2'>
        <li>
          <NavLink to='/'>Home</NavLink>
        </li>
        <li>
          <NavLink to='/blog'>Blog</NavLink>
        </li>
        <li>
          <NavLink to='/about'>About</NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
