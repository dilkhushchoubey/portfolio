'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/data/siteConfig';
import styles from './Navigation.module.css';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label={`${siteConfig.name} - Home`}>
          <span className={styles.brandName}>{siteConfig.name}</span>
          {/* <span className={styles.brandMeta}>
            {siteConfig.profession} · {siteConfig.location}
          </span> */}
        </Link>

        <nav className={styles.nav} aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive =
              item.href === '/work'
                ? pathname.startsWith('/work')
                : pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
