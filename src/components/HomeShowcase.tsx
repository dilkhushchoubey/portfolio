'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
 * 5 cycles of items provide an infinite visual buffer for dynamic modulo recycling
 */
const MAX_SPEED = 0.22;
const EASING_DURATION = 1.05;
const CYCLES = 11;
const BASE_CYCLE = 5; // Cycle 5 is the centered anchor (5 cycles to left, 5 to right)

export default function HomeShowcase({ slides = homepageShowcaseSlides }: HomeShowcaseProps) {
  const totalSlides = slides.length;
  const baseOffsetIndex = BASE_CYCLE * totalSlides;

  // React state updates ONLY when the active slide index changes
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Continuous animation refs
  const listXTargetRef = useRef(0);
  const posRef = useRef({ listX: 0 });
  const xToRef = useRef<((value: number) => void) | null>(null);
  const activeIndexRef = useRef(0);
  const activeGlobalIndexRef = useRef(baseOffsetIndex);
  const itemPitchRef = useRef(0);
  const baseSlotOffsetRef = useRef(0);
  const stageWidthRef = useRef(0);

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartTargetRef = useRef(0);

  // Generate 5 continuous repeating cycles of slides for infinite buffer
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


  // Geometry measurement function
  const updateMeasurements = useCallback(() => {
    const stage = stageRef.current;
    const baseSlot = slotRefs.current[baseOffsetIndex];
    const nextSlot = slotRefs.current[baseOffsetIndex + 1];
    if (!stage || !baseSlot) return;

    stageWidthRef.current = stage.clientWidth;

    // Pitch is the distance between consecutive slide centers
    if (nextSlot) {
      itemPitchRef.current = nextSlot.offsetLeft - baseSlot.offsetLeft;
    } else {
      const slideWidth = baseSlot.offsetWidth;
      const gap = window.innerWidth <= 640 ? 12 : 24;
      itemPitchRef.current = slideWidth + gap;
    }

    // Base slot center offset relative to the track
    baseSlotOffsetRef.current = baseSlot.offsetLeft + baseSlot.offsetWidth / 2;
  }, [baseOffsetIndex]);

  // Main GSAP quickTo continuous engine
  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    updateMeasurements();

    const applyTransform = () => {
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;

      const pitch = itemPitchRef.current;
      const baseCenter = baseSlotOffsetRef.current;
      const currentX = posRef.current.listX;

      // Exact viewport horizontal center: window.innerWidth / 2
      const viewportCenter = window.innerWidth / 2;
      const stageRect = stage.getBoundingClientRect();
      const stageLeft = stageRect.left;

      // The continuous target point in track coordinates that must align at viewportCenter
      const currentTrackTarget = baseCenter + currentX * pitch;

      // Translate track so that the continuous target point lands exactly at viewportCenter
      const trackX = viewportCenter - stageLeft - currentTrackTarget;
      gsap.set(track, { x: trackX, force3D: true });

      // Continuous dynamic scaling & visual hierarchy (center dominant, surrounding smaller & secondary)
      const centerGlobalIdx = baseOffsetIndex + Math.round(currentX);
      const minIdx = Math.max(0, centerGlobalIdx - 6);
      const maxIdx = Math.min(displaySlides.length - 1, centerGlobalIdx + 6);

      for (let j = minIdx; j <= maxIdx; j++) {
        const slot = slotRefs.current[j];
        if (!slot) continue;

        const dist = Math.abs(j - (baseOffsetIndex + currentX));
        const t = Math.max(0, Math.min(1, 1 - dist));
        // Smooth cubic ease for fluid expansion into center dominance
        const smooth = t * t * (3 - 2 * t);

        // Active center: scale 1.38 (dominant ~48-50vh), Inactive: scale 1.0 (~34vh)
        const scale = 1.0 + 0.38 * smooth;
        // Subtle difference: 0.82 inactive, 1.0 active — photographic & crisp
        const opacity = 0.82 + 0.18 * smooth;

        slot.style.transform = `scale(${scale.toFixed(4)})`;
        slot.style.opacity = opacity.toFixed(4);
        slot.style.zIndex = smooth > 0.4 ? '2' : '1';
      }
    };

    // Initialize quickTo continuous smoother
    const xTo = gsap.quickTo(posRef.current, 'listX', {
      duration: EASING_DURATION,
      ease: 'expo.out',
      onUpdate: () => {
        // 1. One-way downstream DOM rendering strictly from current animated posRef.current.listX
        applyTransform();

        // 2. Center-derived active slide detection (Decoupled from high-frequency React loop)
        const rawOffset = posRef.current.listX;
        const normalizedIndex = ((Math.round(rawOffset) % totalSlides) + totalSlides) % totalSlides;
        const currentGlobalIndex = baseOffsetIndex + Math.round(rawOffset);

        // Update active classes on DOM nodes with minimal overhead
        if (currentGlobalIndex !== activeGlobalIndexRef.current) {
          const prevSlot = slotRefs.current[activeGlobalIndexRef.current];
          const newSlot = slotRefs.current[currentGlobalIndex];
          if (prevSlot) prevSlot.classList.remove(styles.slideActive);
          if (newSlot) newSlot.classList.add(styles.slideActive);
          activeGlobalIndexRef.current = currentGlobalIndex;
        }

        // Update React metadata ONLY when integer active index transitions
        if (normalizedIndex !== activeIndexRef.current) {
          activeIndexRef.current = normalizedIndex;
          setActiveSlideIndex(normalizedIndex);
        }
      },
    });

    xToRef.current = xTo;

    // Initial position sync
    applyTransform();
    const initialSlot = slotRefs.current[baseOffsetIndex];
    if (initialSlot) initialSlot.classList.add(styles.slideActive);

    const handleResize = () => {
      updateMeasurements();
      applyTransform();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      xToRef.current = null;
    };
  }, [baseOffsetIndex, displaySlides.length, totalSlides, updateMeasurements]);

  // Continuous Wheel Handler — Cynx Architecture
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent browser default vertical page scrolling over the showcase strip
      e.preventDefault();

      // Combine vertical (trackpad standard) and horizontal delta
      const rawDelta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const normalizedDelta = e.deltaMode === 1 ? rawDelta * 32 : rawDelta;

      // Cynx velocity scaling: smoother resistance as target diverges from current pos
      const currentSpread = Math.abs(listXTargetRef.current - posRef.current.listX);
      const denominator = 320 + Math.min(300, currentSpread * 180);
      const step = normalizedDelta / denominator;

      // Clamp step to Cynx MAX_SPEED (0.22)
      const clampedStep = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, step));

      // Accumulate continuous target
      listXTargetRef.current += clampedStep;

      // Dispatch to GSAP quickTo
      if (xToRef.current) {
        xToRef.current(listXTargetRef.current);
      }
    };

    stage.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      stage.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Pointer drag support for tactile direct manipulation
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
    const pitch = itemPitchRef.current || 400;
    // Moving finger right brings left images (decreases listX)
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

  // Click on any visible slide to center it smoothly
  const handleSlideClick = (globalIdx: number) => {
    listXTargetRef.current = globalIdx - baseOffsetIndex;

    if (xToRef.current) {
      xToRef.current(listXTargetRef.current);
    }
  };

  // Keyboard navigation: Left/Right and Up/Down arrows
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

  // Active slide metadata
  const currentSlide = slides[activeSlideIndex] ?? slides[0];
  const displayLocation = currentSlide.location ? `${currentSlide.location.toUpperCase()} · ` : '';

  return (
    <section
      ref={sectionRef}
      className={styles.showcaseSection}
      aria-label="Photographic Showcase"
    >
      {/* Visual Photographic Stage: Cynx continuous quickTo horizontal strip */}
      <div
        ref={stageRef}
        className={styles.stageContainer}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          ref={trackRef}
          className={styles.track}
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
                <div
                  className={styles.frame}
                  style={{ aspectRatio: `${item.width || 3} / ${item.height || 2}` }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width || 1800}
                    height={item.height || 1200}
                    priority={idx >= baseOffsetIndex - 1 && idx <= baseOffsetIndex + 2}
                    className={styles.image}
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 68vw, 840px"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editorial Details — Geometrically Belonging to Active Photograph */}
      <div className={styles.infoArea}>
        <div className={styles.infoContent}>
          <div className={styles.infoLeft}>
            <span className={styles.photoTitle}>{currentSlide.title}</span>
          </div>
          <div className={styles.infoRight}>
            <span className={styles.locationYear}>
              {displayLocation}
              {currentSlide.year}
            </span>
            <span className={styles.separator}>·</span>
            <span className={styles.counter}>
              {String(activeSlideIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
