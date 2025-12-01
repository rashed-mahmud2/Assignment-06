"use client";

import Link from "next/link";
import Image from "next/image";
import { IoIosSend } from "react-icons/io";
import { useEffect, useState } from "react";
import { getComments, createComment } from "@/lib/api";
import { toast } from "sonner";
import styles from "./comments.module.css";

const Comments = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [status, setStatus] = useState("loading"); // loading, authenticated, unauthenticated
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setStatus(token ? "authenticated" : "unauthenticated");
  }, []);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!blogId) return;
      setLoading(true);
      try {
        const data = await getComments(blogId);
        const sortedComments = (data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setComments(sortedComments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [blogId]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);

    try {
      const added = await createComment(blogId, newComment);

      if (!added?.comment) throw new Error("No comment returned");

      // Wait until full user info is available
      if (!added.comment.user?.name) {
        // Polling API until user info is populated
        let retries = 0;
        while (!added.comment.user?.name && retries < 10) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const refreshed = await getComments(blogId);
          const found = refreshed.find((c) => c._id === added.comment._id);
          if (found?.user?.name) {
            added.comment.user = found.user;
            break;
          }
          retries++;
        }
      }

      // Add comment to top
      setComments([added.comment, ...comments]);
      setNewComment("");

      // Revalidate cache
      try {
        await Promise.allSettled([
          fetch("/api/revalidate?tag=blogs", { method: "POST" }),
          fetch(`/api/revalidate?tag=blog-${blogId}`, { method: "POST" }),
        ]);
      } catch (revalidateError) {
        console.warn("Cache revalidation warning:", revalidateError);
      }

      toast.success("Comment posted successfully");
    } catch (err) {
      console.error("Error posting comment:", err);
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Comments</h1>

      {status === "authenticated" ? (
        <div className={styles.write}>
          <input
            type="text"
            className={styles.commentInput}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting}
          />
          <button
            className={styles.commentBtn}
            onClick={handleCommentSubmit}
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? "Posting..." : "Post"} <IoIosSend />
          </button>
        </div>
      ) : status === "unauthenticated" ? (
        <Link href="/login">Login to write a comment</Link>
      ) : (
        <p>Checking authentication...</p>
      )}

      <hr className={styles.hr} />

      <div className={styles.comments}>
        {loading ? (
          <p>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((c, index) => (
            <div key={c._id || index} className={styles.comment}>
              {c.user?.name ? (
                <>
                  <div className={styles.user}>
                    <div className={styles.userImage}>
                      <div
                        style={{
                          position: "relative",
                          width: "50px",
                          height: "50px",
                        }}
                      >
                        <Image
                          src={c.user.profileImageUrl || "/avater.png"}
                          alt={c.user.name}
                          fill
                          sizes="100%"
                          className={styles.image}
                        />
                      </div>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.username}>{c.user.name}</span>
                      <span className={styles.date}>
                        {new Date(c.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <p className={styles.description}>{c.text}</p>
                </>
              ) : (
                <p>Loading comment...</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
