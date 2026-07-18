import React, { useState, useRef, useEffect } from "react";
import styles from "./Dashboard.module.css";
import bannerImage from "../../assets/Images/Image4.png";

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

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

export default function Dashboard() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Q4 Marketing Strategy Deck", description: "Refine the final narrative and adjust the budget...", dueDate: "Oct 24, 2024", dueSort: 1, priority: "High", status: "In Progress", completed: false },
    { id: 2, title: "Coffee Bean Sourcing Audit", description: "Review the sustainability reports from Colombian...", dueDate: "Oct 25, 2024", dueSort: 2, priority: "Medium", status: "Pending", completed: false },
    { id: 3, title: "Team Synchrony Sync", description: "Weekly check-in with the design and engineering...", dueDate: "Oct 23, 2024", dueSort: 0, priority: "Low", status: "Completed", completed: true },
    { id: 4, title: "Client Onboarding Flow", description: "Map the first-week experience for new enterprise...", dueDate: "Oct 26, 2024", dueSort: 3, priority: "High", status: "Pending", completed: false },
    { id: 5, title: "API Rate Limit Review", description: "Audit current thresholds against Q3 traffic spikes...", dueDate: "Oct 27, 2024", dueSort: 4, priority: "Medium", status: "In Progress", completed: false },
    { id: 6, title: "Newsletter Copy Pass", description: "Tighten subject lines and CTA placement for the...", dueDate: "Oct 22, 2024", dueSort: -1, priority: "Low", status: "Completed", completed: true },
  ]);

  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [openMenu, setOpenMenu] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'Pending' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const filterRef = useRef(null);
  const sortRef = useRef(null);

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

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleDelete = (id) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setShowDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleEdit = (task) => {
    setEditingTask(task.id);
    setEditForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              title: editForm.title,
              description: editForm.description,
              dueDate: editForm.dueDate,
              priority: editForm.priority,
              status: editForm.status,
            }
          : t
      )
    );
    setEditingTask(null);
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
  const statusClass = (s) => ({ "In Progress": styles["status-progress"], Pending: styles["status-pending"], Completed: styles["status-completed"] }[s] || "");

  let visibleTasks = tasks.filter((t) => {
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    return true;
  });

  if (sortBy === "dueDate") {
    visibleTasks = [...visibleTasks].sort((a, b) => a.dueSort - b.dueSort);
  } else if (sortBy === "priority") {
    visibleTasks = [...visibleTasks].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  }

  const activeFilterCount = (filterPriority !== "all" ? 1 : 0) + (filterStatus !== "all" ? 1 : 0);

  const clearFilters = () => {
    setFilterPriority("all");
    setFilterStatus("all");
  };

  return (
    <div className={styles["home-container"]}>
      {/* Background Decorations */}
      <div className={styles["home-bg"]}>
        <div className={styles["home-bg-orb"]} />
        <div className={styles["home-bg-orb"]} />
        <div className={styles["home-bg-orb"]} />
        <div className={styles["home-bg-grid"]} />
        <div className={styles["home-bg-glow"]} />
      </div>

      <div className={styles["home-content-wrapper"]}>
        {/* Stat cards */}
        <div className={styles["home-stats-row"]}>
          <div className={styles["home-stat-box"]}>
            <div className={styles["home-stat-top"]}>
              <div className={`${styles["home-stat-icon-wrap"]} ${styles["icon-total"]}`}>
                <Icon name="clipboard" className={styles["home-stat-icon"]} />
              </div>
              <span className={styles["home-stat-trend"]}>{stats.totalTrend}</span>
            </div>
            <span className={styles["home-stat-label"]}>Total Tasks</span>
            <span className={styles["home-stat-value"]}>{stats.total}</span>
          </div>

          <div className={styles["home-stat-box"]}>
            <div className={styles["home-stat-top"]}>
              <div className={`${styles["home-stat-icon-wrap"]} ${styles["icon-completed"]}`}>
                <Icon name="check" className={styles["home-stat-icon"]} />
              </div>
              <span className={styles["home-stat-trend"]}>{stats.completedPct}</span>
            </div>
            <span className={styles["home-stat-label"]}>Completed</span>
            <span className={styles["home-stat-value"]}>{stats.completed}</span>
          </div>

          <div className={styles["home-stat-box"]}>
            <div className={styles["home-stat-top"]}>
              <div className={`${styles["home-stat-icon-wrap"]} ${styles["icon-pending"]}`}>
                <Icon name="hourglass" className={styles["home-stat-icon"]} />
              </div>
              <span className={styles["home-stat-trend"]}>Active</span>
            </div>
            <span className={styles["home-stat-label"]}>Pending</span>
            <span className={styles["home-stat-value"]}>{stats.pending}</span>
          </div>

          <div className={styles["home-stat-box"]}>
            <div className={styles["home-stat-top"]}>
              <div className={`${styles["home-stat-icon-wrap"]} ${styles["icon-overdue"]}`}>
                <Icon name="alertCircle" className={styles["home-stat-icon"]} />
              </div>
              <span className={`${styles["home-stat-trend"]} ${styles["trend-urgent"]}`}>Urgent</span>
            </div>
            <span className={styles["home-stat-label"]}>Overdue</span>
            <span className={`${styles["home-stat-value"]} ${styles["value-urgent"]}`}>{stats.overdue}</span>
          </div>
        </div>

        {/* Section header */}
        <div className={styles["home-rituals-header"]}>
          <div>
            <div className={styles["home-rituals-title-row"]}>
              <h2 className={styles["home-rituals-title"]}>Daily Rituals</h2>
              <span className={styles["home-rituals-count"]}>{visibleTasks.length}</span>
            </div>
            <p className={styles["home-rituals-sub"]}>Focus on what matters most today.</p>
          </div>

          <div className={styles["home-rituals-actions"]}>
            {activeFilterCount > 0 && (
              <button className={styles["home-clear-btn"]} onClick={clearFilters}>
                <Icon name="x" className={styles["home-btn-icon"]} />
                Clear
              </button>
            )}

            <div className={styles["home-menu-wrap"]} ref={filterRef}>
              <button
                className={`${styles["home-filter-btn"]} ${activeFilterCount > 0 ? styles["btn-active"] : ""}`}
                onClick={() => setOpenMenu(openMenu === "filter" ? null : "filter")}
              >
                <Icon name="filter" className={styles["home-btn-icon"]} />
                Filter
                {activeFilterCount > 0 && <span className={styles["home-filter-badge"]}>{activeFilterCount}</span>}
                <Icon name="chevronDown" className={styles["home-chevron"]} />
              </button>

              {openMenu === "filter" && (
                <div className={styles["home-dropdown"]}>
                  <span className={styles["home-dropdown-label"]}>Priority</span>
                  {["all", "High", "Medium", "Low"].map((p) => (
                    <button
                      key={p}
                      className={styles["home-dropdown-item"]}
                      onClick={() => setFilterPriority(p)}
                    >
                      {p === "all" ? "All priorities" : p}
                      {filterPriority === p && <Icon name="checkSmall" className={styles["home-dropdown-check"]} />}
                    </button>
                  ))}
                  <span className={styles["home-dropdown-label"]}>Status</span>
                  {["all", "In Progress", "Pending", "Completed"].map((s) => (
                    <button
                      key={s}
                      className={styles["home-dropdown-item"]}
                      onClick={() => setFilterStatus(s)}
                    >
                      {s === "all" ? "All statuses" : s}
                      {filterStatus === s && <Icon name="checkSmall" className={styles["home-dropdown-check"]} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles["home-menu-wrap"]} ref={sortRef}>
              <button
                className={`${styles["home-sort-btn"]} ${sortBy !== "default" ? styles["btn-active"] : ""}`}
                onClick={() => setOpenMenu(openMenu === "sort" ? null : "sort")}
              >
                <Icon name="sort" className={styles["home-btn-icon"]} />
                Sort
                <Icon name="chevronDown" className={styles["home-chevron"]} />
              </button>

              {openMenu === "sort" && (
                <div className={styles["home-dropdown"]}>
                  {[
                    { key: "default", label: "Default" },
                    { key: "dueDate", label: "Due date" },
                    { key: "priority", label: "Priority" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      className={styles["home-dropdown-item"]}
                      onClick={() => {
                        setSortBy(opt.key);
                        setOpenMenu(null);
                      }}
                    >
                      {opt.label}
                      {sortBy === opt.key && <Icon name="checkSmall" className={styles["home-dropdown-check"]} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Task list */}
        {visibleTasks.length === 0 ? (
          <div className={styles["home-empty-state"]}>
            <p>No tasks match these filters.</p>
            <button className={styles["home-clear-btn"]} onClick={clearFilters}>Clear filters</button>
          </div>
        ) : (
          <div className={styles["home-ritual-list"]}>
            {visibleTasks.map((task, i) => (
              <div
                key={task.id}
                className={`${styles["home-ritual-item"]} ${task.completed ? styles["home-ritual-completed"] : ""}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Delete Confirmation Overlay */}
                {showDeleteConfirm === task.id && (
                  <div className={styles["home-delete-overlay"]}>
                    <div className={styles["home-delete-modal"]}>
                      <p>Are you sure you want to delete this task?</p>
                      <div className={styles["home-delete-actions"]}>
                        <button className={styles["home-delete-confirm"]} onClick={() => confirmDelete(task.id)}>
                          Yes, Delete
                        </button>
                        <button className={styles["home-delete-cancel"]} onClick={cancelDelete}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className={styles["home-ritual-checkbox"]}
                />

                {editingTask === task.id ? (
                  // Edit Mode
                  <div className={styles["home-edit-form"]}>
                    <div className={styles["home-edit-row"]}>
                      <input
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        className={styles["home-edit-input"]}
                        placeholder="Task title"
                      />
                      <input
                        name="dueDate"
                        value={editForm.dueDate}
                        onChange={handleEditChange}
                        className={styles["home-edit-input-sm"]}
                        placeholder="Due date"
                      />
                    </div>
                    <div className={styles["home-edit-row"]}>
                      <input
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        className={styles["home-edit-input"]}
                        placeholder="Description"
                      />
                      <select
                        name="priority"
                        value={editForm.priority}
                        onChange={handleEditChange}
                        className={styles["home-edit-select"]}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                        className={styles["home-edit-select"]}
                      >
                        <option value="In Progress">In Progress</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div className={styles["home-edit-actions"]}>
                      <button className={styles["home-edit-save"]} onClick={() => saveEdit(task.id)}>
                        Save
                      </button>
                      <button className={styles["home-edit-cancel"]} onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <>
                    <div className={styles["home-ritual-content"]}>
                      <h3 className={styles["home-ritual-title"]}>{task.title}</h3>
                      <p className={styles["home-ritual-desc"]}>{task.description}</p>
                    </div>

                    <div className={styles["home-ritual-due"]}>
                      <span className={styles["home-due-label"]}>DUE DATE</span>
                      <span className={styles["home-due-value"]}>{task.dueDate}</span>
                    </div>

                    <div className={styles["home-ritual-badges"]}>
                      <span className={`${styles["home-badge"]} ${priorityClass(task.priority)}`}>{task.priority}</span>
                      <span className={`${styles["home-badge"]} ${statusClass(task.status)}`}>{task.status}</span>
                    </div>

                    <div className={styles["home-ritual-actions"]}>
                      <button className={styles["home-icon-btn"]} onClick={() => handleEdit(task)} aria-label="Edit task">
                        <Icon name="edit" className={styles["home-action-icon"]} />
                      </button>
                      <button className={styles["home-icon-btn"]} onClick={() => handleDelete(task.id)} aria-label="Delete task">
                        <Icon name="trash" className={styles["home-action-icon"]} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Banner */}
        <div className={styles["home-banner"]}>
          <div className={styles["home-banner-overlay"]} />
          <img 
            src={bannerImage} 
            alt="Master your ritual" 
            className={styles["home-banner-image"]} 
          />
          <div className={styles["home-banner-content"]}>
            <h2 className={styles["home-banner-title"]}>Master your ritual.</h2>
            <p className={styles["home-banner-desc"]}>
              Productivity isn't just about finishing tasks. It's about finding rhythm in the work you love.
            </p>
            <button className={styles["home-banner-cta"]}>Explore Insights</button>
          </div>
        </div>
      </div>
    </div>
  );
}