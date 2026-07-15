import React, { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [hoveredTask, setHoveredTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tasks = [
    {
      id: 1,
      title: "Design System Update",
      priority: "High",
      description:
        "Finalize the color palette for the app. Ensure all semantic tokens are mapped to the new Indigo brand core.",
      dueDate: "Oct 24, 2023",
      attachments: 2,
      comments: 4,
      completed: false,
      category: "Design",
      assignees: ["AR", "JD"],
      created: "Oct 20, 2023",
    },
    {
      id: 2,
      title: "Quarterly Review Deck",
      priority: "Medium",
      description:
        "Gather user engagement metrics from the last 3 months to present to the product steering committee.",
      dueDate: "Oct 26, 2023",
      attachments: 0,
      comments: 2,
      completed: false,
      category: "Marketing",
      assignees: ["AR"],
      created: "Oct 18, 2023",
    },
    {
      id: 3,
      title: "Onboarding Email Sequence",
      priority: "Low",
      description:
        "Draft initial copy for the 5-day welcome sequence for new professional tier users.",
      dueDate: null,
      attachments: 0,
      comments: 1,
      completed: true,
      category: "Content",
      assignees: ["JD", "SM"],
      created: "Oct 15, 2023",
    },
    {
      id: 4,
      title: "API Integration Testing",
      priority: "High",
      description:
        "Test all API endpoints for the new microservices architecture. Ensure proper error handling and response times.",
      dueDate: "Oct 28, 2023",
      attachments: 3,
      comments: 5,
      completed: false,
      category: "Development",
      assignees: ["AR", "JD", "SM"],
      created: "Oct 22, 2023",
    },
    {
      id: 5,
      title: "User Research Interviews",
      priority: "Medium",
      description:
        "Conduct user interviews to gather feedback on the new feature set. Prepare interview questions and schedule sessions.",
      dueDate: "Nov 2, 2023",
      attachments: 1,
      comments: 3,
      completed: false,
      category: "Research",
      assignees: ["JD"],
      created: "Oct 19, 2023",
    },
    {
      id: 6,
      title: "Documentation Update",
      priority: "Low",
      description:
        "Update the API documentation with the latest changes and endpoints. Include code examples and usage guides.",
      dueDate: "Oct 30, 2023",
      attachments: 0,
      comments: 0,
      completed: false,
      category: "Documentation",
      assignees: ["SM"],
      created: "Oct 21, 2023",
    },
  ];

  const categories = ["All", "Design", "Marketing", "Content", "Development", "Research", "Documentation"];
  const priorities = ["All", "High", "Medium", "Low"];

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    inProgress: tasks.filter(t => !t.completed).length,
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

  const handleSaveTask = (taskData) => {
    let hasError = false;
    let errorMessage = '';
    let errorTitle = '';

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
    } else if (taskData.categories.length === 0) {
      hasError = true;
      errorTitle = 'Missing Categories';
      errorMessage = 'Please add at least one category to the task.';
    }

    if (hasError) {
      showToast('error', errorMessage, errorTitle);
      return;
    }

    setIsSubmitting(true);
    console.log('New task created:', taskData);
    
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

      {/* Content */}
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

          {/* Stats Bar */}
          <div className={styles["mytasks-stats-bar"]}>
            <div className={styles["mytasks-stat-item"]}>
              <span className={styles["mytasks-stat-number"]}>{stats.total}</span>
              <span className={styles["mytasks-stat-label"]}>Total</span>
            </div>
            <div className={styles["mytasks-stat-item"]}>
              <span className={styles["mytasks-stat-number"]}>{stats.inProgress}</span>
              <span className={styles["mytasks-stat-label"]}>In Progress</span>
            </div>
            <div className={styles["mytasks-stat-item"]}>
              <span className={styles["mytasks-stat-number"]}>{stats.completed}</span>
              <span className={styles["mytasks-stat-label"]}>Completed</span>
            </div>
            <div className={styles["mytasks-stat-item"]}>
              <span className={styles["mytasks-stat-number"]}>{stats.highPriority}</span>
              <span className={styles["mytasks-stat-label"]}>High Priority</span>
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
                    readOnly
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
                      {task.attachments > 0 && (
                        <span className={styles["mytasks-task-meta-item"]}>
                          <Icon name="paperclip" className={styles["mytasks-meta-icon"]} />
                          {task.attachments}
                        </span>
                      )}
                      {task.comments > 0 && (
                        <span className={styles["mytasks-task-meta-item"]}>
                          <Icon name="message" className={styles["mytasks-meta-icon"]} />
                          {task.comments}
                        </span>
                      )}
                      <span className={styles["mytasks-task-meta-item"]}>
                        📅 {task.created}
                      </span>
                    </div>
                    <div className={styles["mytasks-task-meta-right"]}>
                      <div className={styles["mytasks-task-avatars"]}>
                        {task.assignees.map((initials, i) => (
                          <span key={i} className={styles["mytasks-avatar"]} style={{ zIndex: task.assignees.length - i }}>
                            {initials}
                          </span>
                        ))}
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
                        readOnly
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
                    </div>
                    <div className={styles["mytasks-grid-assignees"]}>
                      {task.assignees.map((initials, i) => (
                        <span key={i} className={styles["mytasks-avatar"]} style={{ zIndex: task.assignees.length - i }}>
                          {initials}
                        </span>
                      ))}
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