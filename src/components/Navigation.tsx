'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/data/siteConfig';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWorkOpen, setIsWorkOpen] = useState(false);
  const [isMobileWorkOpen, setIsMobileWorkOpen] = useState(true); // Open by default in mobile drawer for easy discovery
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const desktopWorkRef = useRef<HTMLDivElement>(null);

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

  // Handle keyboard Escape, outside click, and body scroll lock for mobile menu
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Handle outside click & escape for desktop Work submenu
  useEffect(() => {
    if (!isWorkOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        desktopWorkRef.current &&
        !desktopWorkRef.current.contains(e.target as Node)
      ) {
        setIsWorkOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsWorkOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isWorkOpen]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsWorkOpen(false);
  };

  const toggleWorkSubmenu = () => {
    setIsWorkOpen((prev) => !prev);
  };

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

        {/* Desktop Horizontal Navigation */}
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

        {/* Mobile Hamburger Button */}
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

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div
          ref={menuRef}
          id="mobile-navigation"
          className={styles.mobileOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <nav className={styles.mobileNav}>
            {/* Expandable Work Accordion Item */}
            <div className={styles.mobileWorkGroup}>
              <button
                type="button"
                className={`${styles.mobileNavLink} ${styles.mobileWorkTrigger} ${
                  isWorkActive ? styles.mobileNavLinkActive : ''
                }`}
                onClick={() => setIsMobileWorkOpen((prev) => !prev)}
                aria-expanded={isMobileWorkOpen}
              >
                <span>Work</span>
                <span
                  className={`${styles.mobileWorkIndicator} ${
                    isMobileWorkOpen ? styles.mobileWorkIndicatorOpen : ''
                  }`}
                  aria-hidden="true"
                >
                  {isMobileWorkOpen ? '−' : '+'}
                </span>
              </button>

              {isMobileWorkOpen && (
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
              )}
            </div>

            <Link
              href="/about"
              onClick={closeMenu}
              className={`${styles.mobileNavLink} ${
                pathname === '/about' ? styles.mobileNavLinkActive : ''
              }`}
            >
              About
            </Link>

            <Link
              href="/contact"
              onClick={closeMenu}
              className={`${styles.mobileNavLink} ${
                pathname === '/contact' ? styles.mobileNavLinkActive : ''
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
