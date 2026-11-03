import Link from 'next/link';
import { siteConfig } from '@/data/siteConfig';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Left section: Identity, Copyright & Social */}
        <div className={styles.leftSection}>
          <div className={styles.brandGroup}>
            <Link
              href="/"
              className={styles.brandName}
              aria-label={`${siteConfig.name} — Home`}
            >
              {siteConfig.name.toUpperCase()}
            </Link>
          </div>

          <div className={styles.metaGroup}>
            <p className={styles.copyright}>
              © {currentYear} {siteConfig.name}. All rights reserved.
            </p>

            <div className={styles.socialGroup}>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.iconLink}
                aria-label={`${siteConfig.name} on Instagram`}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2" />
                </svg>
              </a>

              <a
                href={`mailto:${siteConfig.social.email}`}
                className={styles.iconLink}
                aria-label={`Email ${siteConfig.name}`}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Right section: Two clean navigation columns */}
        <div className={styles.rightSection}>
          <div className={styles.navColumn}>
            <span className={styles.columnHeading}>Explore</span>
            <ul className={styles.navList}>
              <li>
                <Link href="/" className={styles.navLink}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/work/projects" className={styles.navLink}>
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/work/portraits" className={styles.navLink}>
                  Portraits
                </Link>
              </li>
              <li>
                <Link href="/work/stills" className={styles.navLink}>
                  Stills
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.navColumn}>
            <span className={styles.columnHeading}>Information</span>
            <ul className={styles.navList}>
              <li>
                <Link href="/about" className={styles.navLink}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className={styles.navLink}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
