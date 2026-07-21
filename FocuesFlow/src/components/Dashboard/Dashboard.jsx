import React, { useState, useRef, useEffect } from "react";
import { useTasks } from "../Context/TaskContext";
import { useDarkMode } from "../Context/DarkModeContext";
import { useAccentColor } from "../Context/AccentColorContext";
import styles from "./Dashboard.module.css";
import bannerImage from "../../assets/Images/Image4.png";
import ToastNotification from "../ToastNotification/ToastNotification";

// Helper function to convert hex to rgb
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

// Helper function to check if accent color is the default amber
const isDefaultAmber = (hex) => {
  return hex && hex.toLowerCase() === '#fbbc00';
};

function Icon({ name, className }) {
  const paths = {
    clipboard: (
      <>
        <rect x="6" y="4" width="12" height="17" rx="2" />
        <rect x="9" y="2" width="6" height="4" rx="1" />
        <path d="M9 11h6M9 15h6" strokeLinecap="round" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12.5 2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    hourglass: (
      <path
        d="M6 2h12M6 22h12M7 2c0 5 5 6 5 10s-5 5-5 10M17 2c0 5-5 6-5 10s5 5 5 10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    alertCircle: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5m0 3h.01" strokeLinecap="round" />
      </>
    ),
    filter: <path d="M4 5h16l-6 8v6l-4 2v-8L4 5Z" strokeLinecap="round" strokeLinejoin="round" />,
    sort: <path d="M7 6h10M7 12h7M7 18h4" strokeLinecap="round" />,
    edit: (
      <path
        d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    trash: (
      <path
        d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    chevronDown: <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />,
    checkSmall: <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />,
    x: <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />,
    plus: <path d="M12 5v14M5 12h14" strokeLinecap="round" />,
  };
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

// Priority order: High -> Medium -> Low
const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

export default function Dashboard() {
  const { tasks, updateTask, deleteTask, toggleTaskComplete, isLoading } = useTasks();
  const { isDarkMode } = useDarkMode();
  const { accentColor } = useAccentColor();
  
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [openMenu, setOpenMenu] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', category: 'Design' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const filterRef = useRef(null);
  const sortRef = useRef(null);

  const today = new Date().toISOString().split('T')[0];
  const categoryOptions = ["Design", "Marketing", "Content", "Development", "Research", "Documentation"];

  // Determine if we should use accent color for elements
  const shouldUseAccent = isDarkMode && !isDefaultAmber(accentColor);
  
  // Get accent color RGB
  const accentRgb = hexToRgb(accentColor);

  const formatDateToInput = (dateString) => {
    if (!dateString) return '';
    try {
      if (dateString.includes(' ')) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      if (dateString.includes('-')) {
        return dateString;
      }
      return '';
    } catch {
      return '';
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'No date';
    try {
      if (dateString.includes(' ')) return dateString;
      const date = new Date(dateString + 'T00:00:00');
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Invalid date';
    }
  };

  const showToast = (type, message, title) => {
    setToast({ type, message, title });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target) &&
          sortRef.current && !sortRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTaskCompleteHandler = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const result = await toggleTaskComplete(id);
      if (result.success) {
        const status = !task.completed ? 'completed' : 'uncompleted';
        showToast('success', `Task "${task.title}" marked as ${status}`, 'Task Updated');
      } else {
        showToast('error', 'Failed to update task status', 'Error');
      }
    }
  };

  const handleDelete = (id) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = async (id) => {
    const task = tasks.find(t => t.id === id);
    const result = await deleteTask(id);
    setShowDeleteConfirm(null);
    if (result.success && task) {
      showToast('success', `Task "${task.title}" has been deleted.`, 'Task Deleted');
    } else if (!result.success) {
      showToast('error', 'Failed to delete task', 'Error');
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleEdit = (task) => {
    setEditingTask(task.id);
    setEditForm({
      title: task.title,
      description: task.description,
      dueDate: formatDateToInput(task.dueDate) || '',
      priority: task.priority,
      category: task.category || 'Design',
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    if (!editForm.title.trim()) {
      showToast('error', 'Please enter a task title.', 'Missing Title');
      return;
    }

    if (!editForm.description.trim()) {
      showToast('error', 'Please enter a task description.', 'Missing Description');
      return;
    }

    if (!editForm.dueDate) {
      showToast('error', 'Please select a due date.', 'Missing Due Date');
      return;
    }
    
    if (editForm.dueDate < today) {
      showToast('error', 'Due date cannot be in the past. Please select a future date.', 'Invalid Date');
      return;
    }

    const dateObj = new Date(editForm.dueDate + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const updatedTask = {
      title: editForm.title,
      description: editForm.description,
      dueDate: formattedDate,
      dueSort: new Date(editForm.dueDate + 'T00:00:00').getTime(),
      priority: editForm.priority,
      category: editForm.category,
    };

    const result = await updateTask(id, updatedTask);
    setEditingTask(null);
    if (result.success) {
      showToast('success', `Task "${updatedTask.title}" has been updated.`, 'Task Updated');
    } else {
      showToast('error', 'Failed to update task', 'Error');
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
  };

  const stats = {
    total: tasks.length,
    totalTrend: "+12%",
    completed: tasks.filter((t) => t.completed).length,
    completedPct: tasks.length > 0 ? `${Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)}%` : "0%",
    pending: tasks.filter((t) => !t.completed).length,
    overdue: tasks.filter((t) => !t.completed && t.dueSort < 0).length,
  };

  const priorityClass = (p) => ({ High: styles["badge-high"], Medium: styles["badge-medium"], Low: styles["badge-low"] }[p] || "");
  const categoryClass = (c) => ({ Design: styles["category-design"], Marketing: styles["category-marketing"], Content: styles["category-content"], Development: styles["category-development"], Research: styles["category-research"], Documentation: styles["category-documentation"] }[c] || "");

  let visibleTasks = tasks.filter((t) => {
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    return true;
  });

  // Apply sorting
  if (sortBy === "dueDate") {
    visibleTasks = [...visibleTasks].sort((a, b) => {
      if (!a.dueSort && !b.dueSort) return 0;
      if (!a.dueSort) return 1;
      if (!b.dueSort) return -1;
      return b.dueSort - a.dueSort;
    });
  } else if (sortBy === "priority") {
    visibleTasks = [...visibleTasks].sort((a, b) => {
      if (!a.priority && !b.priority) return 0;
      if (!a.priority) return 1;
      if (!b.priority) return -1;
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    });
  } else {
    visibleTasks = [...visibleTasks].sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      if (a.dueSort && b.dueSort) {
        return b.dueSort - a.dueSort;
      }
      if (a.dueSort) return -1;
      if (b.dueSort) return 1;
      return 0;
    });
  }

  const activeFilterCount = (filterPriority !== "all" ? 1 : 0) + (filterCategory !== "all" ? 1 : 0);

  const clearFilters = () => {
    setFilterPriority("all");
    setFilterCategory("all");
  };

  return (
    <div 
      className={`${styles["home-container"]} ${isDarkMode ? styles["darkContainer"] : ""}`}
      style={{
        '--accent-color': accentColor,
        '--accent-rgb': accentRgb,
      }}
    >
      <div className={`${styles["home-bg"]} ${isDarkMode ? styles["darkBg"] : ""}`}>
        <div 
          className={styles["home-bg-orb"]}
          style={{
            background: shouldUseAccent ? `radial-gradient(circle, rgba(${accentRgb}, 0.10) 0%, rgba(${accentRgb}, 0) 70%)` : undefined,
          }}
        />
        <div 
          className={styles["home-bg-orb"]}
          style={{
            background: shouldUseAccent ? `radial-gradient(circle, rgba(${accentRgb}, 0.06) 0%, rgba(${accentRgb}, 0) 70%)` : undefined,
          }}
        />
        <div 
          className={styles["home-bg-orb"]}
          style={{
            background: shouldUseAccent ? `radial-gradient(circle, rgba(${accentRgb}, 0.04) 0%, rgba(${accentRgb}, 0) 70%)` : undefined,
          }}
        />
        <div 
          className={`${styles["home-bg-grid"]} ${isDarkMode ? styles["darkBgGrid"] : ""}`}
          style={{
            backgroundImage: shouldUseAccent ? 
              `linear-gradient(rgba(${accentRgb}, 0.02) 1px, transparent 1px),
               linear-gradient(90deg, rgba(${accentRgb}, 0.02) 1px, transparent 1px)` : undefined,
          }}
        />
        <div 
          className={`${styles["home-bg-glow"]} ${isDarkMode ? styles["darkBgGlow"] : ""}`}
          style={{
            background: shouldUseAccent ? 
              `radial-gradient(circle, rgba(${accentRgb}, 0.06) 0%, transparent 70%)` : undefined,
          }}
        />
      </div>

      <div className={styles["home-content-wrapper"]}>
        <div className={styles["home-stats-row"]}>
          <div className={`${styles["home-stat-box"]} ${isDarkMode ? styles["darkStatBox"] : ""}`}>
            <div className={styles["home-stat-top"]}>
              <div className={`${styles["home-stat-icon-wrap"]} ${styles["icon-total"]} ${isDarkMode ? styles["darkIconTotal"] : ""}`}>
                <Icon name="clipboard" className={styles["home-stat-icon"]} />
              </div>
              <span className={`${styles["home-stat-trend"]} ${isDarkMode ? styles["darkStatTrend"] : ""}`}>{stats.totalTrend}</span>
            </div>
            <span className={`${styles["home-stat-label"]} ${isDarkMode ? styles["darkStatLabel"] : ""}`}>Total Tasks</span>
            <span className={`${styles["home-stat-value"]} ${isDarkMode ? styles["darkStatValue"] : ""}`}>{stats.total}</span>
          </div>

          <div className={`${styles["home-stat-box"]} ${isDarkMode ? styles["darkStatBox"] : ""}`}>
            <div className={styles["home-stat-top"]}>
              <div className={`${styles["home-stat-icon-wrap"]} ${styles["icon-completed"]} ${isDarkMode ? styles["darkIconCompleted"] : ""}`}>
                <Icon name="check" className={styles["home-stat-icon"]} />
              </div>
              <span className={`${styles["home-stat-trend"]} ${isDarkMode ? styles["darkStatTrend"] : ""}`}>{stats.completedPct}</span>
            </div>
            <span className={`${styles["home-stat-label"]} ${isDarkMode ? styles["darkStatLabel"] : ""}`}>Completed</span>
            <span className={`${styles["home-stat-value"]} ${isDarkMode ? styles["darkStatValue"] : ""}`}>{stats.completed}</span>
          </div>

          <div className={`${styles["home-stat-box"]} ${isDarkMode ? styles["darkStatBox"] : ""}`}>
            <div className={styles["home-stat-top"]}>
              <div className={`${styles["home-stat-icon-wrap"]} ${styles["icon-pending"]} ${isDarkMode ? styles["darkIconPending"] : ""}`}>
                <Icon name="hourglass" className={styles["home-stat-icon"]} />
              </div>
              <span className={`${styles["home-stat-trend"]} ${isDarkMode ? styles["darkStatTrend"] : ""}`}>Active</span>
            </div>
            <span className={`${styles["home-stat-label"]} ${isDarkMode ? styles["darkStatLabel"] : ""}`}>Pending</span>
            <span className={`${styles["home-stat-value"]} ${isDarkMode ? styles["darkStatValue"] : ""}`}>{stats.pending}</span>
          </div>

          <div className={`${styles["home-stat-box"]} ${isDarkMode ? styles["darkStatBox"] : ""}`}>
            <div className={styles["home-stat-top"]}>
              <div className={`${styles["home-stat-icon-wrap"]} ${styles["icon-overdue"]} ${isDarkMode ? styles["darkIconOverdue"] : ""}`}>
                <Icon name="alertCircle" className={styles["home-stat-icon"]} />
              </div>
              <span className={`${styles["home-stat-trend"]} ${styles["trend-urgent"]} ${isDarkMode ? styles["darkTrendUrgent"] : ""}`}>Urgent</span>
            </div>
            <span className={`${styles["home-stat-label"]} ${isDarkMode ? styles["darkStatLabel"] : ""}`}>Overdue</span>
            <span className={`${styles["home-stat-value"]} ${styles["value-urgent"]} ${isDarkMode ? styles["darkValueUrgent"] : ""}`}>{stats.overdue}</span>
          </div>
        </div>

        <div className={`${styles["home-rituals-header"]} ${isDarkMode ? styles["darkRitualsHeader"] : ""}`}>
          <div>
            <div className={styles["home-rituals-title-row"]}>
              <h2 className={`${styles["home-rituals-title"]} ${isDarkMode ? styles["darkRitualsTitle"] : ""}`}>Daily Rituals</h2>
              <span className={`${styles["home-rituals-count"]} ${isDarkMode ? styles["darkRitualsCount"] : ""}`}>{visibleTasks.length}</span>
            </div>
            <p className={`${styles["home-rituals-sub"]} ${isDarkMode ? styles["darkRitualsSub"] : ""}`}>Focus on what matters most today.</p>
          </div>

          <div className={styles["home-rituals-actions"]}>
            {activeFilterCount > 0 && (
              <button 
                className={`${styles["home-clear-btn"]} ${isDarkMode ? styles["darkClearBtn"] : ""}`} 
                onClick={clearFilters}
                style={{
                  color: shouldUseAccent ? accentColor : undefined,
                }}
              >
                <Icon name="x" className={styles["home-btn-icon"]} />
                Clear
              </button>
            )}

            <div className={styles["home-menu-wrap"]} ref={filterRef}>
              <button
                className={`${styles["home-filter-btn"]} ${activeFilterCount > 0 ? styles["btn-active"] : ""} ${isDarkMode ? styles["darkFilterBtn"] : ""}`}
                onClick={() => setOpenMenu(openMenu === "filter" ? null : "filter")}
                style={{
                  borderColor: shouldUseAccent && activeFilterCount > 0 ? accentColor : undefined,
                  color: shouldUseAccent && activeFilterCount > 0 ? accentColor : undefined,
                }}
              >
                <Icon name="filter" className={styles["home-btn-icon"]} />
                Filter
                {activeFilterCount > 0 && (
                  <span 
                    className={`${styles["home-filter-badge"]} ${isDarkMode ? styles["darkFilterBadge"] : ""}`}
                    style={{
                      background: shouldUseAccent ? accentColor : undefined,
                      color: shouldUseAccent ? '#000000' : undefined,
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )}
                <Icon name="chevronDown" className={`${styles["home-chevron"]} ${isDarkMode ? styles["darkChevron"] : ""}`} />
              </button>

              {openMenu === "filter" && (
                <div className={`${styles["home-dropdown"]} ${isDarkMode ? styles["darkDropdown"] : ""}`}>
                  <span className={`${styles["home-dropdown-label"]} ${isDarkMode ? styles["darkDropdownLabel"] : ""}`}>Priority</span>
                  {["all", "High", "Medium", "Low"].map((p) => (
                    <button
                      key={p}
                      className={`${styles["home-dropdown-item"]} ${isDarkMode ? styles["darkDropdownItem"] : ""}`}
                      onClick={() => setFilterPriority(p)}
                      style={{
                        color: shouldUseAccent && filterPriority === p ? accentColor : undefined,
                      }}
                    >
                      {p === "all" ? "All priorities" : p}
                      {filterPriority === p && (
                        <Icon 
                          name="checkSmall" 
                          className={`${styles["home-dropdown-check"]} ${isDarkMode ? styles["darkDropdownCheck"] : ""}`}
                          style={{
                            color: shouldUseAccent ? accentColor : undefined,
                          }}
                        />
                      )}
                    </button>
                  ))}
                  <span className={`${styles["home-dropdown-label"]} ${isDarkMode ? styles["darkDropdownLabel"] : ""}`}>Category</span>
                  {["all", ...categoryOptions].map((c) => (
                    <button
                      key={c}
                      className={`${styles["home-dropdown-item"]} ${isDarkMode ? styles["darkDropdownItem"] : ""}`}
                      onClick={() => setFilterCategory(c)}
                      style={{
                        color: shouldUseAccent && filterCategory === c ? accentColor : undefined,
                      }}
                    >
                      {c === "all" ? "All categories" : c}
                      {filterCategory === c && (
                        <Icon 
                          name="checkSmall" 
                          className={`${styles["home-dropdown-check"]} ${isDarkMode ? styles["darkDropdownCheck"] : ""}`}
                          style={{
                            color: shouldUseAccent ? accentColor : undefined,
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles["home-menu-wrap"]} ref={sortRef}>
              <button
                className={`${styles["home-sort-btn"]} ${sortBy !== "default" ? styles["btn-active"] : ""} ${isDarkMode ? styles["darkSortBtn"] : ""}`}
                onClick={() => setOpenMenu(openMenu === "sort" ? null : "sort")}
                style={{
                  borderColor: shouldUseAccent && sortBy !== "default" ? accentColor : undefined,
                  color: shouldUseAccent && sortBy !== "default" ? accentColor : undefined,
                }}
              >
                <Icon name="sort" className={styles["home-btn-icon"]} />
                Sort
                <Icon name="chevronDown" className={`${styles["home-chevron"]} ${isDarkMode ? styles["darkChevron"] : ""}`} />
              </button>

              {openMenu === "sort" && (
                <div className={`${styles["home-dropdown"]} ${isDarkMode ? styles["darkDropdown"] : ""}`}>
                  {[
                    { key: "default", label: "Default" },
                    { key: "dueDate", label: "Due Date (Newest First)" },
                    { key: "priority", label: "Priority (High → Low)" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      className={`${styles["home-dropdown-item"]} ${isDarkMode ? styles["darkDropdownItem"] : ""}`}
                      onClick={() => {
                        setSortBy(opt.key);
                        setOpenMenu(null);
                      }}
                      style={{
                        color: shouldUseAccent && sortBy === opt.key ? accentColor : undefined,
                      }}
                    >
                      {opt.label}
                      {sortBy === opt.key && (
                        <Icon 
                          name="checkSmall" 
                          className={`${styles["home-dropdown-check"]} ${isDarkMode ? styles["darkDropdownCheck"] : ""}`}
                          style={{
                            color: shouldUseAccent ? accentColor : undefined,
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {visibleTasks.length === 0 ? (
          <div className={`${styles["home-empty-state"]} ${isDarkMode ? styles["darkEmptyState"] : ""}`}>
            <p>No tasks match these filters.</p>
            <button 
              className={`${styles["home-clear-btn"]} ${isDarkMode ? styles["darkClearBtn"] : ""}`} 
              onClick={clearFilters}
              style={{
                color: shouldUseAccent ? accentColor : undefined,
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className={styles["home-ritual-list"]}>
            {visibleTasks.map((task, i) => (
              <div
                key={task.id}
                className={`${styles["home-ritual-item"]} ${task.completed ? styles["home-ritual-completed"] : ""} ${isDarkMode ? styles["darkRitualItem"] : ""}`}
                style={{ 
                  animationDelay: `${i * 0.05}s`,
                  borderColor: shouldUseAccent && !task.completed ? `rgba(${accentRgb}, 0.15)` : undefined,
                }}
              >
                {showDeleteConfirm === task.id && (
                  <div className={`${styles["home-delete-overlay"]} ${isDarkMode ? styles["darkDeleteOverlay"] : ""}`}>
                    <div className={styles["home-delete-modal"]}>
                      <p>Are you sure you want to delete this task?</p>
                      <div className={styles["home-delete-actions"]}>
                        <button 
                          className={`${styles["home-delete-confirm"]} ${isDarkMode ? styles["darkDeleteConfirm"] : ""}`}
                          onClick={() => confirmDelete(task.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                        <button 
                          className={`${styles["home-delete-cancel"]} ${isDarkMode ? styles["darkDeleteCancel"] : ""}`} 
                          onClick={cancelDelete}
                          style={{
                            color: shouldUseAccent ? accentColor : undefined,
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompleteHandler(task.id)}
                  className={`${styles["home-ritual-checkbox"]} ${isDarkMode ? styles["darkRitualCheckbox"] : ""}`}
                  disabled={isLoading}
                  style={{
                    accentColor: shouldUseAccent ? accentColor : undefined,
                  }}
                />

                {editingTask === task.id ? (
                  <div className={styles["home-edit-form"]}>
                    <div className={styles["home-edit-row"]}>
                      <input
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        className={`${styles["home-edit-input"]} ${isDarkMode ? styles["darkEditInput"] : ""}`}
                        placeholder="Task title"
                        style={{
                          borderColor: shouldUseAccent ? `rgba(${accentRgb}, 0.3)` : undefined,
                        }}
                      />
                      <input
                        name="dueDate"
                        type="date"
                        value={editForm.dueDate}
                        onChange={handleEditChange}
                        className={`${styles["home-edit-input-sm"]} ${isDarkMode ? styles["darkEditInput"] : ""} ${isDarkMode ? styles["darkDateInput"] : ""}`}
                        min={today}
                        style={{
                          borderColor: shouldUseAccent ? `rgba(${accentRgb}, 0.3)` : undefined,
                        }}
                      />
                    </div>
                    <div className={styles["home-edit-row"]}>
                      <input
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        className={`${styles["home-edit-input"]} ${isDarkMode ? styles["darkEditInput"] : ""}`}
                        placeholder="Description"
                        style={{
                          borderColor: shouldUseAccent ? `rgba(${accentRgb}, 0.3)` : undefined,
                        }}
                      />
                      <select
                        name="priority"
                        value={editForm.priority}
                        onChange={handleEditChange}
                        className={`${styles["home-edit-select"]} ${isDarkMode ? styles["darkEditSelect"] : ""}`}
                        style={{
                          borderColor: shouldUseAccent ? `rgba(${accentRgb}, 0.3)` : undefined,
                          color: shouldUseAccent ? accentColor : undefined,
                        }}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      <select
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        className={`${styles["home-edit-select"]} ${isDarkMode ? styles["darkEditSelect"] : ""}`}
                        style={{
                          borderColor: shouldUseAccent ? `rgba(${accentRgb}, 0.3)` : undefined,
                          color: shouldUseAccent ? accentColor : undefined,
                        }}
                      >
                        {categoryOptions.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles["home-edit-actions"]}>
                      <button 
                        className={`${styles["home-edit-save"]} ${isDarkMode ? styles["darkEditSave"] : ""}`}
                        onClick={() => saveEdit(task.id)}
                        disabled={isLoading}
                        style={{
                          background: shouldUseAccent ? accentColor : undefined,
                          color: shouldUseAccent ? '#000000' : undefined,
                        }}
                      >
                        {isLoading ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        className={`${styles["home-edit-cancel"]} ${isDarkMode ? styles["darkEditCancel"] : ""}`} 
                        onClick={cancelEdit}
                        style={{
                          color: shouldUseAccent ? accentColor : undefined,
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles["home-ritual-content"]}>
                      <h3 className={`${styles["home-ritual-title"]} ${isDarkMode ? styles["darkRitualTitle"] : ""}`}>{task.title}</h3>
                      <p className={`${styles["home-ritual-desc"]} ${isDarkMode ? styles["darkRitualDesc"] : ""}`}>{task.description}</p>
                    </div>

                    <div className={styles["home-ritual-due"]}>
                      <span className={`${styles["home-due-label"]} ${isDarkMode ? styles["darkDueLabel"] : ""}`}>DUE DATE</span>
                      <span className={`${styles["home-due-value"]} ${isDarkMode ? styles["darkDueValue"] : ""}`}>{formatDateForDisplay(task.dueDate)}</span>
                    </div>

                    <div className={styles["home-ritual-badges"]}>
                      <span className={`${styles["home-badge"]} ${priorityClass(task.priority)} ${isDarkMode ? styles["darkBadge"] : ""}`}>{task.priority}</span>
                      <span className={`${styles["home-badge"]} ${categoryClass(task.category)} ${isDarkMode ? styles["darkBadge"] : ""}`}>{task.category}</span>
                    </div>

                    <div className={styles["home-ritual-actions"]}>
                      <button 
                        className={`${styles["home-icon-btn"]} ${isDarkMode ? styles["darkIconBtn"] : ""}`}
                        onClick={() => handleEdit(task)} 
                        aria-label="Edit task"
                        disabled={isLoading}
                        style={{
                          color: shouldUseAccent ? accentColor : undefined,
                        }}
                      >
                        <Icon name="edit" className={styles["home-action-icon"]} />
                      </button>
                      <button 
                        className={`${styles["home-icon-btn"]} ${isDarkMode ? styles["darkIconBtn"] : ""}`}
                        onClick={() => handleDelete(task.id)} 
                        aria-label="Delete task"
                        disabled={isLoading}
                        style={{
                          color: shouldUseAccent ? '#ef4444' : undefined,
                        }}
                      >
                        <Icon name="trash" className={styles["home-action-icon"]} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <div className={`${styles["home-banner"]} ${isDarkMode ? styles["darkBanner"] : ""}`}>
          <div className={`${styles["home-banner-overlay"]} ${isDarkMode ? styles["darkBannerOverlay"] : ""}`} />
          <img 
            src={bannerImage} 
            alt="Master your ritual" 
            className={styles["home-banner-image"]} 
          />
          <div className={styles["home-banner-content"]}>
            <h2 className={`${styles["home-banner-title"]} ${isDarkMode ? styles["darkBannerTitle"] : ""}`}>Master your ritual.</h2>
            <p className={`${styles["home-banner-desc"]} ${isDarkMode ? styles["darkBannerDesc"] : ""}`}>
              Productivity isn't just about finishing tasks. It's about finding rhythm in the work you love.
            </p>
            <button 
              className={`${styles["home-banner-cta"]} ${isDarkMode ? styles["darkBannerCta"] : ""}`}
              style={{
                background: shouldUseAccent ? accentColor : undefined,
                color: shouldUseAccent ? '#000000' : undefined,
              }}
            >
              Explore Insights
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          title={toast.title}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}