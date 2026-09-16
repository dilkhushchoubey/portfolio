'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { masonryPortfolioItems, MasonryItem } from '@/data/masonryPortfolio';
import styles from './MasonryPortfolio.module.css';

type CategoryFilter = 'all' | 'landscape' | 'portraits' | 'architecture' | 'documentary';

interface GridPositionedItem extends MasonryItem {
  x: number;
  y: number;
  w: number;
  h: number;
}

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'landscape', label: 'Landscape' },
  { id: 'portraits', label: 'Portraits' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'documentary', label: 'Documentary' },
];

export default function MasonryPortfolio() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [items, setItems] = useState<MasonryItem[]>(masonryPortfolioItems);
  const [columns, setColumns] = useState<number>(4);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const hasMountedRef = useRef<boolean>(false);
  const isAnimatingRef = useRef<boolean>(false);

  // Determine responsive column count
  const getColumnCount = useCallback((width: number): number => {
    if (width >= 1024) return 4;
    if (width >= 680) return 3;
    if (width >= 480) return 2;
    return 1;
  }, []);

  // Filter items when category changes
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  // Calculate masonry grid coordinates using greedy column height binning
  const { gridItems, totalHeight } = useMemo(() => {
    if (!containerWidth || columns <= 0) {
      return { gridItems: [] as GridPositionedItem[], totalHeight: 800 };
    }

    const colHeights = new Array(columns).fill(0);
    const colWidth = containerWidth / columns;

    const grid = filteredItems.map((item) => {
      // Find shortest column
      let minCol = 0;
      for (let i = 1; i < columns; i++) {
        if (colHeights[i] < colHeights[minCol]) {
          minCol = i;
        }
      }

      const x = minCol * colWidth;
      const y = colHeights[minCol];
      colHeights[minCol] += item.height;

      return {
        ...item,
        x,
        y,
        w: colWidth,
        h: item.height,
      };
    });

    const maxColHeight = Math.max(...colHeights, 0);
    return { gridItems: grid, totalHeight: maxColHeight };
  }, [filteredItems, containerWidth, columns]);

  // ResizeObserver for responsive width detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      const width = container.clientWidth;
      if (width > 0) {
        setContainerWidth(width);
        setColumns(getColumnCount(width));
      }
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [getColumnCount]);

  // GSAP animation on layout change or re-shuffle
  useEffect(() => {
    if (gridItems.length === 0) return;

    const isInitial = !hasMountedRef.current;

    gridItems.forEach((item, index) => {
      const el = itemRefs.current.get(item.id);
      if (!el) return;

      if (isInitial) {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            x: item.x,
            y: item.y + 80,
            filter: 'blur(10px)',
          },
          {
            opacity: 1,
            x: item.x,
            y: item.y,
            filter: 'blur(0px)',
            duration: 0.75,
            ease: 'power3.out',
            delay: Math.min(index * 0.05, 0.4),
          }
        );
      } else {
        gsap.to(el, {
          x: item.x,
          y: item.y,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.6,
          ease: 'power3.out',
        });
      }
    });

    if (isInitial) {
      hasMountedRef.current = true;
    }
  }, [gridItems]);

  // Handle re-shuffle with smooth GSAP glide
  const handleShuffle = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    // Fisher-Yates shuffle
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setItems(shuffled);

    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 650);
  };

  // Handle category filter
  const handleCategoryChange = (category: CategoryFilter) => {
    setSelectedCategory(category);
  };

  return (
    <div className={styles.container}>
      {/* Controls & Filter Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`${styles.filterChip} ${
                selectedCategory === cat.id ? styles.filterChipActive : ''
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className={styles.actionGroup}>
          <button
            onClick={handleShuffle}
            className={styles.shuffleBtn}
            aria-label="Re-shuffle masonry grid"
          >
            <svg
              className={styles.shuffleIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Re-shuffle</span>
          </button>
        </div>
      </div>

      {/* React Bits Masonry Gallery Container */}
      <div
        ref={containerRef}
        className={styles.masonryList}
        style={{ height: totalHeight > 0 ? `${totalHeight + 32}px` : '800px' }}
      >
        {gridItems.map((item) => (
          <div
            key={item.id}
            ref={(el) => {
              if (el) itemRefs.current.set(item.id, el);
              else itemRefs.current.delete(item.id);
            }}
            className={styles.itemWrapper}
            style={{
              width: `${item.w}px`,
              height: `${item.h}px`,
              transform: `translate(${item.x}px, ${item.y}px)`,
            }}
          >
            <div className={styles.itemInner}>
              <Image
                src={item.img}
                alt={item.title}
                fill
                sizes="(max-width: 680px) 100vw, (max-width: 1024px) 33vw, 25vw"
                className={styles.itemImage}
                priority={parseInt(item.id, 10) <= 4}
              />
              <div className={styles.overlayInfo}>
                <span className={styles.categoryBadge}>{item.category}</span>
                <h4 className={styles.cardTitle}>{item.title}</h4>
                <p className={styles.cardLocation}>{item.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Tri-Column Highlight Section */}
      <section className={styles.highlightsSection}>
        <div className={styles.highlightsContainer}>
          <div className={styles.highlightCard}>
            <span className={styles.highlightTag}>01 / Curated Medium</span>
            <h3 className={styles.highlightTitle}>Medium Format &amp; 35mm Film</h3>
            <p className={styles.highlightText}>
              Every visual piece is scanned at ultra-high resolution with silver halide tonal preservation.
            </p>
          </div>
          <div className={styles.highlightCard}>
            <span className={styles.highlightTag}>02 / Limited Editions</span>
            <h3 className={styles.highlightTitle}>Hahnemühle Photo Rag Prints</h3>
            <p className={styles.highlightText}>
              Numbered museum-grade pigment prints accompanied by embossed certificates of authenticity.
            </p>
          </div>
          <div className={styles.highlightCard}>
            <span className={styles.highlightTag}>03 / Studio &amp; Inquiries</span>
            <h3 className={styles.highlightTitle}>Commission &amp; Licensing</h3>
            <p className={styles.highlightText}>
              Available for editorial assignments, architectural documentation, and private acquisitions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
