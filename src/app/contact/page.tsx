import type { Metadata } from 'next';
import { siteConfig } from '@/data/siteConfig';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Contact ${siteConfig.name}, photographer based in ${siteConfig.location}.`,
};

export default function ContactPage() {
  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Contact</h1>
        <span className="meta-stamp">Inquiries &amp; Correspondence</span>
      </header>

      <div className={styles.content}>
        <p className={styles.statement}>
          For editorial assignments, print inquiries for cultural archives, and photographic dialogue.
        </p>

        <div className={styles.contactList}>
          <div className={styles.contactItem}>
            <span className={styles.label}>Electronic Mail</span>
            <a href={`mailto:${siteConfig.social.email}`} className={styles.valueLink}>
              {siteConfig.social.email}
            </a>
          </div>

          <div className={styles.contactItem}>
            <span className={styles.label}>Instagram</span>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.valueLink}
            >
              {siteConfig.social.instagramHandle}
            </a>
          </div>

          <div className={styles.contactItem}>
            <span className={styles.label}>Location</span>
            <p className={styles.locationNote}>{siteConfig.location} — Available for assignments worldwide</p>
          </div>
        </div>
      </div>
    </div>
  );
}
