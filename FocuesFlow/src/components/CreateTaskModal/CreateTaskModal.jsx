// CreateTaskModal.jsx – using accent color
import React, { useState } from 'react';
import { useDarkMode } from '../Context/DarkModeContext';
import { useAccentColor } from '../Context/AccentColorContext';
import styles from './CreateTaskModal.module.css';

// Helper to convert hex to rgb
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `${r}, ${g}, ${b}`;
  }
  return '251, 188, 0';
};

// Helper to check if color is light
const isLightColor = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  }
  return false;
};

const CreateTaskModal = ({ isOpen, onClose, onSave, isSubmitting = false }) => {
  const { isDarkMode } = useDarkMode();
  const { accentColor } = useAccentColor();
  const [taskData, setTaskData] = useState({
    title: '',
    dueDate: '',
    priority: 'Medium',
    category: 'Design',
    description: '',
  });
  const [isDragging, setIsDragging] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const categoryOptions = ['Design', 'Marketing', 'Content', 'Development', 'Research', 'Documentation'];

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrioritySelect = (priority) => {
    setTaskData(prev => ({ ...prev, priority }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskData.dueDate && taskData.dueDate < today) {
      if (onSave) {
        const taskToSave = { ...taskData, categories: [taskData.category] };
        onSave(taskToSave);
      }
      return;
    }
    if (onSave) {
      const taskToSave = { ...taskData, categories: [taskData.category] };
      onSave(taskToSave);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  // Determine text color for elements on accent background
  const getButtonTextColor = () => {
    // In dark mode, if accent is light, use black; otherwise white.
    if (isDarkMode) {
      return isLightColor(accentColor) ? '#000000' : '#FFFFFF';
    }
    // In light mode, use dark brown for contrast (or white if accent is very dark)
    return isLightColor(accentColor) ? '#33231D' : '#FFFFFF';
  };

  const accentRgb = hexToRgb(accentColor);

  return (
    <div
      className={`${styles.modalOverlay} ${isDarkMode ? styles.darkModalOverlay : ''}`}
      onClick={handleOverlayClick}
      style={{ '--accent-color': accentColor, '--accent-rgb': accentRgb }}
    >
      <div className={`${styles.modalContainer} ${isDarkMode ? styles.darkModalContainer : ''}`}>
        {/* Modal Header */}
        <div className={`${styles.modalHeader} ${isDarkMode ? styles.darkModalHeader : ''}`}>
          <div className={styles.modalHeaderLeft}>
            <div
              className={`${styles.modalIconWrapper} ${isDarkMode ? styles.darkModalIconWrapper : ''}`}
              style={{ background: accentColor, color: getButtonTextColor() }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h2 className={`${styles.modalTitle} ${isDarkMode ? styles.darkModalTitle : ''}`}>Create New Task</h2>
              <p className={`${styles.modalSubtitle} ${isDarkMode ? styles.darkModalSubtitle : ''}`}>Set your focus and define the objective.</p>
            </div>
          </div>
          <button
            className={`${styles.modalCloseBtn} ${isDarkMode ? styles.darkModalCloseBtn : ''}`}
            onClick={onClose}
            disabled={isSubmitting}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={`${styles.modalForm} ${isDarkMode ? styles.darkModalForm : ''}`}>
          {/* Task Title */}
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${isDarkMode ? styles.darkFormLabel : ''}`}>
              Task Title <span className={styles.requiredStar}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleInputChange}
              placeholder="e.g. Design System Documentation"
              className={`${styles.formInput} ${isDarkMode ? styles.darkFormInput : ''}`}
              disabled={isSubmitting}
            />
          </div>

          {/* Due Date & Priority */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${isDarkMode ? styles.darkFormLabel : ''}`}>
                Due Date <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleInputChange}
                className={`${styles.formInput} ${isDarkMode ? styles.darkFormInput : ''}`}
                disabled={isSubmitting}
                min={today}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${isDarkMode ? styles.darkFormLabel : ''}`}>Priority</label>
              <div className={styles.priorityGroup}>
                {['Low', 'Medium', 'High'].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    className={`${styles.priorityBtn} ${
                      taskData.priority === priority ? styles.priorityBtnActive : ''
                    } ${styles[`priorityBtn${priority}`]} ${isDarkMode ? styles.darkPriorityBtn : ''}`}
                    onClick={() => handlePrioritySelect(priority)}
                    disabled={isSubmitting}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category */}
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${isDarkMode ? styles.darkFormLabel : ''}`}>
              Category <span className={styles.requiredStar}>*</span>
            </label>
            <select
              name="category"
              value={taskData.category}
              onChange={handleInputChange}
              className={`${styles.formSelect} ${isDarkMode ? styles.darkFormSelect : ''}`}
              disabled={isSubmitting}
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${isDarkMode ? styles.darkFormLabel : ''}`}>
              Description <span className={styles.requiredStar}>*</span>
            </label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleInputChange}
              placeholder="Briefly describe the task goals and deliverables..."
              className={`${styles.formTextarea} ${isDarkMode ? styles.darkFormTextarea : ''}`}
              rows="4"
              disabled={isSubmitting}
            />
          </div>

          {/* Attachments */}
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${isDarkMode ? styles.darkFormLabel : ''}`}>Attachments</label>
            <div
              className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ''} ${isDarkMode ? styles.darkDropZone : ''}`}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (!isSubmitting) {
                  console.log('Files dropped:', e.dataTransfer.files);
                }
              }}
            >
              <div className={styles.dropZoneContent}>
                <div className={`${styles.dropZoneIcon} ${isDarkMode ? styles.darkDropZoneIcon : ''}`}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 12.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6.5" strokeLinecap="round" />
                    <path d="M15.5 3H21v5.5M11 13l9-9" strokeLinecap="round" />
                  </svg>
                </div>
                <p className={`${styles.dropZoneText} ${isDarkMode ? styles.darkDropZoneText : ''}`}>
                  Drop relevant assets here or <span className={`${styles.dropZoneLink} ${isDarkMode ? styles.darkDropZoneLink : ''}`}>browse</span>
                </p>
                <p className={`${styles.dropZoneSubtext} ${isDarkMode ? styles.darkDropZoneSubtext : ''}`}>PNG, JPG, PDF up to 10MB</p>
              </div>
              <input type="file" className={styles.dropZoneInput} multiple disabled={isSubmitting} />
            </div>
          </div>

          {/* Modal Footer */}
          <div className={`${styles.modalFooter} ${isDarkMode ? styles.darkModalFooter : ''}`}>
            <button
              type="button"
              className={`${styles.cancelBtn} ${isDarkMode ? styles.darkCancelBtn : ''}`}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.saveBtn} ${isDarkMode ? styles.darkSaveBtn : ''}`}
              disabled={isSubmitting}
              style={{ background: accentColor, color: getButtonTextColor() }}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner} />
                  Creating...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Save Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;