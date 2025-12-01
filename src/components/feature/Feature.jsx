import styles from "./feature.module.css";
import Image from "next/image";
import LikeComment from "../likecomment/LikeComment";
import Link from "next/link";

export default async function Feature() {
  // Fetch blogs on server
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs`, {
    next: { tags: ["posts"] },
  });

  const data = await res.json();
  const blogs = data?.data || [];

  if (blogs.length === 0) return <p>No posts found</p>;

  // Sort by creation time (oldest → newest)
  const sorted = blogs.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  // Latest blog (newest)
  const latestPost = sorted[sorted.length - 1];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <strong className={styles.bold}>Hey! Rashed Mahmud here!</strong> <br />
        Discover my stories and creative ideas.
      </h1>

      <div className={styles.post}>
        <div className={styles.imageContainer}>
          <Image
            className={styles.image}
            src={latestPost.image || "/p1.jpeg"}
            alt={latestPost.title}
            fill
            sizes="100%"
            priority
          />
        </div>

        <div className={styles.textContainer}>
          <div className={styles.detail}>
            <span className={styles.date}>
              {new Date(latestPost.createdAt).toLocaleDateString()}
            </span>{" "}
            -{" "}
            <span className={styles.category}>
              {latestPost.category || "UNCATEGORIZED"}
            </span>
          </div>

          <Link href={`/blog/${latestPost._id}`}>
            <h2 className={styles.postTitle}>
              {latestPost.title.length > 60
                ? latestPost.title.slice(0, 60) + "..."
                : latestPost.title}
            </h2>
          </Link>

          <p className={styles.postDescription}>
            {latestPost.content.length > 160
              ? latestPost.content.slice(0, 160) + "..."
              : latestPost.content}
          </p>
          <p>By {latestPost.author?.name || "Unknown Author"}</p>

          {/* This is fine: LikeComment is a client component */}
          <LikeComment blogId={latestPost._id} />

          <button className={styles.heroBtn}>
            <Link href={`/blog/${latestPost._id}`}>Read More</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
