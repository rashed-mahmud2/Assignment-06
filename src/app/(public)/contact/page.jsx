import styles from "./contactPage.module.css";

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1>Contact Us</h1>
          <p>
            Get in touch with our team. We&apos;re here to help with any
            questions about our podcasts and services.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Left Column */}
          <div className={styles.leftCol}>
            <section className={styles.card}>
              <h2>Contact Information</h2>

              <div className={styles.infoSection}>
                <h3>General Inquiries</h3>
                <p>
                  <Mail /> contact@air-podcasts.com
                </p>
                <p>
                  <Phone /> +1 (123) 456-7890
                </p>
              </div>

              <div className={styles.infoSection}>
                <h3>Technical Support</h3>
                <p>
                  <Mail /> support@air-podcasts.com
                </p>
                <p>
                  <Phone /> +1 (987) 654-3210
                </p>
              </div>

              <div className={styles.infoSection}>
                <h3>Our Office</h3>
                <p>
                  <MapPin /> 122 Al Tech Avenue, Technik, 54321
                </p>
                <p>Old Streetons</p>
              </div>
            </section>

            <section className={styles.card}>
              <h2>Frequently Asked Questions</h2>

              <div>
                <h4>What is AI?</h4>
                <p>
                  AI stands for Artificial Intelligence, which refers to the
                  simulation of human intelligence in machines. It enables them
                  to perform tasks like problem-solving, learning, and
                  decision-making.
                </p>
              </div>

              <div>
                <h4>Podcast Questions:</h4>
                <ul>
                  <li>How can I listen to your podcasts?</li>
                  <li>Are your podcasts free to listen to?</li>
                  <li>Can I download episodes to listen offline?</li>
                  <li>How often do you release new episodes?</li>
                </ul>
              </div>

              <button className={styles.outlineBtn}>Ask Question</button>
            </section>
          </div>

          {/* Right Column */}
          <div className={styles.rightCol}>
            <section className={styles.card}>
              <h2>Send us a Message</h2>
              <p>
                Fill out the form below and we&apos;ll get back to you as soon
                as possible.
              </p>

              <form className={styles.form}>
                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="firstName">First Name</label>
                    <input id="firstName" placeholder="Enter First Name" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="lastName">Last Name</label>
                    <input id="lastName" placeholder="Enter Last Name" />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your Email"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="phone">Phone Number</label>
                    <input id="phone" placeholder="Enter Phone Number" />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    placeholder="Enter your Message"
                    rows="5"
                  ></textarea>
                </div>

                <div className={styles.checkboxGroup}>
                  <input type="checkbox" id="terms" />
                  <label htmlFor="terms">
                    I agree with Terms of Use and Privacy Policy
                  </label>
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Send Message
                </button>
              </form>
            </section>

            <section className={`${styles.card} ${styles.gradientCard}`}>
              <h2>Learn, Connect, and Innovate!</h2>
              <p>Be Part of the Future Tech Revolution</p>
              <p>
                Immerse yourself in the world of future technology. Explore our
                comprehensive resources, connect with fellow tech enthusiasts,
                and drive innovation in the industry.
              </p>
              <button className={styles.secondaryBtn}>Join Community</button>
            </section>

            <div className={styles.resourceGrid}>
              <div className={styles.card}>
                <h3>Resource Access</h3>
                <p>
                  Access a wide range of resources, including boards,
                  whitepapers, and reports.
                </p>
              </div>

              <div className={styles.card}>
                <h3>Community Forum</h3>
                <p>
                  Discuss industry trends, share insights, and collaborate with
                  peers.
                </p>
              </div>

              <div className={styles.card}>
                <h3>Tech Events</h3>
                <p>
                  Stay updated on upcoming tech events, webinars, and
                  conferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
function Mail() {
  return <span>📧</span>;
}
function Phone() {
  return <span>📞</span>;
}
function MapPin() {
  return <span>📍</span>;
}
