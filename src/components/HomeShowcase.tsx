'use client';

import { useState, useRef, useEffect, useMemo, useCallback, Fragment } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { homepageShowcaseSlides, HomepageSlide } from '@/data/homepageShowcase';
import styles from './HomeShowcase.module.css';

interface HomeShowcaseProps {
  slides?: HomepageSlide[];
}

/**
 * CYNX REPEATED FILMSTRIP & MARBLE MOTIF ARCHITECTURE
 * Sequence: [STRIPE 1] [STRIPE 2] [STRIPE 3] [LARGE PHOTO] [STRIPE 1] [STRIPE 2] [STRIPE 3] [NEXT PHOTO] ...
 * Large photos: 6 curated plates from public/homepage/
 * Stripes: 3 dark marbled fluid ink textures from public/homepage/stripes/
 * Movement: Continuous horizontal momentum driven by gsap.quickTo
 */
const MAX_SPEED = 0.22;
const EASING_DURATION = 1.05;
const CYCLES = 7;
const BASE_CYCLE = 3; // Center cycle anchor (3 cycles to left, 3 to right)

const STRIPES = [
  { id: 's1', src: '/homepage/stripes/stripe-01.jpg' },
  { id: 's2', src: '/homepage/stripes/stripe-02.jpg' },
  { id: 's3', src: '/homepage/stripes/stripe-03.jpg' },
];

