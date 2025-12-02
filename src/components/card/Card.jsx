import React from "react";
import styles from "./card.module.css";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import LikeComment from "../likecomment/LikeComment";

const Card = async ({ blogId }) => {
  // Server component: fetch blog data
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${blogId}`,
    {
      next: { tags: ["posts"] },
    }
  );
  const blog = await res.json();

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src={blog.image || "/p1.jpeg"}
          alt={blog.title || "Blog Image"}
          fill
          sizes="100%"
          className={styles.image}
        />
      </div>

      <div className={styles.textContainer}>
        <div className={styles.detail}>
          <span className={styles.date}>
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>{" "}
          -{" "}
          <span className={styles.category}>
            {blog.category || "UNCATEGORIZED"}
          </span>
        </div>

        <Link href={`/blog/${blog._id}`}>
          <h2 className={styles.postTitle}>
            {blog.title.length > 60
              ? blog.title.slice(0, 60) + "..."
              : blog.title}
          </h2>
        </Link>

        <p className={styles.postDescription}>
          {blog.content.length > 160
            ? blog.content.slice(0, 160) + "..."
            : blog.content}
        </p>
        <p>By {blog.author?.name || "Unknown Author"}</p>
        {/* Client-side component */}
        <LikeComment blogId={blog._id} />

        <Link className={styles.btn} href={`/blog/${blog._id}`}>
          Read more <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default Card;
