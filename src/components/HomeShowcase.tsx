'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { homepageShowcaseSlides, HomepageSlide } from '@/data/homepageShowcase';
import styles from './HomeShowcase.module.css';

interface HomeShowcaseProps {
  slides?: HomepageSlide[];
}

/**
 * CYNX REVERSE-ENGINEERED CONSTANTS
 * MAX_SPEED = 0.22 (normalized slide index units per input step)
 * Expo.out duration = 1.05s
 * 11 cycles of items provide an infinite visual buffer for dynamic recycling
 */
const MAX_SPEED = 0.22;
const EASING_DURATION = 1.05;
const CYCLES = 11;
const BASE_CYCLE = 5; // Anchor cycle centered at middle (5 cycles left, 5 cycles right)

export default function HomeShowcase({ slides = homepageShowcaseSlides }: HomeShowcaseProps) {
  const totalSlides = slides.length;
  const baseOffsetIndex = BASE_CYCLE * totalSlides;

  // React state updates ONLY when the active slide index changes
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Continuous animation refs
  const listXTargetRef = useRef(0);
  const posRef = useRef({ listX: 0 });
  const xToRef = useRef<((value: number) => void) | null>(null);
  const activeIndexRef = useRef(0);
  const activeGlobalIndexRef = useRef(baseOffsetIndex);
  const visibleRangeRef = useRef<{ min: number; max: number } | null>(null);

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartTargetRef = useRef(0);

  // Generate 11 continuous repeating cycles of slides for infinite buffer
  const displaySlides = useMemo(() => {
    return Array.from({ length: CYCLES }, (_, cycleIdx) =>
      slides.map((slide, slideIdx) => ({
        ...slide,
        uniqueKey: `cycle-${cycleIdx}-slide-${slideIdx}-${slide.id}`,
        originalIndex: slideIdx,
        globalIndex: cycleIdx * totalSlides + slideIdx,
      }))
    ).flat();
  }, [slides, totalSlides]);

  // Main GSAP quickTo continuous engine & Cynx filmstrip geometry
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    /**
     * Cynx Filmstrip Layout Calculation:
     * - Central dominant active image (native 3:2 proportion, ~55vh height, 6 cols of 12-col grid)
     * - Narrow surrounding photographic columns (1 col of 12-col grid, identical 55vh height)
     * - Constant 24px horizontal gaps everywhere
     * - Continuous smooth cosine interpolation of widths between active and side states
     */
    const applyLayout = () => {
      const stageEl = stageRef.current;
      if (!stageEl) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportWidth / 2;
      const isMobile = viewportWidth < 768;
      const gap = isMobile ? 12 : 24;

      // 55vh on desktop, 48vh on mobile
      const stripHeight = isMobile
        ? Math.min(380, Math.max(260, viewportHeight * 0.48))
        : Math.min(560, Math.max(320, viewportHeight * 0.55));

      // Active image width: 6 columns of 12-col grid (~52% of viewport width, 3:2 landscape)
      const activeWidth = isMobile
        ? Math.min(viewportWidth * 0.78, 360)
        : Math.min(Math.min(780, stripHeight * 1.5), viewportWidth * 0.52);

      // Narrow side columns: 1 column of 12-col grid (~80-88px on desktop)
      const sideWidth = isMobile
        ? Math.max(36, Math.min(52, viewportWidth * 0.12))
        : Math.max(68, Math.min(92, (viewportWidth - 112 - 11 * gap) / 12));

      const currentL = posRef.current.listX;
      const continuousCenter = baseOffsetIndex + currentL;
      const M = Math.floor(continuousCenter);
      const lambda = continuousCenter - M;

      // Cosine smooth width interpolation based on continuous distance from active focus
      const getWidth = (e: number) => {
        const d = Math.abs(e);
        if (d >= 1) return sideWidth;
        const s = (1 + Math.cos(Math.PI * d)) / 2;
        return sideWidth + (activeWidth - sideWidth) * s;
      };

      // Compute widths and center offsets for visible window [M - 6, M + 6]
      const minK = Math.max(0, M - 6);
      const maxK = Math.min(displaySlides.length - 1, M + 6);

      const w: { [k: number]: number } = {};
      const h: { [k: number]: number } = {};

      for (let k = minK; k <= maxK; k++) {
        w[k] = getWidth(k - continuousCenter);
      }

      const pitchM = (w[M] + (w[M + 1] ?? sideWidth)) / 2 + gap;
      h[M] = -lambda * pitchM;
      if (M + 1 <= maxK) {
        h[M + 1] = (1 - lambda) * pitchM;
      }

      for (let k = M + 2; k <= maxK; k++) {
        h[k] = h[k - 1] + (w[k - 1] + w[k]) / 2 + gap;
      }
      for (let k = M - 1; k >= minK; k--) {
        h[k] = h[k + 1] - (w[k] + w[k + 1]) / 2 - gap;
      }

      // Hide slots that moved out of visible window
      const prevRange = visibleRangeRef.current;
      visibleRangeRef.current = { min: minK, max: maxK };

      if (prevRange) {
        for (let k = prevRange.min; k < minK; k++) {
          const slot = slotRefs.current[k];
          if (slot) {
            slot.style.opacity = '0';
            slot.style.pointerEvents = 'none';
          }
        }
        for (let k = maxK + 1; k <= prevRange.max; k++) {
          const slot = slotRefs.current[k];
          if (slot) {
            slot.style.opacity = '0';
            slot.style.pointerEvents = 'none';
          }
        }
      }

      // Position all active window slots
      for (let k = minK; k <= maxK; k++) {
        const slot = slotRefs.current[k];
        if (!slot) continue;

        const width = w[k];
        const left = viewportCenter + h[k] - width / 2;
        const isCenterSlot = Math.abs(k - continuousCenter) < 0.5;

        slot.style.transform = `translate3d(${left.toFixed(2)}px, 0, 0)`;
        slot.style.width = `${width.toFixed(2)}px`;
        slot.style.height = `${stripHeight.toFixed(2)}px`;
        slot.style.opacity = '1';
        slot.style.pointerEvents = 'auto';
        slot.style.zIndex = isCenterSlot ? '3' : '1';
      }
    };

    // Initialize GSAP quickTo continuous engine
    const xTo = gsap.quickTo(posRef.current, 'listX', {
      duration: EASING_DURATION,
      ease: 'expo.out',
      onUpdate: () => {
        // 1. Update Cynx filmstrip geometry
        applyLayout();

        // 2. Active slide detection & metadata synchronization
        const rawOffset = posRef.current.listX;
        const normalizedIndex = ((Math.round(rawOffset) % totalSlides) + totalSlides) % totalSlides;
        const currentGlobalIndex = baseOffsetIndex + Math.round(rawOffset);

        if (currentGlobalIndex !== activeGlobalIndexRef.current) {
          const prevSlot = slotRefs.current[activeGlobalIndexRef.current];
          const newSlot = slotRefs.current[currentGlobalIndex];
          if (prevSlot) prevSlot.classList.remove(styles.slideActive);
          if (newSlot) newSlot.classList.add(styles.slideActive);
          activeGlobalIndexRef.current = currentGlobalIndex;
        }

        if (normalizedIndex !== activeIndexRef.current) {
          activeIndexRef.current = normalizedIndex;
          setActiveSlideIndex(normalizedIndex);
        }
      },
    });

    xToRef.current = xTo;

    // Initial render layout
    applyLayout();
    const initialSlot = slotRefs.current[baseOffsetIndex];
    if (initialSlot) initialSlot.classList.add(styles.slideActive);

    const handleResize = () => {
      applyLayout();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [baseOffsetIndex, totalSlides, displaySlides.length]);

  // Continuous wheel interaction with Cynx velocity scaling
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const rawDelta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const normalizedDelta = e.deltaMode === 1 ? rawDelta * 32 : rawDelta;

      // Cynx velocity scaling: smoother resistance as target diverges
      const currentSpread = Math.abs(listXTargetRef.current - posRef.current.listX);
      const denominator = 320 + Math.min(300, currentSpread * 180);
      const step = normalizedDelta / denominator;

      // Clamp step to Cynx MAX_SPEED (0.22)
      const clampedStep = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, step));

      listXTargetRef.current += clampedStep;

      if (xToRef.current) {
        xToRef.current(listXTargetRef.current);
      }
    };

    stage.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      stage.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Pointer drag direct manipulation
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartTargetRef.current = listXTargetRef.current;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    // Drag pitch calibrated to smooth side column width + gap (~108px)
    const slideDelta = -deltaX / 108;
    listXTargetRef.current = dragStartTargetRef.current + slideDelta;

    if (xToRef.current) {
      xToRef.current(listXTargetRef.current);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Pointer might already be released
    }
  };

  // Click on any visible side column to center it smoothly
  const handleSlideClick = (globalIdx: number) => {
    listXTargetRef.current = globalIdx - baseOffsetIndex;
    if (xToRef.current) {
      xToRef.current(listXTargetRef.current);
    }
  };

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        listXTargetRef.current = Math.round(listXTargetRef.current) + 1;
        if (xToRef.current) xToRef.current(listXTargetRef.current);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        listXTargetRef.current = Math.round(listXTargetRef.current) - 1;
        if (xToRef.current) xToRef.current(listXTargetRef.current);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Active photograph metadata
  const currentSlide = slides[activeSlideIndex] ?? slides[0];

  return (
    <section
      ref={sectionRef}
      className={styles.showcaseSection}
      aria-label="Photographic Showcase"
    >
      {/* Visual Stage: Cynx continuous horizontal photographic film strip */}
      <div
        ref={stageRef}
        className={styles.stageContainer}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {displaySlides.map((item, idx) => {
          const isBaseInitialActive = idx === baseOffsetIndex;

          return (
            <div
              key={item.uniqueKey}
              ref={(el) => {
                slotRefs.current[idx] = el;
              }}
              className={`${styles.slide} ${isBaseInitialActive ? styles.slideActive : ''}`}
              onClick={() => handleSlideClick(idx)}
              aria-label={`View photograph ${item.originalIndex + 1}`}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 78vw, 780px"
                  priority={idx >= baseOffsetIndex - 1 && idx <= baseOffsetIndex + 1}
                  className={styles.image}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Editorial Details Row: Positioned cleanly below the film strip */}
      <div className={styles.infoArea}>
        <div className={styles.infoContent}>
          <div className={styles.infoLeft}>
            <span className={styles.photoTitle}>{currentSlide.title}</span>
            <span className={styles.photoMeta}>
              {currentSlide.year} — {currentSlide.location}
            </span>
          </div>
          <div className={styles.infoRight}>
            <div className={styles.counter}>
              <span>{String(activeSlideIndex + 1).padStart(2, '0')}</span>
              <span>{String(totalSlides).padStart(2, '0')}</span>
            </div>
            <div className={styles.filmIndicator} aria-hidden="true">
              <span className={styles.filmBar} />
              <span className={styles.filmBar} />
              <span className={styles.filmBar} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
