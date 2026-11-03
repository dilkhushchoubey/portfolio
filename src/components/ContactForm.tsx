'use client';

import React, { useState } from 'react';
import styles from './ContactForm.module.css';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [honeypot, setHoneypot] = useState('');
  const [submittedInfo, setSubmittedInfo] = useState<{ name: string; email: string } | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fallbackMailto, setFallbackMailto] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please enter a subject.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      newErrors.message = 'Please enter a message (at least 5 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear individual field error on change
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;

    if (!validate()) return;

    setStatus('loading');
    setErrorMessage('');
    setFallbackMailto(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          _gotcha: honeypot,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.success) {
        // Save submission context for the confirmation view
        setSubmittedInfo({
          name: formData.name.trim(),
          email: formData.email.trim(),
        });
        // Clear form only on success
        setFormData({ name: '', email: '', subject: '', message: '' });
        setHoneypot('');
        setErrors({});
        setStatus('success');
      } else {
        // Preserve entered information on failure
        setStatus('error');
        setErrorMessage(
          data?.error ||
            'Failed to deliver message. Please try again or reach out directly.'
        );
        if (data?.isConfigError) {
          const fallback = `mailto:dilkhushchoubey07@gmail.com?subject=${encodeURIComponent(
            `Portfolio enquiry: ${formData.subject}`
          )}&body=${encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
          )}`;
          setFallbackMailto(fallback);
        }
      }
    } catch {
      // Preserve entered information on failure
      setStatus('error');
      setErrorMessage(
        'A network connection error occurred while sending. You can reach out directly via email.'
      );
      const fallback = `mailto:dilkhushchoubey07@gmail.com?subject=${encodeURIComponent(
        `Portfolio enquiry: ${formData.subject}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
      )}`;
      setFallbackMailto(fallback);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setHoneypot('');
    setSubmittedInfo(null);
    setErrors({});
    setStatus('idle');
    setErrorMessage('');
    setFallbackMailto(null);
  };

  if (status === 'success') {
    return (
      <div className={styles.successBox} role="status" aria-live="polite">
        <h2 className={styles.successTitle}>Message Received</h2>
        <p className={styles.successText}>
          Thank you, {submittedInfo?.name || 'there'}. Your enquiry has been received. I will
          respond to you at {submittedInfo?.email} as soon as possible.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className={styles.resetButton}
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {/* Anti-spam honeypot (invisible to real visitors) */}
        <div className={styles.visuallyHidden} aria-hidden="true">
          <label htmlFor="contact-botcheck">Leave this field blank</label>
          <input
            id="contact-botcheck"
            type="text"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {/* Row 1: Name & Email side-by-side on desktop */}
        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <label htmlFor="contact-name" className={styles.label}>
              Name <span className={styles.required}>*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              disabled={status === 'loading'}
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className={`${styles.input} ${errors.name ? styles.hasError : ''}`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
            />
            {errors.name && (
              <span id="contact-name-error" className={styles.errorMessage}>
                {errors.name}
              </span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="contact-email" className={styles.label}>
              Email <span className={styles.required}>*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={status === 'loading'}
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={`${styles.input} ${errors.email ? styles.hasError : ''}`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
            />
            {errors.email && (
              <span id="contact-email-error" className={styles.errorMessage}>
                {errors.email}
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Subject (Full width) */}
        <div className={styles.fieldGroup}>
          <label htmlFor="contact-subject" className={styles.label}>
            Subject <span className={styles.required}>*</span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            disabled={status === 'loading'}
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enquiry or assignment subject"
            className={`${styles.input} ${errors.subject ? styles.hasError : ''}`}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
          />
          {errors.subject && (
            <span id="contact-subject-error" className={styles.errorMessage}>
              {errors.subject}
            </span>
          )}
        </div>

        {/* Row 3: Message (Full width, multiline textarea) */}
        <div className={styles.fieldGroup}>
          <label htmlFor="contact-message" className={styles.label}>
            Message <span className={styles.required}>*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            disabled={status === 'loading'}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell me about your project, timeline, and details..."
            className={`${styles.textarea} ${errors.message ? styles.hasError : ''}`}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
          />
          {errors.message && (
            <span id="contact-message-error" className={styles.errorMessage}>
              {errors.message}
            </span>
          )}
        </div>

        {/* Row 4: Centred Send Button */}
        <div className={styles.submitWrapper}>
          <button
            type="submit"
            disabled={status === 'loading'}
            className={styles.submitButton}
            aria-live="polite"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>

      {/* Error state with fallback */}
      {status === 'error' && (
        <div className={`${styles.alertBox} ${styles.alertError}`} role="alert">
          <p className={styles.alertTitle}>Notice</p>
          <p className={styles.alertText}>{errorMessage}</p>
          {fallbackMailto && (
            <a href={fallbackMailto} className={styles.mailtoButton}>
              Open in Email App
            </a>
          )}
        </div>
      )}
    </div>
  );
}
