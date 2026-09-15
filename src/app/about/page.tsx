import type { Metadata } from 'next';
import Image from 'next/image';
import { siteConfig } from '@/data/siteConfig';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About',
  description: `About ${siteConfig.name}, photographer based in ${siteConfig.location}.`,
};

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>About</h1>
        <span className="meta-stamp">Biographical Statement</span>
      </header>

      <div className={styles.layout}>
        <div className={styles.portraitWrapper}>
          <div className={styles.portraitFrame}>
            <Image
              src="/images/dilkhush-choubey/portrait.svg"
              alt={`Portrait of ${siteConfig.name}`}
              width={1200}
              height={1500}
              priority
              className={styles.portraitImage}
            />
          </div>
          <p className={styles.portraitCaption}>
            {siteConfig.name} · {siteConfig.location}
          </p>
        </div>

        <section className={styles.biography}>
          <p className={styles.leadBio}>{siteConfig.shortBio}</p>

          {siteConfig.statement.map((paragraph, index) => (
            <p key={index} className={styles.bioPara}>
              {paragraph}
            </p>
          ))}

          <div className={styles.divider} />

          <div className={styles.approachSection}>
            <h2 className={styles.sectionHeading}>Inquiries &amp; Structure</h2>
            <p className={styles.bioPara}>
              The work is structured around self-directed projects and concentrated visual suites,
              giving precedence to duration and geographical specificity over single-image captures.
              Current major bodies of work encompass the clay idol artisans of northern Kolkata
              (Kumartuli) and ceremonial spectacle in Rajasthan.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
