import HomeShowcase from '@/components/HomeShowcase';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <HomeShowcase />
    </div>
  );
}
