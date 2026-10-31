'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { MasonryItem } from '@/data/masonryPortfolio';
import { masonryPortfolioItems } from "@/data/masonryPortfolioItems";
import styles from './MasonryPortfolio.module.css';

export default function MasonryPortfolio({ items }: { items?: MasonryItem[] } = {}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const displayItems = items && items.length > 0 ? items : masonryPortfolioItems;

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    // Respect reduced motion preferences
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(grid.children, { opacity: 1, y: 0, filter: 'none' });
      return;
    }

    gsap.fromTo(
      grid.children,
      {
        opacity: 0,
        y: 28,
        filter: 'blur(6px)',
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.7,
        stagger: 0.04,
        ease: 'power3.out',
      }
    );
  }, []);

  return (
    <div className={styles.container}>
      <div ref={gridRef} className={styles.bentoGrid}>
        {displayItems.map((item, index) => {
          // Determine slot role for the deterministic desktop layout:
          // Row 1: L (0), P (1), P (2)
          // Row 2: P (3), P (4), L (5)
          // Row 3: L (6), P (7), P (8)
          // Row 4: P (9), P (10), L (11)
          const slotInCycle = index % 6;
          const isLandscape = slotInCycle === 0 || slotInCycle === 5;
          const slotClass = styles[`slot_${index + 1}`] || '';

          return (
            <div
              key={item.id}
              className={`${styles.itemWrapper} ${slotClass} ${isLandscape ? styles.cardLandscape : styles.cardPortrait
                }`}
              data-slot={isLandscape ? 'landscape' : 'portrait'}
            >
              <div className={styles.itemInner}>
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, (max-width: 1360px) 50vw, 680px"
                  className={styles.itemImage}
                  priority={index < 3}
                />
                <div className={styles.overlayInfo}>
                  <span className={styles.categoryBadge}>{item.category}</span>
                  <h4 className={styles.cardTitle}>{item.title}</h4>
                  <p className={styles.cardLocation}>{item.location}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
