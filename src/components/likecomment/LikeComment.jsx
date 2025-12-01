"use client";

import React, { useState, useEffect } from "react";
import styles from "./likecomment.module.css";
import { FaHeart, FaComment } from "react-icons/fa6";
import CommentModal from "../commentModal/CommentModal";
import { toast } from "sonner";

const LikeComment = ({ blogId }) => {
  const [blog, setBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${blogId}`,
          { next: { tags: [`blog-${blogId}`] } }
        );
        const data = await res.json();
        setBlog(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBlog();
  }, [blogId]);

  if (!blog) return null;

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const liked =
    userId && (Array.isArray(blog.likes) ? blog.likes.includes(userId) : false);

  const handleLike = async () => {
    if (!token) {
      setIsModalOpen(true);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${blogId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Like failed");

      setBlog((prev) => {
        const likesArray = Array.isArray(prev.likes) ? [...prev.likes] : [];

        if (likesArray.includes(userId)) {
          // Unlike
          return {
            ...prev,
            likes: likesArray.filter((id) => id !== userId),
          };
        } else {
          // Like
          return {
            ...prev,
            likes: [...likesArray, userId],
          };
        }
      });

      toast.success(blog.likes?.includes(userId) ? "Unliked 💔" : "Liked ♥️");

      await fetch("/api/revalidate?tag=blogs", { method: "POST" });
      await fetch(`/api/revalidate?tag=blog-${blogId}`, { method: "POST" });
    } catch (error) {
      console.error("Like error:", error);
      toast.error(error.message || "Failed to like");
    }
  };


  const openComments = () => setIsModalOpen(true);
  const closeComments = () => setIsModalOpen(false);

  const handleNewComment = (newComment) => {
    setBlog((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
    }));

    fetch("/api/revalidate?tag=blogs", { method: "POST" }).catch(console.warn);
  };

  return (
    <div className={styles.actions}>
      <button
        className={`${styles.likeBtn} ${liked ? styles.liked : ""}`}
        onClick={handleLike}
      >
        <FaHeart /> {(blog.likes || []).length}
      </button>

      <button className={styles.commentBtn} onClick={openComments}>
        <FaComment /> {(blog.comments || []).length}
      </button>

      {isModalOpen && (
        <CommentModal
          blogId={blogId}
          onClose={closeComments}
          onNewComment={handleNewComment}
          onRevalidate={() => {
            fetch("/api/revalidate?tag=blogs", { method: "POST" }).catch(
              console.warn
            );
          }}
        />
      )}
    </div>
  );
};

export default LikeComment;
