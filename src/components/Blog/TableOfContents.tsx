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
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  selector = 'h2, h3',
  containerSelector = '.blog-content',
  className,
}) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

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

    return () => {
      elements.forEach(el => {
        if (el.id) {
          observer.unobserve(el);
        }
      });
    };
  }, [containerSelector, selector]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={cn('toc-container my-6', className)}>
      <div className="text-sm font-semibold mb-2">Table of Contents</div>
      <nav>
        <ul className="space-y-2 text-sm">
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
                className="block hover:underline"
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