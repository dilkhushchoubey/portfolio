import { siteConfig } from '@/data/siteConfig';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.identity}>
          <span className={styles.name}>{siteConfig.name}</span>
          <span className={styles.copy}>
            © {currentYear} · Photography Archive · All Rights Reserved
          </span>
        </div>

        <div className={styles.links}>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            aria-label="Dilkhush Choubey on Instagram"
          >
            Instagram ({siteConfig.social.instagramHandle})
          </a>
          <a
            href={`mailto:${siteConfig.social.email}`}
            className={styles.link}
            aria-label="Email Dilkhush Choubey"
          >
            {siteConfig.social.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
