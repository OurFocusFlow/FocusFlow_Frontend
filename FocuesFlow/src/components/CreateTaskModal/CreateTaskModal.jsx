import React, { useState } from 'react';
import styles from './CreateTaskModal.module.css';

const CreateTaskModal = ({ isOpen, onClose, onSave, isSubmitting = false }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    dueDate: '',
    priority: 'Medium',
    categories: [],
    description: '',
  });
  const [newCategory, setNewCategory] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrioritySelect = (priority) => {
    setTaskData(prev => ({ ...prev, priority }));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !taskData.categories.includes(newCategory.trim())) {
      setTaskData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category) => {
    setTaskData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCategory();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(taskData);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h2 className={styles.modalTitle}>Create New Task</h2>
              <p className={styles.modalSubtitle}>Set your focus and define the objective.</p>
            </div>
          </div>
          <button 
            className={styles.modalCloseBtn} 
            onClick={onClose}
            disabled={isSubmitting}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {/* Task Title */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Task Title
              <span className={styles.requiredStar}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleInputChange}
              placeholder="e.g. Design System Documentation"
              className={styles.formInput}
              disabled={isSubmitting}
            />
          </div>

          {/* Due Date & Priority */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Due Date
                <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleInputChange}
                className={styles.formInput}
                disabled={isSubmitting}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Priority</label>
              <div className={styles.priorityGroup}>
                {['Low', 'Medium', 'High'].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    className={`${styles.priorityBtn} ${
                      taskData.priority === priority ? styles.priorityBtnActive : ''
                    } ${styles[`priorityBtn${priority}`]}`}
                    onClick={() => handlePrioritySelect(priority)}
                    disabled={isSubmitting}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Categories
              <span className={styles.requiredStar}>*</span>
            </label>
            <div className={styles.categoriesContainer}>
              <div className={styles.categoriesList}>
                {taskData.categories.map((category) => (
                  <span key={category} className={styles.categoryTag}>
                    #{category}
                    <button
                      type="button"
                      className={styles.categoryRemove}
                      onClick={() => handleRemoveCategory(category)}
                      disabled={isSubmitting}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                <div className={styles.categoryInputWrapper}>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add Category"
                    className={styles.categoryInput}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className={styles.categoryAddBtn}
                    onClick={handleAddCategory}
                    disabled={isSubmitting}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Description
              <span className={styles.requiredStar}>*</span>
            </label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleInputChange}
              placeholder="Briefly describe the task goals and deliverables..."
              className={styles.formTextarea}
              rows="4"
              disabled={isSubmitting}
            />
          </div>

          {/* File Upload */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Attachments</label>
            <div 
              className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ''}`}
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
                <div className={styles.dropZoneIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 12.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6.5" strokeLinecap="round" />
                    <path d="M15.5 3H21v5.5M11 13l9-9" strokeLinecap="round" />
                  </svg>
                </div>
                <p className={styles.dropZoneText}>
                  Drop relevant assets here or <span className={styles.dropZoneLink}>browse</span>
                </p>
                <p className={styles.dropZoneSubtext}>PNG, JPG, PDF up to 10MB</p>
              </div>
              <input type="file" className={styles.dropZoneInput} multiple disabled={isSubmitting} />
            </div>
          </div>

          {/* Modal Footer */}
          <div className={styles.modalFooter}>
            <button 
              type="button" 
              className={styles.cancelBtn} 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.saveBtn}
              disabled={isSubmitting}
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