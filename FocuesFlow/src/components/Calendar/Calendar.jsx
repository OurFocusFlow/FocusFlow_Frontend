import React, { useState, useMemo, useRef, useEffect, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { useTasks } from "../Context/TaskContext";
import ToastNotification from "../ToastNotification/ToastNotification";
import styles from "./Calendar.module.css";

function Icon({ name, className }) {
  const paths = {
    chevronLeft: <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />,
    chevronRight: <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />,
    x: <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />,
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M3 9h18M8 2v4M16 2v4" strokeLinecap="round" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" strokeLinecap="round" />,
    edit: (
      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" strokeLinecap="round" strokeLinejoin="round" />
    ),
    trash: (
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" strokeLinecap="round" strokeLinejoin="round" />
    ),
    check: <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />,
    chevronDown: <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />,
  };
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const PRIORITIES = ["High", "Medium", "Low"];
const CATEGORIES = ["Design", "Marketing", "Content", "Development", "Research", "Documentation"];

function toDateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function startOfWeek(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

export default function Calendar() {
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    isLoading 
  } = useTasks();
  
  const today = new Date();
  const [viewMode, setViewMode] = useState("month");
  const [anchorDate, setAnchorDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ title: "", description: "",priority: "Medium", category: "Design" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addDraft, setAddDraft] = useState({ title: "", description: "",priority: "Medium", category: "Design" });
  const [dragTaskId, setDragTaskId] = useState(null);
  const [dragOverKey, setDragOverKey] = useState(null);
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState(null);

  // Week day-carousel state
  const [weekDayIndex, setWeekDayIndex] = useState(0);
  const weekScrollRef = useRef(null);
  const weekJumpTargetRef = useRef(null); // 'start' | 'end' | null — used when crossing week boundaries

  // Month/Year picker state
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const monthPickerRef = useRef(null);
  const yearPickerRef = useRef(null);

  const year = anchorDate.getFullYear();
  const month = anchorDate.getMonth();

  // Get today's date for validation
  const todayDate = new Date();
  const todayKey = toDateKey(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());

  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (monthPickerRef.current && !monthPickerRef.current.contains(event.target)) {
        setShowMonthPicker(false);
      }
      if (yearPickerRef.current && !yearPickerRef.current.contains(event.target)) {
        setShowYearPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toast helper
  const showToast = (type, message, title) => {
    setToast({ type, message, title });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  // Get tasks by date
  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      const dateKey = t.date || t.dueDate;
      if (dateKey) {
        let formattedKey = dateKey;
        if (dateKey.includes(' ')) {
          const months = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', 
                          Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
          const parts = dateKey.split(' ');
          if (parts.length === 3) {
            const month = months[parts[0]];
            const day = parts[1].replace(',', '').padStart(2, '0');
            const year = parts[2];
            formattedKey = `${year}-${month}-${day}`;
          }
        }
        if (!map[formattedKey]) map[formattedKey] = [];
        map[formattedKey].push(t);
      }
    });
    return map;
  }, [tasks]);

  const monthStats = useMemo(() => {
    const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
    const inMonth = Object.keys(tasksByDate)
      .filter(key => key.startsWith(monthKey))
      .flatMap(key => tasksByDate[key]);
    return {
      total: inMonth.length,
      high: inMonth.filter((t) => t.priority === "High").length,
      completed: inMonth.filter((t) => t.status === "Completed" || t.completed).length,
    };
  }, [tasksByDate, year, month]);

  const gridDays = useMemo(() => {
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const cells = [];
    for (let i = startOffset - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, inMonth: false, y: month === 0 ? year - 1 : year, m: month === 0 ? 11 : month - 1 });
    }
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, inMonth: true, y: year, m: month });
    while (cells.length < 42) {
      const idx = cells.length - (startOffset + daysInMonth) + 1;
      cells.push({ day: idx, inMonth: false, y: month === 11 ? year + 1 : year, m: month === 11 ? 0 : month + 1 });
    }
    return cells;
  }, [year, month]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(anchorDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return { day: d.getDate(), y: d.getFullYear(), m: d.getMonth() };
    });
  }, [anchorDate]);

  const goPrev = () => {
    if (viewMode === "month") setAnchorDate(new Date(year, month - 1, 1));
    else setAnchorDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; });
  };
  const goNext = () => {
    if (viewMode === "month") setAnchorDate(new Date(year, month + 1, 1));
    else setAnchorDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; });
  };
  const goToday = () => setAnchorDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));

  // Sync the day-carousel position whenever we enter week view or the anchor week changes.
  // weekJumpTargetRef lets goPrevDay/goNextDay land on the first/last day when crossing a week boundary.
  // useLayoutEffect + clientWidth-based scrollLeft (instead of a child's offsetLeft) guarantees the
  // reset happens synchronously before paint, so you never briefly see the previous week's day.
  useLayoutEffect(() => {
    if (viewMode !== "week") return;
    let startIdx;
    if (weekJumpTargetRef.current === "start") startIdx = 0;
    else if (weekJumpTargetRef.current === "end") startIdx = 6;
    else {
      const idx = weekDays.findIndex((c) => isToday(c.y, c.m, c.day));
      startIdx = idx >= 0 ? idx : 0;
    }
    weekJumpTargetRef.current = null;
    setWeekDayIndex(startIdx);
    const el = weekScrollRef.current;
    if (el) {
      el.scrollLeft = startIdx * el.clientWidth;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, anchorDate]);

  const scrollToDayIndex = (idx) => {
    const el = weekScrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(6, idx));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
    setWeekDayIndex(clamped);
  };

  const goPrevDay = () => {
    if (weekDayIndex === 0) {
      weekJumpTargetRef.current = "end";
      goPrev(); // shifts anchorDate back a week; effect above lands on the last day
    } else {
      scrollToDayIndex(weekDayIndex - 1);
    }
  };

  const goNextDay = () => {
    if (weekDayIndex === 6) {
      weekJumpTargetRef.current = "start";
      goNext(); // shifts anchorDate forward a week; effect above lands on the first day
    } else {
      scrollToDayIndex(weekDayIndex + 1);
    }
  };

  const handleWeekScroll = () => {
    const el = weekScrollRef.current;
    if (!el) return;
    clearTimeout(el._scrollTimeout);
    el._scrollTimeout = setTimeout(() => {
      const width = el.clientWidth || 1;
      const idx = Math.round(el.scrollLeft / width);
      setWeekDayIndex(Math.max(0, Math.min(6, idx)));
    }, 100);
  };

  // Month/Year picker functions
  const handleMonthSelect = (selectedMonth) => {
    setAnchorDate(new Date(year, selectedMonth, 1));
    setShowMonthPicker(false);
  };

  const handleYearSelect = (selectedYear) => {
    setAnchorDate(new Date(selectedYear, month, 1));
    setShowYearPicker(false);
  };

  const goToYear = (delta) => {
    setAnchorDate(new Date(year + delta, month, 1));
  };

  const isToday = (y, m, d) => y === today.getFullYear() && m === today.getMonth() && d === today.getDate();

  const priorityDotClass = (p) => ({ High: styles["dot-high"], Medium: styles["dot-medium"], Low: styles["dot-low"] }[p] || "");
  const priorityBadgeClass = (p) => ({ High: styles["badge-high"], Medium: styles["badge-medium"], Low: styles["badge-low"] }[p] || "");
  const categoryBadgeClass = (c) => ({ 
    Design: styles["category-design"], 
    Marketing: styles["category-marketing"], 
    Content: styles["category-content"], 
    Development: styles["category-development"], 
    Research: styles["category-research"], 
    Documentation: styles["category-documentation"] 
  }[c] || "");

  const openDay = (y, m, d) => {
    const key = toDateKey(y, m, d);
    const dateObj = new Date(y, m, d);
    const todayObj = new Date();
    todayObj.setHours(0, 0, 0, 0);
    
    // Check if the date is in the past
    const isPastDate = dateObj < todayObj;
    
    setSelectedDate({ 
      key, 
      label: `${MONTH_NAMES[m]} ${d}, ${y}`,
      isPast: isPastDate 
    });
    setEditingId(null);
    setShowAddForm(false);
    setDeleteConfirmId(null);
  };

  const closeModal = () => {
    if (!isActionInProgress) {
      setSelectedDate(null);
      setEditingId(null);
      setShowAddForm(false);
      setDeleteConfirmId(null);
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditDraft({ 
      title: task.title, 
      description: task.description || '',
      priority: task.priority, 
      category: task.category || 'Design' 
    });
  };

  const saveEdit = async (id) => {
    // Validate Title
    if (!editDraft.title.trim()) {
      showToast('error', 'Please enter a task title.', 'Missing Title');
      return;
    }

    // Validate Description
    if (!editDraft.description.trim()) {
      showToast('error', 'Please enter a task description.', 'Missing Description');
      return;
    }

    setIsActionInProgress(true);
    const result = await updateTask(id, { 
      title: editDraft.title.trim(), 
      description: editDraft.description.trim(),
      priority: editDraft.priority,
      category: editDraft.category
    });
    setEditingId(null);
    setIsActionInProgress(false);
    if (result.success) {
      showToast('success', `Task "${editDraft.title}" has been updated.`, 'Task Updated');
    } else {
      showToast('error', 'Failed to update task', 'Error');
    }
  };

  const confirmDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const deleteTaskHandler = async (id) => {
    setIsActionInProgress(true);
    const task = tasks.find(t => t.id === id);
    const result = await deleteTask(id);
    setDeleteConfirmId(null);
    setEditingId(null);
    setIsActionInProgress(false);
    if (result.success && task) {
      showToast('success', `Task "${task.title}" has been deleted.`, 'Task Deleted');
    } else {
      showToast('error', 'Failed to delete task', 'Error');
    }
  };

  const submitAdd = async () => {
    // Validate Title
    if (!addDraft.title.trim()) {
      showToast('error', 'Please enter a task title.', 'Missing Title');
      return;
    }

    // Validate Description
    if (!addDraft.description.trim()) {
      showToast('error', 'Please enter a task description.', 'Missing Description');
      return;
    }

    if (!selectedDate) return;
    
    // Check if the selected date is in the past
    const selectedKey = selectedDate.key;
    const todayObj = new Date();
    todayObj.setHours(0, 0, 0, 0);
    const selectedDateObj = new Date(selectedKey + 'T00:00:00');
    
    if (selectedDateObj < todayObj) {
      showToast('error', 'Cannot add tasks to past dates. Please select a future date.', 'Invalid Date');
      setShowAddForm(false);
      return;
    }
    
    setIsActionInProgress(true);
    
    const taskTitle = addDraft.title.trim();
    
    const newTask = {
      id: Date.now(),
      title: taskTitle,
      description: addDraft.description.trim(),
      date: selectedDate.key,
      priority: addDraft.priority,
      category: addDraft.category,
      status: 'Pending',
      dueDate: selectedDate.label,
      dueSort: new Date(selectedDate.key + 'T00:00:00').getTime(),
      completed: false,
      assignees: ['You'],
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      attachments: 0,
      comments: 0,
    };
    
    const result = await addTask(newTask);
    
    if (result.success) {
      showToast('success', `Task "${taskTitle}" has been created.`, 'Task Created');
    } else {
      showToast('error', 'Failed to create task', 'Error');
    }
    
    setAddDraft({ title: "", description: "", priority: "Medium", category: "Design" });
    setShowAddForm(false);
    setIsActionInProgress(false);
  };

  const handleDrop = async (y, m, d) => {
    const key = toDateKey(y, m, d);
    if (dragTaskId != null) {
      const task = tasks.find(t => t.id === dragTaskId);
      const dateObj = new Date(y, m, d);
      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const result = await updateTask(dragTaskId, { 
        date: key,
        dueDate: formattedDate
      });
      if (result.success && task) {
        showToast('success', `Task "${task.title}" moved to ${formattedDate}`, 'Task Moved');
      }
    }
    setDragTaskId(null);
    setDragOverKey(null);
  };

  const selectedTasks = selectedDate ? tasksByDate[selectedDate.key] || [] : [];

  const renderChip = (t) => (
    <span
      key={t.id}
      className={`${styles["cal-chip"]} ${t.status === "Completed" || t.completed ? styles["cal-chip-done"] : ""}`}
      draggable
      onDragStart={(e) => { e.stopPropagation(); setDragTaskId(t.id); }}
      onDragEnd={() => setDragTaskId(null)}
    >
      <span className={`${styles["cal-chip-dot"]} ${priorityDotClass(t.priority)}`} />
      <span className={styles["cal-chip-text"]}>{t.title}</span>
    </span>
  );

  // Render modal using ReactDOM.createPortal
  const renderModal = () => {
    if (!selectedDate) return null;

    const modalContent = (
      <div 
        className={`${styles["cal-modal-overlay"]} ${isActionInProgress ? styles["cal-modal-processing"] : ""}`} 
        onClick={closeModal}
      >
        <div className={styles["cal-modal"]} onClick={(e) => e.stopPropagation()}>
          <div className={styles["cal-modal-header"]}>
            <h3 className={styles["cal-modal-title"]}>{selectedDate.label}</h3>
            <button 
              className={styles["cal-modal-close"]} 
              onClick={closeModal} 
              aria-label="Close"
              disabled={isActionInProgress || isLoading}
            >
              <Icon name="x" className={styles["cal-modal-close-icon"]} />
            </button>
          </div>

          {selectedTasks.length === 0 && !showAddForm && (
            <div className={styles["cal-modal-empty"]}>
              <Icon name="calendar" className={styles["cal-modal-empty-icon"]} />
              <p>No rituals scheduled for this day.</p>
            </div>
          )}

          <div className={styles["cal-modal-list"]}>
            {selectedTasks.map((t) => {
              if (deleteConfirmId === t.id) {
                return (
                  <div key={t.id} className={styles["cal-delete-confirm"]}>
                    <p className={styles["cal-delete-text"]}>
                      Are you sure you want to delete <strong>"{t.title}"</strong>?
                    </p>
                    <div className={styles["cal-delete-actions"]}>
                      <button 
                        className={styles["cal-delete-cancel"]} 
                        onClick={cancelDelete}
                        disabled={isActionInProgress || isLoading}
                      >
                        Cancel
                      </button>
                      <button 
                        className={styles["cal-delete-confirm-btn"]} 
                        onClick={() => deleteTaskHandler(t.id)}
                        disabled={isActionInProgress || isLoading}
                      >
                        {isActionInProgress || isLoading ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                    </div>
                  </div>
                );
              }

              return editingId === t.id ? (
                <div key={t.id} className={styles["cal-modal-item"]}>
                <div className={styles["cal-form-group"]}>
                  <label className={styles["cal-form-label"]}>
                    Task Title <span className={styles["cal-required-star"]}>*</span>
                  </label>
                  <input
                    className={styles["cal-input"]}
                    value={editDraft.title}
                    onChange={(e) => setEditDraft((d) => ({ ...d, title: e.target.value }))}
                    placeholder="Enter task title"
                    autoFocus
                    disabled={isActionInProgress || isLoading}
                  />
                </div>
                <div className={styles["cal-form-group"]}>
                  <label className={styles["cal-form-label"]}>
                    Description <span className={styles["cal-required-star"]}>*</span>
                  </label>
                  <textarea
                    className={styles["cal-textarea"]}
                    value={editDraft.description}
                    onChange={(e) => setEditDraft((d) => ({ ...d, description: e.target.value }))}
                    placeholder="Enter task description"
                    rows="2"
                    disabled={isActionInProgress || isLoading}
                  />
                </div>
                <div className={styles["cal-form-row"]}>
                  <div className={styles["cal-form-group"]}>
                    <label className={styles["cal-form-label"]}>Priority</label>
                    <select 
                      className={styles["cal-select"]} 
                      value={editDraft.priority} 
                      onChange={(e) => setEditDraft((d) => ({ ...d, priority: e.target.value }))}
                      disabled={isActionInProgress || isLoading}
                    >
                      {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className={styles["cal-form-group"]}>
                    <label className={styles["cal-form-label"]}>Category</label>
                    <select 
                      className={styles["cal-select"]} 
                      value={editDraft.category} 
                      onChange={(e) => setEditDraft((d) => ({ ...d, category: e.target.value }))}
                      disabled={isActionInProgress || isLoading}
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className={styles["cal-form-actions"]}>
                  <button 
                    className={styles["cal-btn-primary"]} 
                    onClick={() => saveEdit(t.id)}
                    disabled={isActionInProgress || isLoading}
                  >
                    {isActionInProgress || isLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    className={styles["cal-btn-ghost"]} 
                    onClick={() => setEditingId(null)}
                    disabled={isActionInProgress || isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Display mode
              <div key={t.id} className={styles["cal-modal-item"]}>
                <div className={styles["cal-modal-item-top"]}>
                  <span className={styles["cal-modal-item-title"]}>{t.title}</span>
                  <div className={styles["cal-modal-item-icons"]}>
                    <button 
                      className={styles["cal-icon-btn"]} 
                      onClick={() => startEdit(t)} 
                      aria-label="Edit"
                      disabled={isActionInProgress || isLoading}
                    >
                      <Icon name="edit" className={styles["cal-icon-btn-svg"]} />
                    </button>
                    <button 
                      className={styles["cal-icon-btn"]} 
                      onClick={() => confirmDelete(t.id)} 
                      aria-label="Delete"
                      disabled={isActionInProgress || isLoading}
                    >
                      <Icon name="trash" className={styles["cal-icon-btn-svg"]} />
                    </button>
                  </div>
                </div>
                {t.description && (
                  <p className={styles["cal-modal-item-description"]}>{t.description}</p>
                )}
                <div className={styles["cal-modal-item-badges"]}>
                  <span className={`${styles["cal-badge"]} ${priorityBadgeClass(t.priority)}`}>{t.priority}</span>
                  <span className={`${styles["cal-badge"]} ${categoryBadgeClass(t.category || 'Design')}`}>{t.category || 'Design'}</span>
                </div>
              </div>
            );
            })}
          </div>

          {showAddForm ? (
            selectedDate && selectedDate.isPast ? (
              <div className={styles["cal-past-date-message"]}>
                <span className={styles["cal-past-date-icon"]}>⛔</span>
                <p>Cannot add tasks to past dates.</p>
                <button 
                  className={styles["cal-btn-ghost"]} 
                  onClick={() => setShowAddForm(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <div className={styles["cal-modal-item"]}>
                <div className={styles["cal-form-group"]}>
                  <label className={styles["cal-form-label"]}>
                    Task Title <span className={styles["cal-required-star"]}>*</span>
                  </label>
                  <input
                    className={styles["cal-input"]}
                    placeholder="Enter task title"
                    value={addDraft.title}
                    onChange={(e) => setAddDraft((d) => ({ ...d, title: e.target.value }))}
                    autoFocus
                    disabled={isActionInProgress || isLoading || (selectedDate && selectedDate.isPast)}
                  />
                </div>
                <div className={styles["cal-form-group"]}>
                  <label className={styles["cal-form-label"]}>
                    Description <span className={styles["cal-required-star"]}>*</span>
                  </label>
                  <textarea
                    className={styles["cal-textarea"]}
                    placeholder="Enter task description"
                    value={addDraft.description}
                    onChange={(e) => setAddDraft((d) => ({ ...d, description: e.target.value }))}
                    rows="2"
                    disabled={isActionInProgress || isLoading || (selectedDate && selectedDate.isPast)}
                  />
                </div>
                <div className={styles["cal-form-row"]}>
                  <div className={styles["cal-form-group"]}>
                    <label className={styles["cal-form-label"]}>Priority</label>
                    <select 
                      className={styles["cal-select"]} 
                      value={addDraft.priority} 
                      onChange={(e) => setAddDraft((d) => ({ ...d, priority: e.target.value }))}
                      disabled={isActionInProgress || isLoading || (selectedDate && selectedDate.isPast)}
                    >
                      {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className={styles["cal-form-group"]}>
                    <label className={styles["cal-form-label"]}>Category</label>
                    <select 
                      className={styles["cal-select"]} 
                      value={addDraft.category} 
                      onChange={(e) => setAddDraft((d) => ({ ...d, category: e.target.value }))}
                      disabled={isActionInProgress || isLoading || (selectedDate && selectedDate.isPast)}
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className={styles["cal-form-actions"]}>
                  <button 
                    className={styles["cal-btn-primary"]} 
                    onClick={submitAdd}
                    disabled={isActionInProgress || isLoading || (selectedDate && selectedDate.isPast)}
                  >
                    {isActionInProgress || isLoading ? 'Adding...' : 'Add task'}
                  </button>
                  <button 
                    className={styles["cal-btn-ghost"]} 
                    onClick={() => setShowAddForm(false)}
                    disabled={isActionInProgress || isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )
          ) : (
            <button 
              className={`${styles["cal-add-trigger"]} ${selectedDate && selectedDate.isPast ? styles["cal-add-trigger-disabled"] : ""}`} 
              onClick={() => {
                if (selectedDate && !selectedDate.isPast) {
                  setShowAddForm(true);
                } else {
                  showToast('error', 'Cannot add tasks to past dates.', 'Invalid Date');
                }
              }}
              disabled={isActionInProgress || isLoading || (selectedDate && selectedDate.isPast)}
            >
              <Icon name="plus" className={styles["cal-cell-add-icon"]} /> 
              {selectedDate && selectedDate.isPast ? 'Past date - cannot add tasks' : 'Add a task for this day'}
            </button>
          )}
        </div>
      </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById('root'));
  };

  return (
    <div className={styles["cal-container"]}>
      {/* Toast Notification */}
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          title={toast.title}
          onClose={() => setToast(null)}
        />
      )}

      {/* Background Decorations */}
      <div className={styles["cal-bg"]}>
        <div className={styles["cal-bg-orb"]} />
        <div className={styles["cal-bg-orb"]} />
        <div className={styles["cal-bg-orb"]} />
        <div className={styles["cal-bg-grid"]} />
        <div className={styles["cal-bg-glow"]} />
      </div>

      <div className={styles["cal-content-wrapper"]}>
        <div className={styles["cal-header"]}>
          <div>
            <h2 className={styles["cal-title"]}>Calendar</h2>
            <p className={styles["cal-sub"]}>See where your rituals land this month.</p>
          </div>

          <div className={styles["cal-nav"]}>
            <div className={styles["cal-view-toggle"]}>
              <button
                className={`${styles["cal-toggle-btn"]} ${viewMode === "month" ? styles["cal-toggle-active"] : ""}`}
                onClick={() => setViewMode("month")}
              >
                Month
              </button>
              <button
                className={`${styles["cal-toggle-btn"]} ${viewMode === "week" ? styles["cal-toggle-active"] : ""}`}
                onClick={() => setViewMode("week")}
              >
                Week
              </button>
            </div>

            <button className={styles["cal-today-btn"]} onClick={goToday}>Today</button>

            {/* Month/Year Picker */}
            <div className={styles["cal-month-picker-wrapper"]}>
              <div className={styles["cal-month-switcher"]}>
                <button className={styles["cal-arrow-btn"]} onClick={goPrev} aria-label="Previous">
                  <Icon name="chevronLeft" className={styles["cal-arrow-icon"]} />
                </button>
                
                <div className={styles["cal-month-year-display"]}>
                  <button 
                    className={styles["cal-month-btn"]}
                    onClick={() => setShowMonthPicker(!showMonthPicker)}
                  >
                    {MONTH_NAMES[month]}
                    <Icon name="chevronDown" className={styles["cal-chevron-icon"]} />
                  </button>
                  <button 
                    className={styles["cal-year-btn"]}
                    onClick={() => setShowYearPicker(!showYearPicker)}
                  >
                    {year}
                    <Icon name="chevronDown" className={styles["cal-chevron-icon"]} />
                  </button>
                </div>

                <button className={styles["cal-arrow-btn"]} onClick={goNext} aria-label="Next">
                  <Icon name="chevronRight" className={styles["cal-arrow-icon"]} />
                </button>
              </div>

              {/* Month Picker Dropdown */}
              {showMonthPicker && (
                <div className={styles["cal-month-dropdown"]} ref={monthPickerRef}>
                  {MONTH_NAMES.map((monthName, index) => (
                    <button
                      key={index}
                      className={`${styles["cal-month-option"]} ${month === index ? styles["cal-month-option-active"] : ""}`}
                      onClick={() => handleMonthSelect(index)}
                    >
                      {monthName}
                    </button>
                  ))}
                </div>
              )}

              {/* Year Picker Dropdown */}
              {showYearPicker && (
                <div className={styles["cal-year-dropdown"]} ref={yearPickerRef}>
                  <div className={styles["cal-year-nav"]}>
                    <button onClick={() => goToYear(-5)} className={styles["cal-year-nav-btn"]}>
                      <Icon name="chevronLeft" className={styles["cal-arrow-icon"]} />
                      -5
                    </button>
                    <button onClick={() => goToYear(-1)} className={styles["cal-year-nav-btn"]}>
                      <Icon name="chevronLeft" className={styles["cal-arrow-icon"]} />
                    </button>
                    <span className={styles["cal-year-label"]}>{year}</span>
                    <button onClick={() => goToYear(1)} className={styles["cal-year-nav-btn"]}>
                      <Icon name="chevronRight" className={styles["cal-arrow-icon"]} />
                    </button>
                    <button onClick={() => goToYear(5)} className={styles["cal-year-nav-btn"]}>
                      +5
                      <Icon name="chevronRight" className={styles["cal-arrow-icon"]} />
                    </button>
                  </div>
                  <div className={styles["cal-year-grid"]}>
                    {Array.from({ length: 21 }, (_, i) => year - 10 + i).map((y) => (
                      <button
                        key={y}
                        className={`${styles["cal-year-option"]} ${year === y ? styles["cal-year-option-active"] : ""}`}
                        onClick={() => handleYearSelect(y)}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mini stats + legend */}
        <div className={styles["cal-substrip"]}>
          <div className={styles["cal-mini-stats"]}>
            <span className={styles["cal-mini-stat"]}>
              <span className={styles["stat-icon"]}>📋</span>
              <strong>{monthStats.total}</strong> this month
            </span>
            <span className={styles["cal-mini-stat"]}>
              <span className={styles["stat-icon"]}>🔴</span>
              <strong>{monthStats.high}</strong> high priority
            </span>
            <span className={styles["cal-mini-stat"]}>
              <span className={styles["stat-icon"]}>✅</span>
              <strong>{monthStats.completed}</strong> completed
            </span>
          </div>
          <div className={styles["cal-legend"]}>
            {PRIORITIES.map((p) => (
              <span key={p} className={styles["cal-legend-item"]}>
                <span className={`${styles["cal-chip-dot"]} ${priorityDotClass(p)}`} /> {p}
              </span>
            ))}
          </div>
        </div>

        {viewMode === "month" ? (
          <div className={styles["cal-grid-card"]}>
            <div className={styles["cal-weekdays"]}>
              {WEEKDAYS.map((w) => <span key={w} className={styles["cal-weekday"]}>{w}</span>)}
            </div>

            <div className={styles["cal-grid"]}>
              {gridDays.map((cell, i) => {
                const key = toDateKey(cell.y, cell.m, cell.day);
                const dayTasks = tasksByDate[key] || [];
                const visible = dayTasks.slice(0, 2);
                const overflow = dayTasks.length - visible.length;
                const todayFlag = cell.inMonth && isToday(cell.y, cell.m, cell.day);
                const isDragOver = dragOverKey === key;

                return (
                  <div
                    key={i}
                    className={`${styles["cal-cell"]} ${!cell.inMonth ? styles["cal-cell-muted"] : ""} ${todayFlag ? styles["cal-cell-today"] : ""} ${isDragOver ? styles["cal-cell-dragover"] : ""}`}
                    onClick={() => openDay(cell.y, cell.m, cell.day)}
                    onDragOver={(e) => { e.preventDefault(); setDragOverKey(key); }}
                    onDragLeave={() => setDragOverKey((k) => (k === key ? null : k))}
                    onDrop={(e) => { e.preventDefault(); handleDrop(cell.y, cell.m, cell.day); }}
                  >
                    <div className={styles["cal-cell-top"]}>
                      <span className={`${styles["cal-cell-day"]} ${todayFlag ? styles["cal-cell-day-today"] : ""}`}>
                        {cell.day}
                      </span>
                      <button
                        className={styles["cal-cell-add"]}
                        onClick={(e) => { e.stopPropagation(); openDay(cell.y, cell.m, cell.day); setShowAddForm(true); }}
                        aria-label="Add task"
                        disabled={isLoading}
                      >
                        <Icon name="plus" className={styles["cal-cell-add-icon"]} />
                      </button>
                    </div>
                                  
                    <div className={styles["cal-cell-tasks"]}>
                      {dayTasks.slice(0, 2).map((t) => (
                        <span
                          key={t.id}
                          className={`${styles["cal-chip"]} ${t.status === "Completed" || t.completed ? styles["cal-chip-done"] : ""}`}
                          draggable
                          onDragStart={(e) => { e.stopPropagation(); setDragTaskId(t.id); }}
                          onDragEnd={() => setDragTaskId(null)}
                          title={t.title}
                        >
                          <span className={`${styles["cal-chip-dot"]} ${priorityDotClass(t.priority)}`} />
                          <span className={styles["cal-chip-text"]}>{t.title}</span>
                        </span>
                      ))}
                      {dayTasks.length > 2 && <span className={styles["cal-chip-more"]}>+{dayTasks.length - 2} more</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className={styles["cal-week-wrap"]}>
            {/* Mobile day-carousel controls: prev/next day, like switching between images */}
            <div className={styles["cal-week-carousel-nav"]}>
              <button className={styles["cal-arrow-btn"]} onClick={goPrevDay} aria-label="Previous day">
                <Icon name="chevronLeft" className={styles["cal-arrow-icon"]} />
              </button>
              <span className={styles["cal-week-carousel-label"]}>
                {weekDays[weekDayIndex] &&
                  `${WEEKDAYS[new Date(weekDays[weekDayIndex].y, weekDays[weekDayIndex].m, weekDays[weekDayIndex].day).getDay()]}, ${MONTH_NAMES[weekDays[weekDayIndex].m]} ${weekDays[weekDayIndex].day}`}
              </span>
              <button className={styles["cal-arrow-btn"]} onClick={goNextDay} aria-label="Next day">
                <Icon name="chevronRight" className={styles["cal-arrow-icon"]} />
              </button>
            </div>

            <div className={styles["cal-week-grid"]} ref={weekScrollRef} onScroll={handleWeekScroll}>
              {weekDays.map((cell) => {
                const key = toDateKey(cell.y, cell.m, cell.day);
                const dayTasks = tasksByDate[key] || [];
                const todayFlag = isToday(cell.y, cell.m, cell.day);
                const isDragOver = dragOverKey === key;

                return (
                  <div
                    key={key}
                    className={`${styles["cal-week-col"]} ${todayFlag ? styles["cal-week-col-today"] : ""} ${isDragOver ? styles["cal-cell-dragover"] : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOverKey(key); }}
                    onDragLeave={() => setDragOverKey((k) => (k === key ? null : k))}
                    onDrop={(e) => { e.preventDefault(); handleDrop(cell.y, cell.m, cell.day); }}
                  >
                    <div className={styles["cal-week-col-header"]}>
                      <span className={styles["cal-week-col-dayname"]}>{WEEKDAYS[new Date(cell.y, cell.m, cell.day).getDay()]}</span>
                      <span className={`${styles["cal-week-col-daynum"]} ${todayFlag ? styles["cal-cell-day-today"] : ""}`}>{cell.day}</span>
                    </div>

                    <div className={styles["cal-week-col-tasks"]}>
                      {dayTasks.map((t) => (
                        <div
                          key={t.id}
                          className={`${styles["cal-week-chip"]} ${t.status === "Completed" || t.completed ? styles["cal-chip-done"] : ""}`}
                          draggable
                          onDragStart={() => setDragTaskId(t.id)}
                          onDragEnd={() => setDragTaskId(null)}
                          onClick={() => openDay(cell.y, cell.m, cell.day)}
                          title={t.title}
                        >
                          <span className={`${styles["cal-chip-dot"]} ${priorityDotClass(t.priority)}`} />
                          <span className={styles["cal-week-chip-text"]}>{t.title}</span>
                        </div>
                      ))}
                      <button 
                        className={styles["cal-week-add"]} 
                        onClick={() => { openDay(cell.y, cell.m, cell.day); setShowAddForm(true); }}
                        disabled={isLoading}
                      >
                        <Icon name="plus" className={styles["cal-cell-add-icon"]} /> Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile dot indicators, tap to jump to a specific day */}
            <div className={styles["cal-week-dots"]}>
              {weekDays.map((_, idx) => (
                <button
                  key={idx}
                  className={`${styles["cal-week-dot"]} ${idx === weekDayIndex ? styles["cal-week-dot-active"] : ""}`}
                  onClick={() => scrollToDayIndex(idx)}
                  aria-label={`Go to day ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Render modal via Portal */}
      {renderModal()}
    </div>
  );
}