import type { Metadata } from 'next';
import { siteConfig } from '@/data/siteConfig';
import ContactForm from '@/components/ContactForm';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${siteConfig.name} for editorial assignments, collaborations and other photographic enquiries.`,
};

export default function ContactPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Get in Touch</h1>
        <p className={styles.description}>
          For editorial assignments, collaborations and other photographic enquiries.
        </p>
      </header>

      <ContactForm />
    </div>
  );
}
