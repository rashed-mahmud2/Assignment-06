import styles from "./blogPage.module.css";
import Menu from "@/components/Menu/Menu";
import Card from "@/components/card/Card";

export default async function BlogPage({ searchParams }) {
  const params = await searchParams;
  const category = params?.cat || "";

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs`, {
      next: { tags: ["posts"] },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch blogs: ${res.status}`);
    }

    const data = await res.json();
    let posts = data?.data || [];

    // Filter by category if provided
    if (category) {
      posts = posts.filter((post) => post.category === category);
    }

    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

   
    let displayPosts = posts;

    return (
      <div className={styles.container}>
        <div className={styles.videoContainer}>
          <video
            className={styles.video}
            src="/travel.mp4"
            width="400"
            autoPlay
            muted
            loop
            playsInline
          />
          <video
            className={styles.video}
            src="/coding.mp4"
            width="400"
            autoPlay
            muted
            loop
            playsInline
          />
          <video
            className={styles.video}
            src="/nature.mp4"
            width="400"
            poster="/thumbnail.jpg"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        <h1 className={styles.title}>
          {category ? `${category} Blogs` : "All Blogs"}
        </h1>

        <div className={styles.content}>
          <div className={styles.posts}>
            {displayPosts.length > 0 ? (
              displayPosts.map((blog) => (
                <div key={blog._id}>
                  <Card blogId={blog._id} />
                  <hr className={styles.hrline} />
                </div>
              ))
            ) : (
              <p className={styles.noPosts}>No posts found</p>
            )}
          </div>
        </div>

        <hr className={styles.hr} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h1>Error Loading Blogs</h1>
          <p>Failed to load blog posts. Please try again later.</p>
        </div>
      </div>
    );
  }
}
