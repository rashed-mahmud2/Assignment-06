import Image from "next/image";
import styles from "./singlePage.module.css";
import Menu from "@/components/Menu/Menu";
import Comments from "@/components/comments/Comments";
import LikeComment from "@/components/likecomment/LikeComment";

export default async function SingleBlogPage({ params }) {
  const { id } = await params;

  // Server-side fetch
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${id}`, {
    next: { tags: ["posts"] },
  });

  if (!res.ok) return <h1>Blog Not Found</h1>;

  const blog = await res.json();

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{blog?.title}</h1>

          <div className={styles.user}>
            <div className={styles.userImage}>
              <div
                style={{ position: "relative", width: "50px", height: "50px" }}
              >
                <Image
                  src={blog?.author?.profileImageUrl || "/avater.png"}
                  alt={blog?.author?.name || "User"}
                  fill
                  sizes="100%"
                  className={styles.avater}
                  priority
                />
              </div>
            </div>
            <div className={styles.text}>
              <h2 className={styles.username}>
                {blog?.author?.name || "Unknown"}
              </h2>
              <p className={styles.date}>
                {new Date(blog?.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
          </div>
          <LikeComment blogId={blog._id} />
        </div>

        <div className={styles.imageContainer}>
          <div style={{ position: "relative", width: "100%", height: "400px" }}>
            <Image
              src={blog?.image || "/placeholder.jpg"}
              alt="Cover Image"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.postImage}
            />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.post}>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: blog?.content || "" }}
          />
          <Comments blogId={id} />
        </div>

        <div className={styles.menu}>
          <Menu />
        </div>
      </div>
    </div>
  );
}
