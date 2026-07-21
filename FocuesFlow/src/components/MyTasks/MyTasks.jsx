import React, { useState } from "react";
import { useTasks } from "../Context/TaskContext";
import { useDarkMode } from "../Context/DarkModeContext";
import styles from "./MyTasks.module.css";
import CreateTaskModal from "../CreateTaskModal/CreateTaskModal";
import ToastNotification from "../ToastNotification/ToastNotification";

function Icon({ name, className }) {
  const paths = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    flame: (
      <path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c1 1 1.5 2.5 1.5 4a4.5 4.5 0 0 1-9 0C7.5 9 12 6 12 2Z" strokeLinecap="round" strokeLinejoin="round" />
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M3 9h18M8 2v4M16 2v4" strokeLinecap="round" />
      </>
    ),
    paperclip: (
      <path d="M21 12.5 12.5 21a4.5 4.5 0 0 1-6.4-6.4l9-9a3 3 0 0 1 4.3 4.3l-8.9 8.9a1.5 1.5 0 0 1-2.1-2.1l8-8" strokeLinecap="round" strokeLinejoin="round" />
    ),
    message: (
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12.5 2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    trending: (
      <path d="M3 17l6-6 4 4 8-8M15 7h6v6" strokeLinecap="round" strokeLinejoin="round" />
    ),
    list: (
      <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" strokeLinecap="round" strokeLinejoin="round" />
    ),
    alertCircle: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5m0 3h.01" strokeLinecap="round" />
      </>
    ),
    plus: (
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
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
    x: <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />,
  };
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export default function MyTasks() {
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    getTaskCount, 
    getPendingCount, 
    getCompletedCount,
    isLoading 
  } = useTasks();
  const { isDarkMode } = useDarkMode();
  
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [hoveredTask, setHoveredTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ 
    title: '', 
    description: '', 
    dueDate: '', 
    priority: 'Medium', 
    category: 'Design',
    assignees: ''
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editErrors, setEditErrors] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const categories = ["All", "Design", "Marketing", "Content", "Development", "Research", "Documentation"];
  const priorities = ["All", "High", "Medium", "Low"];
  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
  const today = new Date().toISOString().split('T')[0];

  const stats = {
    total: getTaskCount(),
    completed: getCompletedCount(),
    inProgress: getPendingCount(),
    highPriority: tasks.filter(t => t.priority === "High" && !t.completed).length,
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setToast(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSubmitting(false);
    setToast(null);
  };

  const showToast = (type, message, title) => {
    setToast({ type, message, title });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleSaveTask = async (taskData) => {
    let hasError = false;
    let errorMessage = '';
    let errorTitle = '';
    
    const categories = taskData.categories || [taskData.category || 'General'];
    const category = categories[0] || 'General';
    
    if (!taskData.title.trim()) {
      hasError = true;
      errorTitle = 'Missing Title';
      errorMessage = 'Please enter a task title to continue.';
    } else if (!taskData.description.trim()) {
      hasError = true;
      errorTitle = 'Missing Description';
      errorMessage = 'Please provide a description for the task.';
    } else if (!taskData.dueDate) {
      hasError = true;
      errorTitle = 'Missing Due Date';
      errorMessage = 'Please select a due date for the task.';
    } else if (taskData.dueDate < today) {
      hasError = true;
      errorTitle = 'Invalid Due Date';
      errorMessage = 'Due date cannot be in the past. Please select a future date.';
    }

    if (hasError) {
      showToast('error', errorMessage, errorTitle);
      return;
    }

    setIsSubmitting(true);
    
    const newTask = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description,
      dueDate: formatDate(taskData.dueDate),
      dueSort: new Date(taskData.dueDate + 'T00:00:00').getTime(),
      priority: taskData.priority || 'Medium',
      status: 'Pending',
      category: category,
      completed: false,
      assignees: ['You'],
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      attachments: 0,
      comments: 0,
    };
    
    const result = await addTask(newTask);
    
    if (result.success) {
      showToast(
        'success',
        `Task "${taskData.title}" has been created successfully.`,
        'Task Created!'
      );
    } else {
      showToast(
        'error',
        'Failed to create task. Please try again.',
        'Error'
      );
    }

    setTimeout(() => {
      setIsModalOpen(false);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    let dueDateValue = '';
    if (task.dueDate) {
      const dateParts = task.dueDate.split(' ');
      const months = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', 
                      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
      if (dateParts.length === 3) {
        const month = months[dateParts[0]];
        const day = dateParts[1].replace(',', '').padStart(2, '0');
        const year = dateParts[2];
        dueDateValue = `${year}-${month}-${day}`;
      }
    }
    setEditForm({
      title: task.title,
      description: task.description,
      dueDate: dueDateValue,
      priority: task.priority,
      category: task.category,
      assignees: task.assignees ? task.assignees.join(', ') : '',
    });
    setEditErrors({ title: '', description: '', dueDate: '' });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    if (editErrors[e.target.name]) {
      setEditErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleEditSubmit = async () => {
    setEditErrors({ title: '', description: '', dueDate: '' });
    
    let hasError = false;
    const errors = { title: '', description: '', dueDate: '' };

    if (!editForm.title.trim()) {
      errors.title = 'Task title is required';
      hasError = true;
    }

    if (!editForm.description.trim()) {
      errors.description = 'Description is required';
      hasError = true;
    }

    if (!editForm.dueDate) {
      errors.dueDate = 'Due date is required';
      hasError = true;
    } else if (editForm.dueDate < today) {
      errors.dueDate = 'Due date cannot be in the past';
      hasError = true;
    }

    if (hasError) {
      setEditErrors(errors);
      const firstError = errors.title || errors.description || errors.dueDate;
      showToast('error', firstError, 'Validation Error');
      return;
    }

    const updatedTask = {
      title: editForm.title,
      description: editForm.description,
      dueDate: editForm.dueDate ? formatDate(editForm.dueDate) : '',
      dueSort: editForm.dueDate ? new Date(editForm.dueDate + 'T00:00:00').getTime() : 0,
      priority: editForm.priority,
      category: editForm.category,
      assignees: editForm.assignees ? editForm.assignees.split(',').map(s => s.trim()).filter(s => s) : [],
    };
    
    const result = await updateTask(editingTask.id, updatedTask);
    
    setShowEditModal(false);
    setEditingTask(null);
    setEditErrors({ title: '', description: '', dueDate: '' });
    
    if (result.success) {
      showToast('success', `Task "${editForm.title}" has been updated.`, 'Task Updated!');
    } else {
      showToast('error', 'Failed to update task. Please try again.', 'Error');
    }
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    const result = await deleteTask(taskToDelete.id);
    setShowDeleteModal(false);
    if (result.success) {
      showToast('success', `Task "${taskToDelete.title}" has been deleted.`, 'Task Deleted!');
    } else {
      showToast('error', 'Failed to delete task. Please try again.', 'Error');
    }
    setTaskToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const toggleTaskComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const result = await updateTask(id, { 
        completed: !task.completed,
        status: !task.completed ? 'Completed' : 'Pending'
      });
      if (!result.success) {
        showToast('error', 'Failed to update task status', 'Error');
      }
    }
  };

  // Updated sorting: newest to oldest by due date
  const filteredTasks = tasks
    .filter((task) => {
      if (activeTab === "all") return true;
      if (activeTab === "todo") return !task.completed;
      if (activeTab === "done") return task.completed;
      return true;
    })
    .filter((task) => {
      if (filterPriority === "all") return true;
      return task.priority === filterPriority;
    })
    .filter((task) => {
      if (filterCategory === "all") return true;
      return task.category === filterCategory;
    })
    .filter((task) => {
      if (!searchTerm) return true;
      return task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             task.description.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      // First: incomplete tasks first
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      
      // Then: sort by due date - newest first (descending)
      // Tasks with no due date go to the bottom
      if (a.dueSort && b.dueSort) {
        return b.dueSort - a.dueSort; // Newest first
      }
      if (a.dueSort) return -1;
      if (b.dueSort) return 1;
      
      // If both have no due date, sort by priority
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const priorityClass = (priority) =>
    ({ High: "priority-high", Medium: "priority-medium", Low: "priority-low" }[priority] || "");

  const getCategoryIcon = (category) => {
    const map = {
      Design: "🎨",
      Marketing: "📊",
      Content: "📝",
      Development: "💻",
      Research: "🔬",
      Documentation: "📚",
    };
    return map[category] || "📋";
  };

  const getStatusIcon = (status) => {
    if (status === "In Progress") return "🔄";
    if (status === "Pending") return "⏳";
    if (status === "Completed") return "✅";
    return "📋";
  };

  return (
    <div className={`${styles["mytasks-container"]} ${isDarkMode ? styles["darkContainer"] : ""}`}>
      <div className={`${styles["mytasks-bg"]} ${isDarkMode ? styles["darkBg"] : ""}`}>
        <div className={styles["mytasks-bg-orb"]} />
        <div className={styles["mytasks-bg-orb"]} />
        <div className={styles["mytasks-bg-orb"]} />
        <div className={`${styles["mytasks-bg-grid"]} ${isDarkMode ? styles["darkBgGrid"] : ""}`} />
        <div className={`${styles["mytasks-bg-glow"]} ${isDarkMode ? styles["darkBgGlow"] : ""}`} />
      </div>

      <div className={styles["mytasks-content-wrapper"]}>
        <div className={styles["mytasks-header-section"]}>
          <div className={styles["mytasks-header"]}>
            <div>
              <h1 className={`${styles["mytasks-title"]} ${isDarkMode ? styles["darkTitle"] : ""}`}>My Tasks</h1>
              <p className={`${styles["mytasks-subtitle"]} ${isDarkMode ? styles["darkSubtitle"] : ""}`}>
                Manage and track all your tasks in one place
              </p>
            </div>
            <button 
              className={`${styles["mytasks-new-task-btn"]} ${isDarkMode ? styles["darkNewTaskBtn"] : ""}`}
              onClick={handleOpenModal}
              disabled={isLoading}
            >
              <Icon name="plus" className={styles["mytasks-new-task-icon"]} />
              New Task
            </button>
          </div>

          <div className={styles["mytasks-stats-row"]}>
            <div className={`${styles["mytasks-stat-box"]} ${isDarkMode ? styles["darkStatBox"] : ""}`}>
              <div className={styles["mytasks-stat-top"]}>
                <div className={`${styles["mytasks-stat-icon-wrap"]} ${styles["icon-total"]} ${isDarkMode ? styles["darkIconTotal"] : ""}`}>
                  <Icon name="list" className={styles["mytasks-stat-icon"]} />
                </div>
                <span className={`${styles["mytasks-stat-trend"]} ${isDarkMode ? styles["darkStatTrend"] : ""}`}>Total</span>
              </div>
              <span className={`${styles["mytasks-stat-label"]} ${isDarkMode ? styles["darkStatLabel"] : ""}`}>All Tasks</span>
              <span className={`${styles["mytasks-stat-value"]} ${isDarkMode ? styles["darkStatValue"] : ""}`}>{stats.total}</span>
            </div>

            <div className={`${styles["mytasks-stat-box"]} ${isDarkMode ? styles["darkStatBox"] : ""}`}>
              <div className={styles["mytasks-stat-top"]}>
                <div className={`${styles["mytasks-stat-icon-wrap"]} ${styles["icon-completed"]} ${isDarkMode ? styles["darkIconCompleted"] : ""}`}>
                  <Icon name="check" className={styles["mytasks-stat-icon"]} />
                </div>
                <span className={`${styles["mytasks-stat-trend"]} ${isDarkMode ? styles["darkStatTrend"] : ""}`}>Done</span>
              </div>
              <span className={`${styles["mytasks-stat-label"]} ${isDarkMode ? styles["darkStatLabel"] : ""}`}>Completed</span>
              <span className={`${styles["mytasks-stat-value"]} ${isDarkMode ? styles["darkStatValue"] : ""}`}>{stats.completed}</span>
            </div>

            <div className={`${styles["mytasks-stat-box"]} ${isDarkMode ? styles["darkStatBox"] : ""}`}>
              <div className={styles["mytasks-stat-top"]}>
                <div className={`${styles["mytasks-stat-icon-wrap"]} ${styles["icon-progress"]} ${isDarkMode ? styles["darkIconProgress"] : ""}`}>
                  <Icon name="clock" className={styles["mytasks-stat-icon"]} />
                </div>
                <span className={`${styles["mytasks-stat-trend"]} ${isDarkMode ? styles["darkStatTrend"] : ""}`}>Active</span>
              </div>
              <span className={`${styles["mytasks-stat-label"]} ${isDarkMode ? styles["darkStatLabel"] : ""}`}>In Progress</span>
              <span className={`${styles["mytasks-stat-value"]} ${isDarkMode ? styles["darkStatValue"] : ""}`}>{stats.inProgress}</span>
            </div>

            <div className={`${styles["mytasks-stat-box"]} ${isDarkMode ? styles["darkStatBox"] : ""}`}>
              <div className={styles["mytasks-stat-top"]}>
                <div className={`${styles["mytasks-stat-icon-wrap"]} ${styles["icon-high"]} ${isDarkMode ? styles["darkIconHigh"] : ""}`}>
                  <Icon name="alertCircle" className={styles["mytasks-stat-icon"]} />
                </div>
                <span className={`${styles["mytasks-stat-trend"]} ${styles["trend-urgent"]} ${isDarkMode ? styles["darkTrendUrgent"] : ""}`}>Urgent</span>
              </div>
              <span className={`${styles["mytasks-stat-label"]} ${isDarkMode ? styles["darkStatLabel"] : ""}`}>High Priority</span>
              <span className={`${styles["mytasks-stat-value"]} ${styles["value-urgent"]} ${isDarkMode ? styles["darkValueUrgent"] : ""}`}>{stats.highPriority}</span>
            </div>
          </div>
        </div>

        <div className={styles["mytasks-filters"]}>
          <div className={`${styles["mytasks-search"]} ${isDarkMode ? styles["darkSearch"] : ""}`}>
            <Icon name="search" className={`${styles["mytasks-search-icon"]} ${isDarkMode ? styles["darkSearchIcon"] : ""}`} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={isDarkMode ? styles["darkSearchInput"] : ""}
            />
          </div>

          <div className={styles["mytasks-filter-group"]}>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`${styles["mytasks-filter-select"]} ${isDarkMode ? styles["darkFilterSelect"] : ""}`}
            >
              {categories.map(cat => (
                <option key={cat} value={cat === "All" ? "all" : cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className={`${styles["mytasks-filter-select"]} ${isDarkMode ? styles["darkFilterSelect"] : ""}`}
            >
              {priorities.map(pri => (
                <option key={pri} value={pri === "All" ? "all" : pri}>
                  {pri} Priority
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles["mytasks-tabs-section"]}>
          <div className={`${styles["mytasks-tabs"]} ${isDarkMode ? styles["darkTabs"] : ""}`}>
            {["all", "todo", "done"].map((tab) => (
              <button
                key={tab}
                className={`${styles["mytasks-tab"]} ${
                  activeTab === tab ? styles["mytasks-tab-active"] : ""
                } ${isDarkMode ? styles["darkTab"] : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                <span className={styles["mytasks-tab-text"]}>
                  {tab === "all" ? "All Tasks" : tab === "todo" ? "To Do" : "Completed"}
                </span>
                <span className={`${styles["mytasks-tab-badge"]} ${isDarkMode ? styles["darkTabBadge"] : ""}`}>
                  {tab === "all"
                    ? tasks.length
                    : tab === "todo"
                    ? tasks.filter((t) => !t.completed).length
                    : tasks.filter((t) => t.completed).length}
                </span>
              </button>
            ))}
          </div>

          <div className={`${styles["mytasks-view-toggle"]} ${isDarkMode ? styles["darkViewToggle"] : ""}`}>
            <button
              className={`${styles["mytasks-view-btn"]} ${
                viewMode === "list" ? styles["mytasks-view-active"] : ""
              } ${isDarkMode ? styles["darkViewBtn"] : ""}`}
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <Icon name="list" className={styles["mytasks-view-icon"]} />
            </button>
            <button
              className={`${styles["mytasks-view-btn"]} ${
                viewMode === "grid" ? styles["mytasks-view-active"] : ""
              } ${isDarkMode ? styles["darkViewBtn"] : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <Icon name="grid" className={styles["mytasks-view-icon"]} />
            </button>
          </div>
        </div>

        <div className={styles["mytasks-task-list"]}>
          {filteredTasks.length === 0 ? (
            <div className={`${styles["mytasks-empty"]} ${isDarkMode ? styles["darkEmpty"] : ""}`}>
              <span className={styles["mytasks-empty-icon"]}>📭</span>
              <h3>No tasks found</h3>
              <p>Try adjusting your filters or create a new task</p>
            </div>
          ) : viewMode === "list" ? (
            filteredTasks.map((task, index) => (
              <div
                key={task.id}
                className={`${styles["mytasks-task-item"]} ${styles[priorityClass(task.priority)]} ${
                  task.completed ? styles["mytasks-task-completed"] : ""
                } ${hoveredTask === task.id ? styles["mytasks-task-hovered"] : ""} ${isDarkMode ? styles["darkTaskItem"] : ""}`}
                onMouseEnter={() => setHoveredTask(task.id)}
                onMouseLeave={() => setHoveredTask(null)}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className={styles["mytasks-task-status"]}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskComplete(task.id)}
                    className={`${styles["mytasks-task-checkbox"]} ${isDarkMode ? styles["darkTaskCheckbox"] : ""}`}
                    disabled={isLoading}
                  />
                </div>

                <div className={styles["mytasks-task-content"]}>
                  <div className={styles["mytasks-task-title-row"]}>
                    <h3 className={isDarkMode ? styles["darkTaskTitle"] : ""}>{task.title}</h3>
                    <div className={styles["mytasks-task-tags"]}>
                      <span className={`${styles["mytasks-task-priority"]} ${styles[priorityClass(task.priority)]} ${isDarkMode ? styles["darkTaskPriority"] : ""}`}>
                        {task.priority}
                      </span>
                      <span className={`${styles["mytasks-task-category"]} ${isDarkMode ? styles["darkTaskCategory"] : ""}`}>
                        {getCategoryIcon(task.category)} {task.category}
                      </span>
                    </div>
                  </div>

                  <p className={`${styles["mytasks-task-description"]} ${isDarkMode ? styles["darkTaskDescription"] : ""}`}>{task.description}</p>

                  <div className={styles["mytasks-task-meta"]}>
                    <div className={styles["mytasks-task-meta-left"]}>
                      {task.dueDate && (
                        <span className={`${styles["mytasks-task-meta-item"]} ${isDarkMode ? styles["darkTaskMetaItem"] : ""}`}>
                          <Icon name="calendar" className={styles["mytasks-meta-icon"]} />
                          {task.dueDate}
                        </span>
                      )}
                      <span className={`${styles["mytasks-task-meta-item"]} ${isDarkMode ? styles["darkTaskMetaItem"] : ""}`}>
                        {getStatusIcon(task.status)} {task.status || 'Pending'}
                      </span>
                    </div>
                    <div className={styles["mytasks-task-meta-right"]}>
                      <div className={styles["mytasks-task-avatars"]}>
                        {task.assignees && task.assignees.map((initials, i) => (
                          <span key={i} className={`${styles["mytasks-avatar"]} ${isDarkMode ? styles["darkAvatar"] : ""}`} style={{ zIndex: task.assignees.length - i }}>
                            {initials}
                          </span>
                        ))}
                      </div>
                      <div className={styles["mytasks-task-actions"]}>
                        <button 
                          className={`${styles["mytasks-edit-btn"]} ${isDarkMode ? styles["darkEditBtn"] : ""}`}
                          onClick={() => handleEditClick(task)}
                          aria-label="Edit task"
                          disabled={isLoading}
                        >
                          <Icon name="edit" className={styles["mytasks-action-icon"]} />
                        </button>
                        <button 
                          className={`${styles["mytasks-delete-btn"]} ${isDarkMode ? styles["darkDeleteBtn"] : ""}`}
                          onClick={() => handleDeleteClick(task)}
                          aria-label="Delete task"
                          disabled={isLoading}
                        >
                          <Icon name="trash" className={styles["mytasks-action-icon"]} />
                        </button>
                      </div>
                      {task.completed && (
                        <span className={`${styles["mytasks-task-completed-badge"]} ${isDarkMode ? styles["darkCompletedBadge"] : ""}`}>
                          <Icon name="check" className={styles["mytasks-badge-icon"]} />
                          Done
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles["mytasks-task-grid"]}>
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`${styles["mytasks-grid-item"]} ${styles[priorityClass(task.priority)]} ${
                    task.completed ? styles["mytasks-grid-completed"] : ""
                  } ${hoveredTask === task.id ? styles["mytasks-grid-hovered"] : ""} ${isDarkMode ? styles["darkGridItem"] : ""}`}
                  onMouseEnter={() => setHoveredTask(task.id)}
                  onMouseLeave={() => setHoveredTask(null)}
                >
                  <div className={styles["mytasks-grid-header"]}>
                    <div className={styles["mytasks-grid-status"]}>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskComplete(task.id)}
                        className={`${styles["mytasks-grid-checkbox"]} ${isDarkMode ? styles["darkGridCheckbox"] : ""}`}
                        disabled={isLoading}
                      />
                    </div>
                    <div className={styles["mytasks-grid-badges"]}>
                      <span className={`${styles["mytasks-task-priority"]} ${styles[priorityClass(task.priority)]} ${isDarkMode ? styles["darkTaskPriority"] : ""}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  <h4 className={`${styles["mytasks-grid-title"]} ${isDarkMode ? styles["darkGridTitle"] : ""}`}>{task.title}</h4>
                  <p className={`${styles["mytasks-grid-description"]} ${isDarkMode ? styles["darkGridDescription"] : ""}`}>{task.description}</p>

                  <div className={styles["mytasks-grid-meta"]}>
                    <div className={styles["mytasks-grid-meta-left"]}>
                      {task.dueDate && (
                        <span className={`${styles["mytasks-grid-due"]} ${isDarkMode ? styles["darkGridDue"] : ""}`}>
                          <Icon name="calendar" className={styles["mytasks-grid-icon"]} />
                          {task.dueDate}
                        </span>
                      )}
                      <span className={`${styles["mytasks-grid-status-text"]} ${isDarkMode ? styles["darkGridStatusText"] : ""}`}>
                        {getStatusIcon(task.status)} {task.status || 'Pending'}
                      </span>
                    </div>
                    <div className={styles["mytasks-grid-actions"]}>
                      <button 
                        className={`${styles["mytasks-edit-btn"]} ${isDarkMode ? styles["darkEditBtn"] : ""}`}
                        onClick={() => handleEditClick(task)}
                        aria-label="Edit task"
                        disabled={isLoading}
                      >
                        <Icon name="edit" className={styles["mytasks-action-icon"]} />
                      </button>
                      <button 
                        className={`${styles["mytasks-delete-btn"]} ${isDarkMode ? styles["darkDeleteBtn"] : ""}`}
                        onClick={() => handleDeleteClick(task)}
                        aria-label="Delete task"
                        disabled={isLoading}
                      >
                        <Icon name="trash" className={styles["mytasks-action-icon"]} />
                      </button>
                    </div>
                  </div>

                  {task.completed && (
                    <div className={`${styles["mytasks-grid-completed-badge"]} ${isDarkMode ? styles["darkGridCompletedBadge"] : ""}`}>
                      <Icon name="check" className={styles["mytasks-grid-badge-icon"]} />
                      Completed
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showEditModal && editingTask && (
        <div className={styles["mytasks-modal-overlay"]} onClick={() => {
          setShowEditModal(false);
          setEditErrors({ title: '', description: '', dueDate: '' });
        }}>
          <div className={`${styles["mytasks-modal"]} ${isDarkMode ? styles["darkModal"] : ""}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles["mytasks-modal-header"]}>
              <h2 className={isDarkMode ? styles["darkModalTitle"] : ""}>Edit Task</h2>
              <button 
                className={`${styles["mytasks-modal-close"]} ${isDarkMode ? styles["darkModalClose"] : ""}`}
                onClick={() => {
                  setShowEditModal(false);
                  setEditErrors({ title: '', description: '', dueDate: '' });
                }}
              >
                <Icon name="x" className={styles["mytasks-modal-close-icon"]} />
              </button>
            </div>
            
            <div className={styles["mytasks-modal-body"]}>
              <div className={styles["mytasks-modal-field"]}>
                <label className={isDarkMode ? styles["darkModalLabel"] : ""}>Task Title <span className={styles["mytasks-required-star"]}>*</span></label>
                <input
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  placeholder="Enter task title"
                  className={`${editErrors.title ? styles["mytasks-modal-input-error"] : ""} ${isDarkMode ? styles["darkModalInput"] : ""}`}
                />
                {editErrors.title && (
                  <span className={styles["mytasks-modal-error"]}>{editErrors.title}</span>
                )}
              </div>
              
              <div className={styles["mytasks-modal-field"]}>
                <label className={isDarkMode ? styles["darkModalLabel"] : ""}>Description <span className={styles["mytasks-required-star"]}>*</span></label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  placeholder="Enter task description"
                  rows="3"
                  className={`${editErrors.description ? styles["mytasks-modal-input-error"] : ""} ${isDarkMode ? styles["darkModalInput"] : ""}`}
                />
                {editErrors.description && (
                  <span className={styles["mytasks-modal-error"]}>{editErrors.description}</span>
                )}
              </div>
              
              <div className={styles["mytasks-modal-row"]}>
                <div className={styles["mytasks-modal-field"]}>
                  <label className={isDarkMode ? styles["darkModalLabel"] : ""}>Due Date <span className={styles["mytasks-required-star"]}>*</span></label>
                  <input
                    name="dueDate"
                    type="date"
                    value={editForm.dueDate}
                    onChange={handleEditChange}
                    min={today}
                    className={`${editErrors.dueDate ? styles["mytasks-modal-input-error"] : ""} ${isDarkMode ? styles["darkModalInput"] : ""} ${isDarkMode ? styles["darkDateInput"] : ""}`}
                  />
                  {editErrors.dueDate && (
                    <span className={styles["mytasks-modal-error"]}>{editErrors.dueDate}</span>
                  )}
                </div>
                
                <div className={styles["mytasks-modal-field"]}>
                  <label className={isDarkMode ? styles["darkModalLabel"] : ""}>Priority</label>
                  <select
                    name="priority"
                    value={editForm.priority}
                    onChange={handleEditChange}
                    className={`${isDarkMode ? styles["darkModalSelect"] : ""}`}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              
              <div className={styles["mytasks-modal-row"]}>
                <div className={styles["mytasks-modal-field"]}>
                  <label className={isDarkMode ? styles["darkModalLabel"] : ""}>Category</label>
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    className={`${isDarkMode ? styles["darkModalSelect"] : ""}`}
                  >
                    {categories.filter(c => c !== "All").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className={styles["mytasks-modal-field"]}>
                  <label className={isDarkMode ? styles["darkModalLabel"] : ""}>Assignees (comma separated)</label>
                  <input
                    name="assignees"
                    value={editForm.assignees}
                    onChange={handleEditChange}
                    placeholder="JD, AR"
                    className={`${isDarkMode ? styles["darkModalInput"] : ""}`}
                  />
                </div>
              </div>
            </div>
            
            <div className={styles["mytasks-modal-footer"]}>
              <button 
                className={`${styles["mytasks-modal-cancel"]} ${isDarkMode ? styles["darkModalCancel"] : ""}`}
                onClick={() => {
                  setShowEditModal(false);
                  setEditErrors({ title: '', description: '', dueDate: '' });
                }}
              >
                Cancel
              </button>
              <button 
                className={`${styles["mytasks-modal-save"]} ${isDarkMode ? styles["darkModalSave"] : ""}`}
                onClick={handleEditSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && taskToDelete && (
        <div className={styles["mytasks-modal-overlay"]} onClick={handleDeleteCancel}>
          <div className={`${styles["mytasks-delete-modal"]} ${isDarkMode ? styles["darkDeleteModal"] : ""}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles["mytasks-delete-icon"]}>🗑️</div>
            <h3 className={isDarkMode ? styles["darkDeleteModalTitle"] : ""}>Delete Task?</h3>
            <p className={isDarkMode ? styles["darkDeleteModalText"] : ""}>
              Are you sure you want to delete <strong>"{taskToDelete.title}"</strong>?
              <br />
              This action cannot be undone.
            </p>
            <div className={styles["mytasks-delete-actions"]}>
              <button 
                className={`${styles["mytasks-delete-cancel"]} ${isDarkMode ? styles["darkDeleteCancel"] : ""}`}
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <button 
                className={`${styles["mytasks-delete-confirm"]} ${isDarkMode ? styles["darkDeleteConfirm"] : ""}`}
                onClick={handleDeleteConfirm}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        isSubmitting={isSubmitting}
      />

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