import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

//Define blogpost type
interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
}

//Dummy Hard Data
const dummyPosts: BlogPost[] = [
    {
        id: 1, 
        title: "Getting Started With React", 
        slug: "getting-started-with-react", 
        excerpt: "Learn the basics of React and how to set up your first project.", 
    }, 
    {
        id: 2, 
        title: "Understanding Hooks In React", 
        slug: "understanding-hooks-in-react", 
        excerpt: "Explore the power of React Hooks and how they can simplify your code", 
    }, 
    {
        id: 3, 
        title: "Building a blog with MDX", 
        slug: "building-a-blog-with-mdx", 
        excerpt: "A step-by-step guide to creating a blog using MDX and React."
    }
]

function BlogList() {
    const [posts, setPosts] = React.useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    //function to fetch blogposts
    const fetchBlogPosts = async () => {
        try {
            const data = dummyPosts; 
            setPosts(data); //set the fetch posts to state
            setLoading(false); //Set loading to false
        } catch (err) {
            setError("Failed to load posts at this time...wanna check your network connection?"); 
            setLoading(false);
        }
    }

    //fetching blogposts
    useEffect(() => {
        //fetch posts from content/articles or an API
        fetchBlogPosts();
    }, []) //Empty dependency array to run once on mount

    //Render Loading State
    if (loading) {
        return <div className="flex items-center justify-center h-[50vh]">
            <div className="text-lg text-primary">Loading...</div>
        </div>
    }

    //Render error state
    if (error) {
        return <div className="text-center p-8 text-destructive">
            Error loading posts: {error}
        </div>
    }

    //To Render Blog posts list
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-display font-bold mb-8 text-primary">Blog</h1>
            <ul className="space-y-6">
                {posts.map(post => (
                    <li key={post.id} className="bg-primary/5 backdrop-blur-sm p-6 rounded-lg border border-primary/10 transition-all duration-300 hover:scale-[1.01]">
                        <Link to={`/blog/${post.slug}`} className="text-xl font-bold text-primary hover:underline block mb-2">
                            {post.title}
                        </Link>
                        <p className="text-foreground/80">{post.excerpt}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default BlogList;
