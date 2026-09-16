import MasonryPortfolio from '@/components/MasonryPortfolio';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <MasonryPortfolio />
    </div>
  );
}

