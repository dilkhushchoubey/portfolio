'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/data/siteConfig';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWorkOpen, setIsWorkOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const desktopWorkRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  // Close menus when route changes
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
    setIsWorkOpen(false);
  }

  const isWorkActive = pathname.startsWith('/work');

  const workSubmenu = [
    { label: 'Projects', href: '/work/projects' },
    { label: 'Portraits', href: '/work/portraits' },
    { label: 'Stills', href: '/work/stills' },
  ];

  // Stable action handlers
  const closeMenu = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsOpen(false);
    setIsWorkOpen(false);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 320);
  }, []);

  const toggleMenu = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsOpen((prev) => !prev);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 320);
  }, []);

  const toggleWorkSubmenu = useCallback(() => {
    setIsWorkOpen((prev) => !prev);
  }, []);

  // Event handlers moved outside effects with useCallback
  const handleMobileKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
        buttonRef.current?.focus();
      }
    },
    [closeMenu]
  );

  const handleMobileClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    },
    [closeMenu]
  );

  const handleResize = useCallback(() => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  }, [closeMenu]);

  const handleDesktopClickOutside = useCallback((e: MouseEvent) => {
    if (
      desktopWorkRef.current &&
      !desktopWorkRef.current.contains(e.target as Node)
    ) {
      setIsWorkOpen(false);
    }
  }, []);

  const handleDesktopKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsWorkOpen(false);
    }
  }, []);

  // Effect 1: Mobile drawer Escape key and outside click listeners
  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('keydown', handleMobileKeyDown);
    document.addEventListener('mousedown', handleMobileClickOutside);

    return () => {
      window.removeEventListener('keydown', handleMobileKeyDown);
      document.removeEventListener('mousedown', handleMobileClickOutside);
    };
  }, [isOpen, handleMobileKeyDown, handleMobileClickOutside]);

  // Effect 3: Body scroll locking and smooth unlock on close (280ms exit animation)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isOpen) {
      if (unlockTimerRef.current) {
        clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = null;
      }
      document.body.style.overflow = 'hidden';
    } else {
      unlockTimerRef.current = setTimeout(() => {
        document.body.style.overflow = '';
        unlockTimerRef.current = null;
      }, 280);
    }

    return () => {
      if (unlockTimerRef.current) {
        clearTimeout(unlockTimerRef.current);
      }
    };
  }, [isOpen]);

  // Clean up body scroll on unmount if menu was open
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Effect 4: Close mobile drawer on desktop resize
  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, handleResize]);

  // Effect 5: Desktop Work submenu outside click & escape listeners
  useEffect(() => {
    if (!isWorkOpen) return;

    document.addEventListener('mousedown', handleDesktopClickOutside);
    window.addEventListener('keydown', handleDesktopKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleDesktopClickOutside);
      window.removeEventListener('keydown', handleDesktopKeyDown);
    };
  }, [isWorkOpen, handleDesktopClickOutside, handleDesktopKeyDown]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          href="/"
          className={styles.brand}
          aria-label={`${siteConfig.name} - Home`}
          onClick={closeMenu}
        >
          <span className={styles.brandName}>{siteConfig.name}</span>
        </Link>

        {/* Desktop Horizontal Navigation (Preserved) */}
        <nav className={styles.desktopNav} aria-label="Main Navigation">
          {/* Expandable Work Navigation Item */}
          <div className={styles.workNavWrapper} ref={desktopWorkRef}>
            <button
              type="button"
              className={`${styles.navLink} ${styles.workTrigger} ${
                isWorkActive ? styles.navLinkActive : ''
              }`}
              onClick={toggleWorkSubmenu}
              aria-expanded={isWorkOpen}
              aria-haspopup="true"
              aria-label="Toggle Work submenu"
            >
              <span>Work</span>
              <span
                className={`${styles.caret} ${isWorkOpen ? styles.caretOpen : ''}`}
                aria-hidden="true"
              >
                ▾
              </span>
            </button>

            {isWorkOpen && (
              <div
                className={styles.desktopSubmenu}
                role="menu"
                aria-label="Work sections"
              >
                {workSubmenu.map((sub) => {
                  const isSubActive =
                    sub.href === '/work/projects'
                      ? pathname === '/work/projects' ||
                        pathname === '/work' ||
                        (pathname.startsWith('/work/') &&
                          pathname !== '/work/portraits' &&
                          pathname !== '/work/stills')
                      : pathname === sub.href;

                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      role="menuitem"
                      onClick={() => setIsWorkOpen(false)}
                      className={`${styles.submenuLink} ${
                        isSubActive ? styles.submenuLinkActive : ''
                      }`}
                    >
                      {sub.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            href="/about"
            className={`${styles.navLink} ${
              pathname === '/about' ? styles.navLinkActive : ''
            }`}
          >
            About
          </Link>

          <Link
            href="/contact"
            className={`${styles.navLink} ${
              pathname === '/contact' ? styles.navLinkActive : ''
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Hamburger Button (transforms into close X icon when open) */}
        <button
          ref={buttonRef}
          type="button"
          className={`${styles.hamburgerButton} ${
            isOpen ? styles.hamburgerActive : ''
          }`}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={toggleMenu}
        >
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
        </button>
      </div>

      {/* Mobile Navigation Drawer (smooth opening and closing transitions) */}
      <div
        ref={menuRef}
        id="mobile-navigation"
        className={`${styles.mobileOverlay} ${
          isOpen ? styles.mobileOverlayOpen : ''
        }`}
        role="dialog"
        aria-modal={isOpen}
        aria-hidden={!isOpen}
        aria-label="Mobile Navigation"
      >
        <nav
          className={`${styles.mobileNav} ${
            isOpen ? styles.mobileNavOpen : ''
          }`}
        >
          {/* WORK Section: Always visible submenu links directly below */}
          <div className={styles.mobileNavSection}>
            <span className={styles.mobileSectionHeading}>Work</span>
            <div className={styles.mobileSubmenu}>
              {workSubmenu.map((sub) => {
                const isSubActive =
                  sub.href === '/work/projects'
                    ? pathname === '/work/projects' ||
                      pathname === '/work' ||
                      (pathname.startsWith('/work/') &&
                        pathname !== '/work/portraits' &&
                        pathname !== '/work/stills')
                    : pathname === sub.href;

                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={closeMenu}
                    className={`${styles.mobileSubmenuLink} ${
                      isSubActive ? styles.mobileSubmenuLinkActive : ''
                    }`}
                  >
                    {sub.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ABOUT Section */}
          <div className={styles.mobileNavSection}>
            <Link
              href="/about"
              onClick={closeMenu}
              className={`${styles.mobileNavLink} ${
                pathname === '/about' ? styles.mobileNavLinkActive : ''
              }`}
            >
              About
            </Link>
          </div>

          {/* CONTACT Section */}
          <div className={styles.mobileNavSection}>
            <Link
              href="/contact"
              onClick={closeMenu}
              className={`${styles.mobileNavLink} ${
                pathname === '/contact' ? styles.mobileNavLinkActive : ''
              }`}
            >
              Contact
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
