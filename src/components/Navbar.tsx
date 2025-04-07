import React from 'react'; 
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => {
  return (
    <Link 
      to={to} 
      className="relative group py-3 px-3"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary/5 backdrop-blur-md rounded-lg border border-primary/10 transition-all duration-300 -z-10"></div>
      <span className='text-foreground group-hover:text-primary transition-colors duration-300 font-medium text-sm'>
        {children}
      </span>
    </Link>
  );
};

const Navbar = () => {
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
