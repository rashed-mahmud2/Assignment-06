"use client";

import React, { useState, useEffect } from "react";
import styles from "./CommentModal.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { symbol } from "zod";

const CommentModal = ({ blogId, onClose, onNewComment }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // <-- NEW
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    fetchComments();
  }, []);

  // Fetch latest comments
  const fetchComments = async () => {
    try {
      setLoading(true); // Start loading

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${blogId}/comments`
      );
      const data = await res.json();

      setComments(data.comments.slice(-3).reverse());
    } catch (error) {
      console.log("Error fetching comments:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Submit a new comment
  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true); // Show loading while posting comment

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${blogId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      const data = await res.json();

      // Add new comment to top
      setComments((prev) => [data.comment, ...prev].slice(0, 5));
      setText("");

      try {
        await Promise.allSettled([
          // Revalidate blog list
          fetch("/api/revalidate?tag=blogs", {
            method: "POST",
          }),
          // Revalidate specific blog page
          fetch(`/api/revalidate?tag=blog-${blogId}`, {
            method: "POST",
          }),
          // Revalidate comments for this blog
          fetch(`/api/revalidate?tag=comments-${blogId}`, {
            method: "POST",
          }),
        ]);
      } catch (revalidateError) {
        console.warn("Revalidation failed:", revalidateError);
        // Continue anyway
      }

      // 🔥 Force refresh comments with populated user
      await fetchComments();

      if (onNewComment) onNewComment();
    } catch (error) {
      console.log("Error submitting comment:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // If user not logged in
  if (!token) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <p>Login required to like or comment</p>

          <div className={styles.modalActions}>
            <button className={styles.btn} onClick={onClose}>
              Cancel
            </button>
            <button
              className={styles.btn}
              onClick={() => router.push("/sign-in")}
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3 className={styles.h3}>Comments</h3>

        {loading ? (
          // 🔥 Beautiful Loading UI
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading comments...</p>
          </div>
        ) : (
          <div className={styles.commentsList}>
            {comments.length === 0 ? (
              <p>No comments yet</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className={styles.comment}>
                  <div>
                    <Image
                      src={c.profileImageUrl || "/avater.png"} // default image fallback
                      alt={c.user?.name || "User"}
                      width={40} // fixed width
                      height={40} // fixed height
                      className={styles.commentImage} // optional round styling
                    />
                  </div>
                  <div className={styles.commentContent}>
                    <p className={styles.nameDate}>
                      <strong className={styles.commentUser}>
                        {c.user?.name || "User"}
                      </strong>{" "}
                      <small className={styles.commentDate}>
                        {new Date(c.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </small>
                    </p>
                    <span className={styles.commentText}>{c.text}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <textarea
          className={styles.textarea}
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className={styles.modalActions}>
          <button className={styles.btn} onClick={onClose}>
            Close
          </button>
          <button
            className={styles.btn}
            onClick={handleSubmit}
            disabled={!text.trim() || loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
