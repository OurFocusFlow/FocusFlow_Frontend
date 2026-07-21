import React from "react";
import { useDarkMode } from '../Context/DarkModeContext';
import styles from "./NotFound.module.css";

export default function NotFound({
  onGoDashboard = () => (window.location.href = "/dashboard"),
  onGoBack = () => window.history.back(),
}) {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`${styles["nf-page"]} ${isDarkMode ? styles.darkNfPage : ""}`}>
      <div className={`${styles["nf-vignette"]} ${isDarkMode ? styles.darkNfVignette : ""}`} aria-hidden="true" />

      <header className={`${styles["nf-header"]} ${isDarkMode ? styles.darkNfHeader : ""}`}>
        <div className={`${styles["nf-logo"]} ${isDarkMode ? styles.darkNfLogo : ""}`}>
          <svg
            className={`${styles["nf-logo-icon"]} ${isDarkMode ? styles.darkNfLogoIcon : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
          </svg>
          <span>BrewTask</span>
        </div>
        <nav className={`${styles["nf-nav"]} ${isDarkMode ? styles.darkNfNav : ""}`}>
          <a href="/support">Support</a>
          <a href="/status">Status</a>
        </nav>
      </header>

      <main className={`${styles["nf-main"]} ${isDarkMode ? styles.darkNfMain : ""}`}>
        <div className={`${styles["nf-scope"]} ${isDarkMode ? styles.darkNfScope : ""}`}>
          <div className={`${styles["nf-ring-wrapper"]} ${isDarkMode ? styles.darkNfRingWrapper : ""}`}>
            <svg className={`${styles["nf-ring"]} ${isDarkMode ? styles.darkNfRing : ""}`} viewBox="0 0 240 240" aria-hidden="true">
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

          <div className={`${styles["nf-clock"]} ${isDarkMode ? styles.darkNfClock : ""}`} aria-hidden="true">
            <div className={`${styles["nf-clock-face"]} ${isDarkMode ? styles.darkNfClockFace : ""}`}>
              <span className={`${styles["nf-clock-12"]} ${isDarkMode ? styles.darkNfClock12 : ""}`}>12</span>
              <div className={`${styles["nf-hand"]} ${styles["nf-hand-hour"]} ${isDarkMode ? styles.darkNfHandHour : ""}`} />
              <div className={`${styles["nf-hand"]} ${styles["nf-hand-minute"]} ${isDarkMode ? styles.darkNfHandMinute : ""}`} />
              <div className={`${styles["nf-hand"]} ${styles["nf-hand-second"]} ${isDarkMode ? styles.darkNfHandSecond : ""}`} />
              <div className={`${styles["nf-clock-pin"]} ${isDarkMode ? styles.darkNfClockPin : ""}`} />
              <div className={`${styles["nf-clock-corner"]} ${isDarkMode ? styles.darkNfClockCorner : ""}`} />
            </div>
          </div>
        </div>

        <div className={`${styles["nf-chip"]} ${isDarkMode ? styles.darkNfChip : ""}`}>
          <span className={`${styles["nf-rec-dot"]} ${isDarkMode ? styles.darkNfRecDot : ""}`} />
          <span className={`${styles["nf-chip-label"]} ${isDarkMode ? styles.darkNfChipLabel : ""}`}>ERROR</span>
          <span className={`${styles["nf-chip-digits"]} ${isDarkMode ? styles.darkNfChipDigits : ""}`}>404</span>
        </div>

        <h1 className={`${styles["nf-title"]} ${isDarkMode ? styles.darkNfTitle : ""}`}>
          Oops! This page is <em className={`${styles["nf-em"]} ${isDarkMode ? styles.darkNfEm : ""}`}>off-task</em>.
        </h1>

        <p className={`${styles["nf-subtitle"]} ${isDarkMode ? styles.darkNfSubtitle : ""}`}>
          The flow was interrupted. We couldn't find the workflow or
          resource you were looking for. Let's get you back into the zone.
        </p>

        <div className={styles["nf-actions"]}>
          <button
            className={`${styles["nf-btn"]} ${styles["nf-btn-primary"]} ${isDarkMode ? styles.darkNfBtnPrimary : ""}`}
            onClick={onGoDashboard}
          >
            <svg
              className={`${styles["nf-btn-icon"]} ${isDarkMode ? styles.darkNfBtnIcon : ""}`}
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
            className={`${styles["nf-btn"]} ${styles["nf-btn-secondary"]} ${isDarkMode ? styles.darkNfBtnSecondary : ""}`}
            onClick={onGoBack}
          >
            <svg
              className={`${styles["nf-btn-icon"]} ${styles["nf-btn-icon-arrow"]} ${isDarkMode ? styles.darkNfBtnIcon : ""}`}
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
          <div className={`${styles["nf-skeleton-card"]} ${isDarkMode ? styles.darkNfSkeletonCard : ""}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="m8.5 12.5 2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={`${styles["nf-skeleton-bar"]} ${isDarkMode ? styles.darkNfSkeletonBar : ""}`} />
          </div>
          <div className={`${styles["nf-skeleton-card"]} ${isDarkMode ? styles.darkNfSkeletonCard : ""}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <circle cx="8.5" cy="12" r="0.6" fill="currentColor" />
              <circle cx="12" cy="12" r="0.6" fill="currentColor" />
              <circle cx="15.5" cy="12" r="0.6" fill="currentColor" />
            </svg>
            <span className={`${styles["nf-skeleton-bar"]} ${isDarkMode ? styles.darkNfSkeletonBar : ""}`} />
          </div>
          <div className={`${styles["nf-skeleton-card"]} ${isDarkMode ? styles.darkNfSkeletonCard : ""}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path d="M3 9h18M8 2v4M16 2v4" strokeLinecap="round" />
            </svg>
            <span className={`${styles["nf-skeleton-bar"]} ${isDarkMode ? styles.darkNfSkeletonBar : ""}`} />
          </div>
          <div className={`${styles["nf-skeleton-card"]} ${isDarkMode ? styles.darkNfSkeletonCard : ""}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" strokeLinecap="round" />
            </svg>
            <span className={`${styles["nf-skeleton-bar"]} ${isDarkMode ? styles.darkNfSkeletonBar : ""}`} />
          </div>
        </div>
      </main>
    </div>
  );
}