// app/about/page.jsx
import styles from "./about.module.css";

export const metadata = {
  title: "About Our Blog Platform",
};

export default function AboutPage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>About Our Blog Platform</h1>
          <p className={styles.heroText}>
            A modern, interactive blogging platform where creativity meets
            community. Share your stories, engage with readers, and build your
            audience.
          </p>
          <div className={styles.heroButtons}>
            <a
              href="/community"
              className={`${styles.btn} ${styles.secondaryBtn}`}
            >
              Join Community
            </a>
            <a href="/write" className={`${styles.btn} ${styles.outlineBtn}`}>
              Start Writing
            </a>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <StatBox value="10K+" label="Active Writers" color="#2563eb" />
          <StatBox value="50K+" label="Published Posts" color="#16a34a" />
          <StatBox value="1M+" label="Monthly Readers" color="#9333ea" />
          <StatBox value="500K+" label="Community Comments" color="#ea580c" />
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Platform Features</h2>

        <div className={styles.tabWrapper}>
          <FeatureTab
            title="For Writers"
            features={[
              {
                icon: <EditIcon />,
                title: "Easy Publishing",
                text: "Create and publish beautiful blog posts with our intuitive editor.",
              },
              {
                icon: <AnalyticsIcon />,
                title: "Post Analytics",
                text: "Track post performance with detailed analytics.",
              },
              {
                icon: <CommunityIcon />,
                title: "Community Building",
                text: "Build your reader community and grow your presence.",
              },
            ]}
          />
          <FeatureTab
            title="For Readers"
            features={[
              {
                icon: <BookmarkIcon />,
                title: "Personalized Feed",
                text: "Discover content tailored to your interests.",
              },
              {
                icon: <InteractionIcon />,
                title: "Interactive Features",
                text: "Engage with content through likes, comments, and shares.",
              },
              {
                icon: <NotificationIcon />,
                title: "Notifications",
                text: "Stay updated with new posts and responses.",
              },
            ]}
          />
          <FeatureTab
            title="For Admins"
            features={[
              {
                icon: <ModerationIcon />,
                title: "Content Moderation",
                text: "Advanced moderation tools for posts and comments.",
              },
              {
                icon: <AnalyticsIcon />,
                title: "Platform Analytics",
                text: "Comprehensive dashboard with growth insights.",
              },
              {
                icon: <SettingsIcon />,
                title: "User Management",
                text: "Manage roles, permissions, and user reports.",
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}

/* Small Reusable Components */
function StatBox({ value, label, color }) {
  return (
    <div className={styles.statBox}>
      <div style={{ color }} className={styles.statValue}>
        {value}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function FeatureTab({ title, features }) {
  return (
    <div className={styles.featureTab}>
      <h3 className={styles.tabTitle}>{title}</h3>
      <div className={styles.cardGrid}>
        {features.map((f, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.featureTitle}>
              {f.icon}
              {f.title}
            </div>
            <p>{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* SVG ICONS */
function EditIcon() {
  return (
    <svg
      className={styles.icon}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M17.586 3.586a2 2 0 112.828 2.828L11 15H9v-2l8.586-9.414z"
      />
    </svg>
  );
}
function AnalyticsIcon() {
  return (
    <svg
      className={styles.icon}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5v8h2zm4 0V9h2v10h-2zm4 0V5h2v14h-2z"
      />
    </svg>
  );
}
function CommunityIcon() {
  return (
    <svg
      className={styles.icon}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}
function BookmarkIcon() {
  return (
    <svg
      className={styles.icon}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      />
    </svg>
  );
}
function InteractionIcon() {
  return (
    <svg
      className={styles.icon}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 10h5l-3.5 7H10l-3-6H5"
      />
    </svg>
  );
}
function NotificationIcon() {
  return (
    <svg
      className={styles.icon}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-5 5v-5zM8.5 14.5a2.5 2.5 0 010-5"
      />
    </svg>
  );
}
function ModerationIcon() {
  return (
    <svg
      className={styles.icon}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4"
      />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg
      className={styles.icon}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8a4 4 0 100 8 4 4 0 000-8z"
      />
    </svg>
  );
}
