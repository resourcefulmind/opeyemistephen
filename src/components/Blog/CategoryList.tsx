import { cn } from '../../lib/utils';

type Item = {
    tag: string;
    label: string;
    count: number;
};

export default function CategoryList({
    items, 
    activeTag, 
    onSelect, 
    onClear, 
    limit = 10, 
}: {
    items: Item[];
    activeTag: string | null;
    onSelect: (tag: string) => void;
    onClear: () => void;
    limit?: number;
}) {
    const top = items.slice(0, limit);
    return (
        <div className='rounded-2xl border border-primary/10 bg-secondary/20 backdrop-blur-sm glass-card hover:will-change-transform p-4 md:p-5'>
            <h3 className='text-sm font-semibold mb-6 tracking-wider'>
                <span className='heading-accent'>BROWSE BY CATEGORY</span>
            </h3>

            <div className='flex flex-wrap gap-2'>
                <button
                    onClick={onClear} 
                    className={cn('px-3 py-1.5 rounded-md text-sm border transition-all', 
                    activeTag === null 
                    ? 'bg-primary/20 text-primary border-primary/30' 
                    : 'bg-secondary/20 text-foreground border-primary/10 hover:border-primary/20'
                )}
                >
                    All
                </button>
                {top.map(({ tag, label, count }) => {
                    const isActive = activeTag === tag;
                    return (
                        <button 
                        key={tag}
                        onClick={() => onSelect(tag)}
                        className={cn(
                            'px-3 py-1.5 rounded-md text-sm border transition-all', 
                            isActive 
                            ? 'bg-primary/20 text-primary border-primary/30' 
                            : 'bg-secondary/20 text-foreground border-primary/10 hover:border-primary/20'
                        )}
                        >
                            <span className="truncate max-w-[120px]">{label}</span>
                            <span className='ml-2 text-foreground/60 flex-shrink-0'>({count})</span>
                        </button>
                    );
                })}

            </div>
        </div>
    )
}