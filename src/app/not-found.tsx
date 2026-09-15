import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <p className={styles.code}>404 — Plate Not Found</p>
      <h1 className={styles.title}>The requested photograph or page does not exist.</h1>
      <p className={styles.message}>
        The project or plate you were looking for may have been archived or moved.
      </p>
      <Link href="/work" className={styles.link}>
        &larr; Return to Work Index
      </Link>
    </div>
  );
}
