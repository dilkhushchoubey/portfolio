import MasonryPortfolio from '@/components/MasonryPortfolio';
import { getFreshHomepagePortfolioItems } from '@/lib/homepagePortfolio';
import styles from './page.module.css';

export default function HomePage() {
  const items = getFreshHomepagePortfolioItems();

  return (
    <div className={styles.container}>
      <MasonryPortfolio items={items} />
    </div>
  );
}

