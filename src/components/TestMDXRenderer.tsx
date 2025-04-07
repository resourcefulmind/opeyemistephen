import React from 'react';
import MDXComponents from './MDXComponents';
import TestPost, { frontmatter as testFrontmatter } from '../content/articles/test-post.mdx';

const TestMDXRenderer: React.FC = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-4xl font-bold">{testFrontmatter.title}</h1>
        <p className="text-gray-500">{new Date(testFrontmatter.date).toLocaleDateString()}</p>
        <div className="flex gap-2 mt-2">
          {testFrontmatter.tags.map((tag: string) => (
            <span 
              key={tag} 
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="prose dark:prose-invert max-w-none">
        <MDXComponents>
          <TestPost />
        </MDXComponents>
      </div>
    </div>
  );
};

export default TestMDXRenderer; 