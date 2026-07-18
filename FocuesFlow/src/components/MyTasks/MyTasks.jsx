import React, { useState } from "react";
import { useTasks } from "../Context/TaskContext";
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
    getCompletedCount 
  } = useTasks();
  
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [hoveredTask, setHoveredTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit state
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
  
  // Edit error state
  const [editErrors, setEditErrors] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  
  // Delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const categories = ["All", "Design", "Marketing", "Content", "Development", "Research", "Documentation"];
  const priorities = ["All", "High", "Medium", "Low"];

  // Priority order for sorting
  const priorityOrder = { High: 0, Medium: 1, Low: 2 };

  // Get today's date for validation
  const today = new Date().toISOString().split('T')[0];

  // Stats from context
  const stats = {
    total: getTaskCount(),
    completed: getCompletedCount(),
    inProgress: getPendingCount(),
    highPriority: tasks.filter(t => t.priority === "High" && !t.completed).length,
  };

  // Modal handlers
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

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleSaveTask = (taskData) => {
    let hasError = false;
    let errorMessage = '';
    let errorTitle = '';
    
    // Handle both old format (categories array) and new format (category string)
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
    
    // Create new task with formatted due date
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
    
    addTask(newTask);
    
    showToast(
      'success',
      `Task "${taskData.title}" has been created successfully.`,
      'Task Created!'
    );
  
    setTimeout(() => {
      setIsModalOpen(false);
      setIsSubmitting(false);
    }, 1000);
  };

  // ==================== EDIT FUNCTIONS ====================
  const handleEditClick = (task) => {
    setEditingTask(task);
    // Convert formatted date back to YYYY-MM-DD for input
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
    // Reset errors when opening
    setEditErrors({ title: '', description: '', dueDate: '' });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    // Clear error for this field when user types
    if (editErrors[e.target.name]) {
      setEditErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleEditSubmit = () => {
    // Reset errors
    setEditErrors({ title: '', description: '', dueDate: '' });
    
    let hasError = false;
    const errors = { title: '', description: '', dueDate: '' };

    // Validate Title
    if (!editForm.title.trim()) {
      errors.title = 'Task title is required';
      hasError = true;
    }

    // Validate Description
    if (!editForm.description.trim()) {
      errors.description = 'Description is required';
      hasError = true;
    }

    // Validate Due Date
    if (!editForm.dueDate) {
      errors.dueDate = 'Due date is required';
      hasError = true;
    } else if (editForm.dueDate < today) {
      errors.dueDate = 'Due date cannot be in the past';
      hasError = true;
    }

    if (hasError) {
      setEditErrors(errors);
      // Show toast for the first error
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
    
    updateTask(editingTask.id, updatedTask);
    
    setShowEditModal(false);
    setEditingTask(null);
    setEditErrors({ title: '', description: '', dueDate: '' });
    showToast('success', `Task "${editForm.title}" has been updated.`, 'Task Updated!');
  };

  // ==================== DELETE FUNCTIONS ====================
  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    deleteTask(taskToDelete.id);
    setShowDeleteModal(false);
    showToast('success', `Task "${taskToDelete.title}" has been deleted.`, 'Task Deleted!');
    setTaskToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  // ==================== TOGGLE COMPLETE ====================
  const toggleTaskComplete = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTask(id, { 
        completed: !task.completed,
        status: !task.completed ? 'Completed' : 'Pending'
      });
    }
  };

  // ==================== FILTERING & SORTING ====================
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
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  // ==================== HELPERS ====================
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
    <div className={styles["mytasks-container"]}>
      {/* Background */}
      <div className={styles["mytasks-bg"]}>
        <div className={styles["mytasks-bg-orb"]} />
        <div className={styles["mytasks-bg-orb"]} />
        <div className={styles["mytasks-bg-orb"]} />
        <div className={styles["mytasks-bg-grid"]} />
        <div className={styles["mytasks-bg-glow"]} />
      </div>

      <div className={styles["mytasks-content-wrapper"]}>
        {/* Header */}
        <div className={styles["mytasks-header-section"]}>
          <div className={styles["mytasks-header"]}>
            <div>
              <h1 className={styles["mytasks-title"]}>My Tasks</h1>
              <p className={styles["mytasks-subtitle"]}>
                Manage and track all your tasks in one place
              </p>
            </div>
            <button 
              className={styles["mytasks-new-task-btn"]}
              onClick={handleOpenModal}
            >
              <Icon name="plus" className={styles["mytasks-new-task-icon"]} />
              New Task
            </button>
          </div>

          {/* Stats Row */}
          <div className={styles["mytasks-stats-row"]}>
            <div className={styles["mytasks-stat-box"]}>
              <div className={styles["mytasks-stat-top"]}>
                <div className={`${styles["mytasks-stat-icon-wrap"]} ${styles["icon-total"]}`}>
                  <Icon name="list" className={styles["mytasks-stat-icon"]} />
                </div>
                <span className={styles["mytasks-stat-trend"]}>Total</span>
              </div>
              <span className={styles["mytasks-stat-label"]}>All Tasks</span>
              <span className={styles["mytasks-stat-value"]}>{stats.total}</span>
            </div>

            <div className={styles["mytasks-stat-box"]}>
              <div className={styles["mytasks-stat-top"]}>
                <div className={`${styles["mytasks-stat-icon-wrap"]} ${styles["icon-progress"]}`}>
                  <Icon name="clock" className={styles["mytasks-stat-icon"]} />
                </div>
                <span className={styles["mytasks-stat-trend"]}>Active</span>
              </div>
              <span className={styles["mytasks-stat-label"]}>In Progress</span>
              <span className={styles["mytasks-stat-value"]}>{stats.inProgress}</span>
            </div>

            <div className={styles["mytasks-stat-box"]}>
              <div className={styles["mytasks-stat-top"]}>
                <div className={`${styles["mytasks-stat-icon-wrap"]} ${styles["icon-completed"]}`}>
                  <Icon name="check" className={styles["mytasks-stat-icon"]} />
                </div>
                <span className={styles["mytasks-stat-trend"]}>Done</span>
              </div>
              <span className={styles["mytasks-stat-label"]}>Completed</span>
              <span className={styles["mytasks-stat-value"]}>{stats.completed}</span>
            </div>

            <div className={styles["mytasks-stat-box"]}>
              <div className={styles["mytasks-stat-top"]}>
                <div className={`${styles["mytasks-stat-icon-wrap"]} ${styles["icon-high"]}`}>
                  <Icon name="alertCircle" className={styles["mytasks-stat-icon"]} />
                </div>
                <span className={`${styles["mytasks-stat-trend"]} ${styles["trend-urgent"]}`}>Urgent</span>
              </div>
              <span className={styles["mytasks-stat-label"]}>High Priority</span>
              <span className={`${styles["mytasks-stat-value"]} ${styles["value-urgent"]}`}>{stats.highPriority}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={styles["mytasks-filters"]}>
          <div className={styles["mytasks-search"]}>
            <Icon name="search" className={styles["mytasks-search-icon"]} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles["mytasks-filter-group"]}>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={styles["mytasks-filter-select"]}
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
              className={styles["mytasks-filter-select"]}
            >
              {priorities.map(pri => (
                <option key={pri} value={pri === "All" ? "all" : pri}>
                  {pri} Priority
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs & View */}
        <div className={styles["mytasks-tabs-section"]}>
          <div className={styles["mytasks-tabs"]}>
            {["all", "todo", "done"].map((tab) => (
              <button
                key={tab}
                className={`${styles["mytasks-tab"]} ${
                  activeTab === tab ? styles["mytasks-tab-active"] : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <span className={styles["mytasks-tab-text"]}>
                  {tab === "all" ? "All Tasks" : tab === "todo" ? "To Do" : "Completed"}
                </span>
                <span className={styles["mytasks-tab-badge"]}>
                  {tab === "all"
                    ? tasks.length
                    : tab === "todo"
                    ? tasks.filter((t) => !t.completed).length
                    : tasks.filter((t) => t.completed).length}
                </span>
              </button>
            ))}
          </div>

          <div className={styles["mytasks-view-toggle"]}>
            <button
              className={`${styles["mytasks-view-btn"]} ${
                viewMode === "list" ? styles["mytasks-view-active"] : ""
              }`}
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <Icon name="list" className={styles["mytasks-view-icon"]} />
            </button>
            <button
              className={`${styles["mytasks-view-btn"]} ${
                viewMode === "grid" ? styles["mytasks-view-active"] : ""
              }`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <Icon name="grid" className={styles["mytasks-view-icon"]} />
            </button>
          </div>
        </div>

        {/* Task List/Grid */}
        <div className={styles["mytasks-task-list"]}>
          {filteredTasks.length === 0 ? (
            <div className={styles["mytasks-empty"]}>
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
                } ${hoveredTask === task.id ? styles["mytasks-task-hovered"] : ""}`}
                onMouseEnter={() => setHoveredTask(task.id)}
                onMouseLeave={() => setHoveredTask(null)}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className={styles["mytasks-task-status"]}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskComplete(task.id)}
                    className={styles["mytasks-task-checkbox"]}
                  />
                </div>

                <div className={styles["mytasks-task-content"]}>
                  <div className={styles["mytasks-task-title-row"]}>
                    <h3>{task.title}</h3>
                    <div className={styles["mytasks-task-tags"]}>
                      <span className={`${styles["mytasks-task-priority"]} ${styles[priorityClass(task.priority)]}`}>
                        {task.priority}
                      </span>
                      <span className={styles["mytasks-task-category"]}>
                        {getCategoryIcon(task.category)} {task.category}
                      </span>
                    </div>
                  </div>

                  <p className={styles["mytasks-task-description"]}>{task.description}</p>

                  <div className={styles["mytasks-task-meta"]}>
                    <div className={styles["mytasks-task-meta-left"]}>
                      {task.dueDate && (
                        <span className={styles["mytasks-task-meta-item"]}>
                          <Icon name="calendar" className={styles["mytasks-meta-icon"]} />
                          {task.dueDate}
                        </span>
                      )}
                      <span className={styles["mytasks-task-meta-item"]}>
                        {getStatusIcon(task.status)} {task.status || 'Pending'}
                      </span>
                    </div>
                    <div className={styles["mytasks-task-meta-right"]}>
                      <div className={styles["mytasks-task-avatars"]}>
                        {task.assignees && task.assignees.map((initials, i) => (
                          <span key={i} className={styles["mytasks-avatar"]} style={{ zIndex: task.assignees.length - i }}>
                            {initials}
                          </span>
                        ))}
                      </div>
                      <div className={styles["mytasks-task-actions"]}>
                        <button 
                          className={styles["mytasks-edit-btn"]}
                          onClick={() => handleEditClick(task)}
                          aria-label="Edit task"
                        >
                          <Icon name="edit" className={styles["mytasks-action-icon"]} />
                        </button>
                        <button 
                          className={styles["mytasks-delete-btn"]}
                          onClick={() => handleDeleteClick(task)}
                          aria-label="Delete task"
                        >
                          <Icon name="trash" className={styles["mytasks-action-icon"]} />
                        </button>
                      </div>
                      {task.completed && (
                        <span className={styles["mytasks-task-completed-badge"]}>
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
                  } ${hoveredTask === task.id ? styles["mytasks-grid-hovered"] : ""}`}
                  onMouseEnter={() => setHoveredTask(task.id)}
                  onMouseLeave={() => setHoveredTask(null)}
                >
                  <div className={styles["mytasks-grid-header"]}>
                    <div className={styles["mytasks-grid-status"]}>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskComplete(task.id)}
                        className={styles["mytasks-grid-checkbox"]}
                      />
                    </div>
                    <div className={styles["mytasks-grid-badges"]}>
                      <span className={`${styles["mytasks-task-priority"]} ${styles[priorityClass(task.priority)]}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  <h4 className={styles["mytasks-grid-title"]}>{task.title}</h4>
                  <p className={styles["mytasks-grid-description"]}>{task.description}</p>

                  <div className={styles["mytasks-grid-meta"]}>
                    <div className={styles["mytasks-grid-meta-left"]}>
                      {task.dueDate && (
                        <span className={styles["mytasks-grid-due"]}>
                          <Icon name="calendar" className={styles["mytasks-grid-icon"]} />
                          {task.dueDate}
                        </span>
                      )}
                      <span className={styles["mytasks-grid-status-text"]}>
                        {getStatusIcon(task.status)} {task.status || 'Pending'}
                      </span>
                    </div>
                    <div className={styles["mytasks-grid-actions"]}>
                      <button 
                        className={styles["mytasks-edit-btn"]}
                        onClick={() => handleEditClick(task)}
                        aria-label="Edit task"
                      >
                        <Icon name="edit" className={styles["mytasks-action-icon"]} />
                      </button>
                      <button 
                        className={styles["mytasks-delete-btn"]}
                        onClick={() => handleDeleteClick(task)}
                        aria-label="Delete task"
                      >
                        <Icon name="trash" className={styles["mytasks-action-icon"]} />
                      </button>
                    </div>
                  </div>

                  {task.completed && (
                    <div className={styles["mytasks-grid-completed-badge"]}>
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

      {/* ==================== EDIT MODAL ==================== */}
      {showEditModal && editingTask && (
        <div className={styles["mytasks-modal-overlay"]} onClick={() => {
          setShowEditModal(false);
          setEditErrors({ title: '', description: '', dueDate: '' });
        }}>
          <div className={styles["mytasks-modal"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["mytasks-modal-header"]}>
              <h2>Edit Task</h2>
              <button 
                className={styles["mytasks-modal-close"]}
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
                <label>Task Title <span className={styles["mytasks-required-star"]}>*</span></label>
                <input
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  placeholder="Enter task title"
                  className={editErrors.title ? styles["mytasks-modal-input-error"] : ''}
                />
                {editErrors.title && (
                  <span className={styles["mytasks-modal-error"]}>{editErrors.title}</span>
                )}
              </div>
              
              <div className={styles["mytasks-modal-field"]}>
                <label>Description <span className={styles["mytasks-required-star"]}>*</span></label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  placeholder="Enter task description"
                  rows="3"
                  className={editErrors.description ? styles["mytasks-modal-input-error"] : ''}
                />
                {editErrors.description && (
                  <span className={styles["mytasks-modal-error"]}>{editErrors.description}</span>
                )}
              </div>
              
              <div className={styles["mytasks-modal-row"]}>
                <div className={styles["mytasks-modal-field"]}>
                  <label>Due Date <span className={styles["mytasks-required-star"]}>*</span></label>
                  <input
                    name="dueDate"
                    type="date"
                    value={editForm.dueDate}
                    onChange={handleEditChange}
                    min={today}
                    className={editErrors.dueDate ? styles["mytasks-modal-input-error"] : ''}
                  />
                  {editErrors.dueDate && (
                    <span className={styles["mytasks-modal-error"]}>{editErrors.dueDate}</span>
                  )}
                </div>
                
                <div className={styles["mytasks-modal-field"]}>
                  <label>Priority</label>
                  <select
                    name="priority"
                    value={editForm.priority}
                    onChange={handleEditChange}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              
              <div className={styles["mytasks-modal-row"]}>
                <div className={styles["mytasks-modal-field"]}>
                  <label>Category</label>
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                  >
                    {categories.filter(c => c !== "All").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className={styles["mytasks-modal-field"]}>
                  <label>Assignees (comma separated)</label>
                  <input
                    name="assignees"
                    value={editForm.assignees}
                    onChange={handleEditChange}
                    placeholder="JD, AR"
                  />
                </div>
              </div>
            </div>
            
            <div className={styles["mytasks-modal-footer"]}>
              <button 
                className={styles["mytasks-modal-cancel"]}
                onClick={() => {
                  setShowEditModal(false);
                  setEditErrors({ title: '', description: '', dueDate: '' });
                }}
              >
                Cancel
              </button>
              <button 
                className={styles["mytasks-modal-save"]}
                onClick={handleEditSubmit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== DELETE MODAL ==================== */}
      {showDeleteModal && taskToDelete && (
        <div className={styles["mytasks-modal-overlay"]} onClick={handleDeleteCancel}>
          <div className={styles["mytasks-delete-modal"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["mytasks-delete-icon"]}>🗑️</div>
            <h3>Delete Task?</h3>
            <p>
              Are you sure you want to delete <strong>"{taskToDelete.title}"</strong>?
              <br />
              This action cannot be undone.
            </p>
            <div className={styles["mytasks-delete-actions"]}>
              <button 
                className={styles["mytasks-delete-cancel"]}
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <button 
                className={styles["mytasks-delete-confirm"]}
                onClick={handleDeleteConfirm}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        isSubmitting={isSubmitting}
      />

      {/* Toast Notification */}
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