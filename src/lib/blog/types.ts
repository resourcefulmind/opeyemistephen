export interface PostMetadata {
    title: string;
    date: string;
    excerpt: string; 
    tags: string[];
    slug: string;
}

export interface BlogPost {
    content: React.ComponentType;
    frontmatter: PostMetadata;
    slug: string;
}

//to be used in bloglist views where full content is not needeed
export interface BlogPostPreview {
    frontmatter: PostMetadata;
    slug: string;
}