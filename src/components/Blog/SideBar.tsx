import CategoryList from './CategoryList';
import PopularList from './PopularList';
import { BlogPostPreview } from '../../lib/blog/types';

export default function Sidebar({
    tagStats, 
    popularPosts, 
    recentPosts,
    activeTag, 
    onSelectTag, 
    onClear, 
}: {
    tagStats: Array<{ tag: string; count: number; label: string }>;
    popularPosts: BlogPostPreview[];
    recentPosts: BlogPostPreview[];
    activeTag: string | null;
    onSelectTag: (tag: string) => void;
    onClear: () => void;
}) {
    return (
        <aside className='space-y-6'>
            <CategoryList
                items={tagStats}
                activeTag={activeTag}
                onSelect={onSelectTag}
                onClear={onClear}
            />
            <PopularList items={popularPosts} />
            {recentPosts.length > 0 && (
                <div className='rounded-2xl border border-primary/10 bg-secondary/20 backdrop-blur-sm glass-card hover:will-change-transform p-4 md:p-5'>
                    <h3 className='text-sm font-semibold mb-6 tracking-wider'>
                        <span className='heading-accent'>MOST RECENT</span>
                    </h3>

                    <ul className='space-y-2'>
                        {recentPosts.slice(0, 4).map((post) => (
                            <li key={post.slug} className='flex items-start justify-between gap-3'>
                                <a  
                                    href={`/blog/${post.slug}`}
                                    className='text-sm font-medium text-primary hover:text-primary/80 transition-colors leading-snug line-clamp-2' 
                                    title={post.frontmatter.title}
                                >
                                    {post.frontmatter.title}
                                </a>
                                <span className='text-foreground/60 text-sm'>
                                    →
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </aside>
    );
}