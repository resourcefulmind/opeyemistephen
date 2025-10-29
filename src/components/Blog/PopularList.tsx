import { Link } from 'react-router-dom';
import { BlogPostPreview } from '../../lib/blog/types';

export default function PopularList({ items }: { items: BlogPostPreview[]}) {
    if (!items.length) return null;

    return (
        <div className='rounded-2xl border border-primary/10 bg-secondary/20 backdrop-blur-sm glass-card hover:will-change-transform p-4 md:p-5'>
            <h3 className='text-sm font-semibold mb-6 tracking-wider'>
                <span className='heading-accent'>POPULAR POSTS</span>
            </h3>

            <ul className='space-y-2'>
                {items.map((post) => (
                    <li key={post.slug} className='flex items-start justify-between gap-3'>
                        <Link  
                            to={`/blog/${post.slug}`}
                            className='text-sm font-medium text-primary hover:text-primary/80 transition-colors leading-snug line-clamp-2' 
                            title={post.frontmatter.title}
                        >
                            {post.frontmatter.title}
                        </Link>
                        <span className='text-foreground/60 text-sm'>
                            →
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}