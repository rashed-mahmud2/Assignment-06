import styles from "./cardList.module.css";
import Pagination from "../pagination/Pagination";
import Card from "../card/Card";

async function getBlogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs`, {
    next: { tags: ["posts"] },
  });
  const data = await res.json();
  return data?.data || [];
}

export default async function CardList() {
  const blogs = await getBlogs();

  if (blogs.length === 0) return <p>No posts found</p>;

  // Sort by createdAt (original post order)
  const sortedBlogs = blogs.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const otherPosts = sortedBlogs.slice(1, 5); // skip latest post for feature

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recent Posts</h1>

      <div className={styles.posts}>
        {otherPosts.map((item) => (
          <div key={item._id}>
            <Card blogId={item._id} />
            <hr className={styles.hrline} />
          </div>
        ))}
      </div>

      <Pagination />
    </div>
  );
}
