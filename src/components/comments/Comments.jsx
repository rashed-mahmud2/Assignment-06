"use client";

import Link from "next/link";
import Image from "next/image";
import { IoIosSend } from "react-icons/io";
import { useEffect, useState } from "react";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "@/lib/api";
import { toast } from "sonner";
import styles from "./comments.module.css";

const Comments = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [status, setStatus] = useState("loading"); // loading, authenticated, unauthenticated
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // Check login
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

  // Submit new comment
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const added = await createComment(blogId, newComment);
      if (!added?.comment) throw new Error("No comment returned");
      setComments([added.comment, ...comments]);
      setNewComment("");
      toast.success("Comment posted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  // Start editing
  const startEdit = (c) => {
    setEditingId(c._id);
    setEditText(c.text);
  };

  // Submit edited comment
  const handleEditSubmit = async (commentId) => {
    if (!editText.trim()) return;
    setSubmitting(true);
    try {
      const updated = await updateComment(blogId, commentId, editText);
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? updated.comment : c))
      );
      setEditingId(null);
      toast.success("Comment updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update comment");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete comment
  const handleDelete = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteComment(blogId, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete comment");
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
          comments.map((c) => (
            <div key={c._id} className={styles.comment}>
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

                  {/* Edit/Delete buttons only for comment owner */}
                  {c.user._id === userId && (
                    <div className={styles.actions}>
                      {editingId === c._id ? (
                        <>
                          <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            disabled={submitting}
                          />
                          <button
                            onClick={() => handleEditSubmit(c._id)}
                            disabled={submitting || !editText.trim()}
                          >
                            Save
                          </button>
                          <button onClick={() => setEditingId(null)}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(c)}>Edit</button>
                          <button onClick={() => handleDelete(c._id)}>
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {editingId !== c._id && (
                    <p className={styles.description}>{c.text}</p>
                  )}
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
