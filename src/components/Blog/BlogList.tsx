import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BlogPostPreview } from "../../lib/blog/types";
import { getAllPosts } from "../../lib/blog/loader";

export default function BlogList() {
    const [posts, setPosts] = useState<BlogPostPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadPosts() {
            try {
                console.log("Fetching all posts...");
                const allPosts = await getAllPosts();
                console.log("Posts loaded:", allPosts);
                setPosts(allPosts);
                setLoading(false);
            } catch (err) {
                console.error("Error loading posts:", err);
                setError(
                    "Failed to load posts at this time...wanna check your network connection"
                );
                setLoading(false);
            }
        }

        loadPosts();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-[50vh]">
            <div className="text-lg text-primary">Loading...</div>
        </div>;
    }

    if (error) {
        return <div className="text-center p-8 text-destructive">
            Error loading posts: {error}
        </div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-display font-bold mb-8 text-primary">Blog</h1>
            <ul className="space-y-6">
                {posts.map((post) => (
                    <li key={post.slug} className="bg-primary/5 backdrop-blur-sm p-6 rounded-lg border border-primary/10 transition-all duration-300 hover:scale-[1.01]">
                        <Link to={`/blog/${post.slug}`} className="text-xl font-bold text-primary hover:underline block mb-2">
                            {post.frontmatter.title}
                        </Link>
                        <p className="text-foreground/80">{post.frontmatter.excerpt}</p>
                        <div className="flex gap-2 mt-2">
                            {post.frontmatter.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 bg-blue-500/50 text-white text-xs rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
