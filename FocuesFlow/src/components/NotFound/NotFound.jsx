import React from "react";
import styles from "./NotFound.module.css";

export default function NotFound({
  onGoDashboard = () => (window.location.href = "/dashboard"),
  onGoBack = () => window.history.back(),
}) {
  return (
    <div className={styles["nf-page"]}>
      <div className={styles["nf-vignette"]} aria-hidden="true" />

      <header className={styles["nf-header"]}>
        <div className={styles["nf-logo"]}>
          <svg
            className={styles["nf-logo-icon"]}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
          </svg>
          <span>FocusFlow</span>
        </div>
        <nav className={styles["nf-nav"]}>
          <a href="/support">Support</a>
          <a href="/status">Status</a>
        </nav>
      </header>

      <main className={styles["nf-main"]}>
        <div className={styles["nf-scope"]}>
          <div className={styles["nf-ring-wrapper"]}>
            <svg className={styles["nf-ring"]} viewBox="0 0 240 240" aria-hidden="true">
              <circle
                cx="120"
                cy="120"
                r="118"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="3 11"
              />
            </svg>
          </div>

          <div className={styles["nf-clock"]} aria-hidden="true">
            <div className={styles["nf-clock-face"]}>
              <span className={styles["nf-clock-12"]}>12</span>
              <div className={`${styles["nf-hand"]} ${styles["nf-hand-hour"]}`} />
              <div className={`${styles["nf-hand"]} ${styles["nf-hand-minute"]}`} />
              <div className={`${styles["nf-hand"]} ${styles["nf-hand-second"]}`} />
              <div className={styles["nf-clock-pin"]} />
              <div className={styles["nf-clock-corner"]} />
            </div>
          </div>
        </div>

        <div className={styles["nf-chip"]}>
          <span className={styles["nf-rec-dot"]} />
          <span className={styles["nf-chip-label"]}>ERROR</span>
          <span className={styles["nf-chip-digits"]}>404</span>
        </div>

        <h1 className={styles["nf-title"]}>
          Oops! This page is <em className={styles["nf-em"]}>off-task</em>.
        </h1>

        <p className={styles["nf-subtitle"]}>
          The flow was interrupted. We couldn't find the workflow or
          resource you were looking for. Let's get you back into the zone.
        </p>

        <div className={styles["nf-actions"]}>
          <button
            className={`${styles["nf-btn"]} ${styles["nf-btn-primary"]}`}
            onClick={onGoDashboard}
          >
            <svg
              className={styles["nf-btn-icon"]}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            Go back to Dashboard
          </button>
          <button
            className={`${styles["nf-btn"]} ${styles["nf-btn-secondary"]}`}
            onClick={onGoBack}
          >
            <svg
              className={`${styles["nf-btn-icon"]} ${styles["nf-btn-icon-arrow"]}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M19 12H5m0 0 6-6m-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous Page
          </button>
        </div>

        <div className={styles["nf-skeletons"]}>
          <div className={styles["nf-skeleton-card"]}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="m8.5 12.5 2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={styles["nf-skeleton-bar"]} />
          </div>
          <div className={styles["nf-skeleton-card"]}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <circle cx="8.5" cy="12" r="0.6" fill="currentColor" />
              <circle cx="12" cy="12" r="0.6" fill="currentColor" />
              <circle cx="15.5" cy="12" r="0.6" fill="currentColor" />
            </svg>
            <span className={styles["nf-skeleton-bar"]} />
          </div>
          <div className={styles["nf-skeleton-card"]}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path d="M3 9h18M8 2v4M16 2v4" strokeLinecap="round" />
            </svg>
            <span className={styles["nf-skeleton-bar"]} />
          </div>
          <div className={styles["nf-skeleton-card"]}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" strokeLinecap="round" />
            </svg>
            <span className={styles["nf-skeleton-bar"]} />
          </div>
        </div>
      </main>
    </div>
  );
}