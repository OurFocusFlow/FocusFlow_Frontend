import React, { useEffect } from 'react';
import styles from './ToastNotification.module.css';

const ToastNotification = ({ type = 'success', message, title, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 12.5L11 15L16 9.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    error: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 12h.01" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <div className={`${styles.toastContainer} ${styles[type]}`}>
      <div className={styles.toastIcon}>
        {icons[type] || icons.info}
      </div>
      <div className={styles.toastContent}>
        {title && <div className={styles.toastTitle}>{title}</div>}
        <div className={styles.toastMessage}>{message}</div>
      </div>
      <button className={styles.toastClose} onClick={onClose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <div className={styles.toastProgress} />
    </div>
  );
};

export default ToastNotification;