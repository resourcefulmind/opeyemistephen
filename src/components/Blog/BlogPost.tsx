import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BlogPost as BlogPostType } from "../../lib/blog/types";
import { getPostBySlug } from "../../lib/blog/loader";
import MDXComponents from "../MDXComponents";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      if (!slug) {
        console.error("No slug provided");
        navigate("/blog");
        return;
      }
      
      console.log("Loading post with slug:", slug);
      
      try {
        const postData = await getPostBySlug(slug);
        console.log("Post data loaded:", postData);
        
        if (!postData) {
          console.error("No post found with slug:", slug);
          navigate("/blog");
          return;
        }
        
        console.log("Post content type:", typeof postData.content);
        console.log("Post frontmatter:", postData.frontmatter);
        
        setPost(postData);
      } catch (error) {
        console.error("Failed to load post:", error);
        navigate("/blog");
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug, navigate]);

  if (loading) {
    return <div className="text-center py-8">Loading post...</div>;
  }

  if (!post) {
    return <div className="text-center py-8">Post not found</div>;
  }

  const PostContent = post.content;
  console.log("Rendering post content component:", PostContent);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-4xl font-bold">{post.frontmatter.title}</h1>
        <p className="text-gray-500">{new Date(post.frontmatter.date).toLocaleDateString()}</p>
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
      </div>
      
      <div className="prose dark:prose-invert max-w-none">
        <MDXComponents>
          <PostContent />
        </MDXComponents>
      </div>
    </div>
  );
}