export default function HomeShowcase({ slides = homepageShowcaseSlides }: HomeShowcaseProps) {
  const totalPhotos = slides.length;
  const baseGroupIndex = BASE_CYCLE * totalPhotos;

  // React state updates ONLY when the active large photo index changes
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Continuous animation refs
  const listXTargetRef = useRef(0);
  const posRef = useRef({ listX: 0 });
  const xToRef = useRef<((value: number) => void) | null>(null);
  const activeIndexRef = useRef(0);
  const activeGlobalGroupRef = useRef(baseGroupIndex);
  const basePhotoCenterRef = useRef(0);
  const photoPitchRef = useRef(0);

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartTargetRef = useRef(0);

  // Generate 7 repeating cycles of (1 Photo + 3 Stripes) groups
  const displayGroups = useMemo(() => {
    return Array.from({ length: CYCLES }, (_, cycleIdx) =>
      slides.map((slide, slideIdx) => ({
        photo: slide,
        originalIndex: slideIdx,
        globalGroupIndex: cycleIdx * totalPhotos + slideIdx,
        uniqueKey: `cycle-${cycleIdx}-photo-${slideIdx}-${slide.id}`,
      }))
    ).flat();
  }, [slides, totalPhotos]);

  // Measure rendered geometry directly from the DOM
  const updateMeasurements = useCallback(() => {
    const basePhoto = photoRefs.current[baseGroupIndex];
    const nextPhoto = photoRefs.current[baseGroupIndex + 1];
    if (!basePhoto) return;

    basePhotoCenterRef.current = basePhoto.offsetLeft + basePhoto.offsetWidth / 2;

    if (nextPhoto) {
      photoPitchRef.current = nextPhoto.offsetLeft - basePhoto.offsetLeft;
    } else {
      // Fallback calculation: photo width + 3 stripes + 4 gaps (gap = 24px)
      const gap = window.innerWidth < 768 ? 12 : 24;
      photoPitchRef.current = basePhoto.offsetWidth + 3 * 88 + 4 * gap;
    }
  }, [baseGroupIndex]);

  // Apply continuous hardware-accelerated translation
  const applyTransform = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const viewportCenter = window.innerWidth / 2;
    const baseCenter = basePhotoCenterRef.current;
    const pitch = photoPitchRef.current;
    const currentL = posRef.current.listX;

    // Translate track so that the active large photo aligns with sub-pixel precision at viewport center
    const trackX = viewportCenter - (baseCenter + currentL * pitch);
    gsap.set(track, { x: trackX, force3D: true });
  }, []);

  // Main GSAP quickTo continuous engine
  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    updateMeasurements();
    applyTransform();

    const xTo = gsap.quickTo(posRef.current, 'listX', {
      duration: EASING_DURATION,
      ease: 'expo.out',
      onUpdate: () => {
        // 1. Continuous GPU track translation
        applyTransform();

        // 2. Active large photo detection
        const rawOffset = posRef.current.listX;
        const normalizedIndex = ((Math.round(rawOffset) % totalPhotos) + totalPhotos) % totalPhotos;
        const currentGlobalGroup = baseGroupIndex + Math.round(rawOffset);

        if (currentGlobalGroup !== activeGlobalGroupRef.current) {
          const prevEl = photoRefs.current[activeGlobalGroupRef.current];
          const nextEl = photoRefs.current[currentGlobalGroup];
          if (prevEl) prevEl.classList.remove(styles.photoActive);
          if (nextEl) nextEl.classList.add(styles.photoActive);
          activeGlobalGroupRef.current = currentGlobalGroup;
        }

        if (normalizedIndex !== activeIndexRef.current) {
          activeIndexRef.current = normalizedIndex;
          setActivePhotoIndex(normalizedIndex);
        }
      },
    });

    xToRef.current = xTo;

    // Initial class sync
    const initialPhoto = photoRefs.current[baseGroupIndex];
    if (initialPhoto) initialPhoto.classList.add(styles.photoActive);

    const handleResize = () => {
      updateMeasurements();
      applyTransform();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [baseGroupIndex, totalPhotos, updateMeasurements, applyTransform]);

  // Continuous wheel interaction with Cynx velocity scaling (only over hero stage)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const rawDelta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const normalizedDelta = e.deltaMode === 1 ? rawDelta * 32 : rawDelta;

      // Cynx velocity scaling: smoother resistance as target diverges
      const currentSpread = Math.abs(listXTargetRef.current - posRef.current.listX);
      const denominator = 360 + Math.min(300, currentSpread * 180);
      const step = normalizedDelta / denominator;

      // Clamp step to Cynx MAX_SPEED
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

  // Pointer drag manipulation
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
    const pitch = photoPitchRef.current || 1000;
    const slideDelta = -deltaX / pitch;
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

  // Click on any large photograph to center it smoothly
  const handlePhotoClick = (globalGroupIdx: number) => {
    listXTargetRef.current = globalGroupIdx - baseGroupIndex;
    if (xToRef.current) {
      xToRef.current(listXTargetRef.current);
    }
  };

  // Keyboard navigation
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
  const currentPhoto = slides[activePhotoIndex] ?? slides[0];

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
        <div ref={trackRef} className={styles.track}>
          {displayGroups.map((group, groupIdx) => {
            const isBaseInitialActive = groupIdx === baseGroupIndex;

            return (
              <Fragment key={group.uniqueKey}>
                {/* 1. Large Editorial Photograph */}
                <div
                  ref={(el) => {
                    photoRefs.current[groupIdx] = el;
                  }}
                  className={`${styles.photoCard} ${isBaseInitialActive ? styles.photoActive : ''}`}
                  style={{
                    width: 'clamp(420px, calc(55vh * 1.5), 780px)',
                    height: 'clamp(320px, 55vh, 560px)',
                  }}
                  onClick={() => handlePhotoClick(groupIdx)}
                  aria-label={`View photograph: ${group.photo.title}`}
                >
                  <div className={styles.imageFrame}>
                    <Image
                      src={group.photo.src}
                      alt={group.photo.alt}
                      fill
                      sizes="(max-width: 768px) 78vw, 780px"
                      priority={groupIdx >= baseGroupIndex - 1 && groupIdx <= baseGroupIndex + 1}
                      className={styles.photoImage}
                    />
                  </div>
                </div>

                {/* 2. Three Dark Marbled Vertical Stripes Separator Motif */}
                {STRIPES.map((stripe, sIdx) => (
                  <div
                    key={`${group.uniqueKey}-stripe-${sIdx}`}
                    className={styles.stripeCard}
                    style={{
                      width: 'clamp(64px, 5.8vw, 88px)',
                      height: 'clamp(320px, 55vh, 560px)',
                    }}
                    aria-hidden="true"
                  >
                    <div className={styles.stripeFrame}>
                      <Image
                        src={stripe.src}
                        alt=""
                        fill
                        sizes="100px"
                        className={styles.stripeImage}
                      />
                    </div>
                  </div>
                ))}
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* Editorial Details Row: Positioned cleanly below the film strip */}
      <div className={styles.infoArea}>
        <div className={styles.infoContent}>
          <div className={styles.infoLeft}>
            <span className={styles.photoTitle}>{currentPhoto.title}</span>
            <span className={styles.photoMeta}>
              {currentPhoto.year} — {currentPhoto.location}
            </span>
          </div>
          <div className={styles.infoRight}>
            <div className={styles.counter}>
              <span>{String(activePhotoIndex + 1).padStart(2, '0')}</span>
              <span>{String(totalPhotos).padStart(2, '0')}</span>
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
