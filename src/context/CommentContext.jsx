"use client";

import { createContext, useContext, useState, useCallback } from "react";

const CommentContext = createContext(undefined);

export function CommentProvider({ children }) {
  const [commentsByBlog, setCommentsByBlog] = useState({});
  const [fetchedBlogs, setFetchedBlogs] = useState(new Set()); // Track fetched blogs

  // ✅ useCallback দিয়ে memoize করো
  const fetchComments = useCallback(
    async (blogId) => {
      // Skip if already fetched
      if (fetchedBlogs.has(blogId)) {
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${blogId}/comments`
        );

        if (!res.ok) {
          console.error(`Failed to fetch comments for ${blogId}:`, res.status);
          return;
        }

        const data = await res.json();

        if (data.comments) {
          setCommentsByBlog((prev) => ({
            ...prev,
            [blogId]: data.comments,
          }));

          // Mark as fetched
          setFetchedBlogs((prev) => new Set([...prev, blogId]));
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    },
    [fetchedBlogs]
  ); // ✅ fetchedBlogs dependency

  // ✅ Memoize addComment
  const addComment = useCallback((blogId, comment) => {
    setCommentsByBlog((prev) => ({
      ...prev,
      [blogId]: [...(prev[blogId] || []), comment],
    }));

    // Also remove from fetched set to allow refetching
    setFetchedBlogs((prev) => {
      const newSet = new Set(prev);
      newSet.delete(blogId);
      return newSet;
    });
  }, []);

  // ✅ Memoize getComments
  const getComments = useCallback(
    (blogId) => {
      return commentsByBlog[blogId] || [];
    },
    [commentsByBlog]
  ); // ✅ commentsByBlog change হলে update হবে

  // ✅ Memoize getCommentCount
  const getCommentCount = useCallback(
    (blogId) => {
      return commentsByBlog[blogId]?.length || 0;
    },
    [commentsByBlog]
  );

  // ✅ Memoize refreshComments
  const refreshComments = useCallback(
    async (blogId) => {
      // Remove from fetched set to force refetch
      setFetchedBlogs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(blogId);
        return newSet;
      });

      await fetchComments(blogId);
    },
    [fetchComments]
  );

  return (
    <CommentContext.Provider
      value={{
        commentsByBlog,
        fetchComments,
        addComment,
        getComments,
        getCommentCount,
        refreshComments,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
}

// Custom hook for easy access
export const useComments = () => {
  const context = useContext(CommentContext);

  if (context === undefined) {
    throw new Error("useComments must be used within a CommentProvider");
  }

  return context;
};
