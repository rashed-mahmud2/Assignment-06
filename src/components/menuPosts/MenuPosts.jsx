import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./menuPosts.module.css";

async function getOldestBlogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs`);
  const data = await res.json();
  return data?.data || [];
}

// Format Date → 12-hour format (e.g. Jan 3, 2025 - 4:32 PM)
function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const MenuPosts = async () => {
  const blogs = await getOldestBlogs();

  // Sort oldest first + take first 4
  const oldestBlogs = blogs
    ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    ?.slice(0, 4);

  return (
    <div className={styles.items}>
      {oldestBlogs?.map((blog) => (
        <Link key={blog._id} href={`/blog/${blog._id}`} className={styles.item}>
          <div className={styles.imageContainer}>
            <Image
              src={blog?.image}
              alt={blog?.title}
              fill
              className={styles.image}
              sizes="100%"
              priority
            />
          </div>

          <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles.travel}`}>
              {blog?.category}
            </span>

            {/* Title sliced to 50 characters */}
            <h3 className={styles.postTitle}>
              {blog?.title?.length > 50
                ? blog.title.slice(0, 50) + "..."
                : blog.title}
            </h3>

            <div className={styles.detail}>
              <span className={styles.username}>{blog?.author?.name}</span>

              {/* Formatted Date */}
              <span className={styles.date}>
                {" "}
                - {formatDate(blog?.createdAt)}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MenuPosts;
