import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  selector?: string; // CSS selector for headings, default is h2, h3
  containerSelector?: string; // The container to look for headings in
  className?: string;
  title?: string; // Custom title for the TOC
  collapsible?: boolean; // Whether the TOC is collapsible on mobile
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  selector = 'h2, h3',
  containerSelector = '.blog-content',
  className,
  title = 'Table of Contents',
  collapsible = true,
}) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768 && collapsible);

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Get all headings that match the selector
    const elements = Array.from(container.querySelectorAll(selector));
    
    // Extract data from headings
    const items: TOCItem[] = elements
      .filter(el => el.id) // Only get elements with IDs
      .map(el => ({
        id: el.id,
        text: el.textContent || '',
        level: parseInt(el.tagName.charAt(1)), // h2 -> 2, h3 -> 3, etc.
      }));
    
    setHeadings(items);

    // Set up intersection observer to highlight active heading
    const observer = new IntersectionObserver(
      entries => {
        // Get the first entry that is intersecting
        const entry = entries.find(entry => entry.isIntersecting);
        if (entry) {
          setActiveId(entry.target.id);
        }
      },
      {
        rootMargin: '-80px 0px -80% 0px', // Adjust these values as needed
        threshold: 0,
      }
    );

    // Observe all heading elements
    elements.forEach(el => {
      if (el.id) {
        observer.observe(el);
      }
    });

    // Add a resize listener to handle collapsible state
    const handleResize = () => {
      if (collapsible) {
        setIsCollapsed(window.innerWidth < 768);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      elements.forEach(el => {
        if (el.id) {
          observer.unobserve(el);
        }
      });
      window.removeEventListener('resize', handleResize);
    };
  }, [containerSelector, selector, collapsible]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={cn('toc-container my-6 rounded-lg border border-primary/10 bg-primary/5 p-4', className)}>
      <div 
        className={cn(
          "flex items-center justify-between text-sm font-semibold mb-2 cursor-pointer",
          collapsible && "md:cursor-default"
        )}
        onClick={collapsible ? toggleCollapse : undefined}
      >
        <span>{title}</span>
        {collapsible && (
          <button 
            className="p-1 rounded-full hover:bg-primary/10 md:hidden"
            aria-label={isCollapsed ? "Expand table of contents" : "Collapse table of contents"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={cn("transition-transform", isCollapsed ? "rotate-0" : "rotate-180")}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        )}
      </div>
      
      <nav className={cn(isCollapsed && collapsible ? "hidden md:block" : "block")}>
        <ul className="space-y-2 text-sm max-h-[60vh] overflow-y-auto pr-2">
          {headings.map(heading => (
            <li
              key={heading.id}
              className={cn(
                'transition-colors hover:text-primary',
                heading.level === 2 ? 'mt-2' : 'ml-4 text-xs',
                activeId === heading.id ? 'text-primary font-medium' : 'text-foreground/70'
              )}
            >
              <a 
                href={`#${heading.id}`}
                className="block hover:underline py-1"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(heading.id);
                  if (element) {
                    // Smooth scroll to element
                    window.scrollTo({
                      top: element.offsetTop - 100, // Adjust offset as needed
                      behavior: 'smooth',
                    });
                    // Manually update active ID
                    setActiveId(heading.id);
                    // Update URL hash without scrolling (browser default behavior)
                    window.history.pushState(null, '', `#${heading.id}`);
                    // Collapse TOC on mobile after clicking
                    if (window.innerWidth < 768 && collapsible) {
                      setIsCollapsed(true);
                    }
                  }
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default TableOfContents; 