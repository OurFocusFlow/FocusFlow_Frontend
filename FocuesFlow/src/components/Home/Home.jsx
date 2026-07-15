import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";

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
    sparkles: (
      <>
        <path d="M12 3v2M18.364 5.636l-1.414 1.414M21 12h-2M18.364 18.364l-1.414-1.414M12 21v-2M5.636 18.364l1.414-1.414M3 12h2M5.636 5.636l1.414 1.414" strokeLinecap="round" />
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

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const [hoveredTask, setHoveredTask] = useState(null);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

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
    },
  ];

  const stats = {
    weeklyProgress: 78,
    focusHours: 24.5,
    tasksCompleted: 12,
    totalTasks: 18,
    streak: 7,
    overdue: 3,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(stats.weeklyProgress);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const greeting = hours < 12 ? "Good morning" : hours < 17 ? "Good afternoon" : "Good evening";
    setCurrentTime(greeting);
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true;
    if (activeTab === "todo") return !task.completed;
    if (activeTab === "done") return task.completed;
    return true;
  });

  const priorityClass = (priority) =>
    ({ High: "priority-high", Medium: "priority-medium", Low: "priority-low" }[priority] || "");

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
        {/* Header */}
        <div className={styles["home-header-section"]}>
          <div className={styles["home-greeting"]}>
            <div className={styles["home-greeting-content"]}>
              <div className={styles["home-chip"]}>
                <span className={styles["home-chip-dot"]} />
                <span className={styles["home-chip-label"]}>FOCUS MODE</span>
                <span className={styles["home-chip-value"]}>ACTIVE</span>
              </div>
              <h1>
                <span className={styles["home-greeting-text"]}>{currentTime},</span>{" "}
                <span className={styles["home-name-highlight"]}>Alex</span>
                <span className={styles["home-wave"]}>👋</span>
              </h1>
              <p>
                You have <strong>8 tasks</strong> to focus on today. Let's make it productive.
              </p>
            </div>

            <div className={styles["home-actions"]}>
              <button className={styles["home-action-btn"]}>
                <Icon name="plus" className={styles["home-action-icon"]} />
                <span>New Task</span>
              </button>
              <div className={styles["home-streak"]}>
                <Icon name="flame" className={styles["home-streak-icon"]} />
                <div className={styles["home-streak-info"]}>
                  <span className={styles["home-streak-number"]}>{stats.streak}</span>
                  <span className={styles["home-streak-label"]}>Day streak</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className={styles["home-grid"]}>
          {/* Tasks */}
          <div className={styles["home-tasks-section"]}>
            <div className={styles["home-tasks-header"]}>
              <div className={styles["home-tasks-header-left"]}>
                <h2>Priority Tasks</h2>
                <span className={styles["home-tasks-count"]}>{filteredTasks.length} tasks</span>
              </div>
              <div className={styles["home-tasks-header-right"]}>
                <button className={styles["home-sort-btn"]}>
                  <Icon name="list" className={styles["home-sort-icon"]} />
                  <span>Sort</span>
                </button>
              </div>
            </div>

            <div className={styles["home-tabs"]}>
              {["all", "todo", "done"].map((tab) => (
                <button
                  key={tab}
                  className={`${styles["home-tab"]} ${activeTab === tab ? styles["home-tab-active"] : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span className={styles["home-tab-text"]}>
                    {tab === "all" ? "All" : tab === "todo" ? "Todo" : "Done"}
                  </span>
                  <span className={styles["home-tab-badge"]}>
                    {tab === "all"
                      ? tasks.length
                      : tab === "todo"
                      ? tasks.filter((t) => !t.completed).length
                      : tasks.filter((t) => t.completed).length}
                  </span>
                </button>
              ))}
            </div>

            <div className={styles["home-task-list"]}>
              {filteredTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`${styles["home-task-item"]} ${styles[priorityClass(task.priority)]} ${
                    task.completed ? styles["home-task-completed"] : ""
                  } ${hoveredTask === task.id ? styles["home-task-hovered"] : ""}`}
                  onMouseEnter={() => setHoveredTask(task.id)}
                  onMouseLeave={() => setHoveredTask(null)}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className={styles["home-task-status"]}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className={styles["home-task-checkbox"]}
                    />
                  </div>

                  <div className={styles["home-task-content"]}>
                    <div className={styles["home-task-title-row"]}>
                      <h3>{task.title}</h3>
                      <div className={styles["home-task-tags"]}>
                        <span className={`${styles["home-task-priority"]} ${styles[priorityClass(task.priority)]}`}>
                          {task.priority}
                        </span>
                        <span className={styles["home-task-category"]}>{task.category}</span>
                      </div>
                    </div>

                    <p className={styles["home-task-description"]}>{task.description}</p>

                    <div className={styles["home-task-meta"]}>
                      <div className={styles["home-task-meta-left"]}>
                        {task.dueDate && (
                          <span className={styles["home-task-meta-item"]}>
                            <Icon name="calendar" className={styles["home-meta-icon"]} />
                            {task.dueDate}
                          </span>
                        )}
                        {task.attachments > 0 && (
                          <span className={styles["home-task-meta-item"]}>
                            <Icon name="paperclip" className={styles["home-meta-icon"]} />
                            {task.attachments}
                          </span>
                        )}
                        {task.comments > 0 && (
                          <span className={styles["home-task-meta-item"]}>
                            <Icon name="message" className={styles["home-meta-icon"]} />
                            {task.comments}
                          </span>
                        )}
                      </div>
                      <div className={styles["home-task-meta-right"]}>
                        <div className={styles["home-task-avatars"]}>
                          {task.assignees.map((initials, i) => (
                            <span key={i} className={styles["home-avatar"]} style={{ zIndex: task.assignees.length - i }}>
                              {initials}
                            </span>
                          ))}
                        </div>
                        {task.completed && (
                          <span className={styles["home-task-completed-badge"]}>
                            <Icon name="check" className={styles["home-badge-icon"]} />
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles["home-sidebar"]}>
            <div className={`${styles["home-stat-card"]} ${styles["home-stat-card-progress"]}`}>
              <div className={styles["home-stat-card-header"]}>
                <h3>Weekly Progress</h3>
                <span className={styles["home-stat-card-trend"]}>
                  <Icon name="trending" className={styles["home-trend-icon"]} />
                  12%
                </span>
              </div>
              <div className={styles["home-stat-progress"]}>
                <div className={styles["home-progress-ring"]}>
                  <svg viewBox="0 0 120 120" className={styles["home-progress-svg"]}>
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(animatedProgress / 100) * 339.292} 339.292`}
                      className={styles["home-progress-circle"]}
                    />
                  </svg>
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                  <div className={styles["home-progress-center"]}>
                    <span className={styles["home-progress-number"]}>{Math.round(animatedProgress)}%</span>
                    <span className={styles["home-progress-label"]}>Complete</span>
                  </div>
                </div>
              </div>
              <div className={styles["home-progress-details"]}>
                <div className={styles["home-progress-detail"]}>
                  <span className={styles["home-progress-detail-label"]}>Done</span>
                  <span className={styles["home-progress-detail-value"]}>{stats.tasksCompleted}</span>
                </div>
                <div className={styles["home-progress-detail"]}>
                  <span className={styles["home-progress-detail-label"]}>Total</span>
                  <span className={styles["home-progress-detail-value"]}>{stats.totalTasks}</span>
                </div>
                <div className={styles["home-progress-detail"]}>
                  <span className={styles["home-progress-detail-label"]}>Remaining</span>
                  <span className={styles["home-progress-detail-value"]}>
                    {stats.totalTasks - stats.tasksCompleted}
                  </span>
                </div>
              </div>
            </div>

            <div className={`${styles["home-stat-card"]} ${styles["home-stat-card-focus"]}`}>
              <div className={styles["home-stat-card-header"]}>
                <h3>Focus Hours</h3>
                <Icon name="clock" className={styles["home-stat-card-icon"]} />
              </div>
              <div className={styles["home-stat-value-wrapper"]}>
                <span className={styles["home-stat-value"]}>{stats.focusHours}</span>
                <span className={styles["home-stat-value-unit"]}>hrs</span>
              </div>
              <p className={styles["home-stat-sub"]}>🎯 {stats.tasksCompleted} tasks completed this week</p>
              <div className={styles["home-stat-footer"]}>
                <span className={styles["home-stat-footer-text"]}>+2.5 hrs from last week</span>
              </div>
            </div>

            <div className={styles["home-quick-stats"]}>
              <div className={styles["home-quick-stat"]}>
                <div className={styles["home-quick-stat-icon-wrapper"]}>
                  <Icon name="list" className={styles["home-quick-stat-icon"]} />
                </div>
                <div className={styles["home-quick-stat-info"]}>
                  <span className={styles["home-quick-stat-number"]}>{stats.totalTasks}</span>
                  <span className={styles["home-quick-stat-label"]}>Tasks</span>
                </div>
              </div>
              <div className={styles["home-quick-stat"]}>
                <div className={styles["home-quick-stat-icon-wrapper"]}>
                  <Icon name="check" className={styles["home-quick-stat-icon"]} />
                </div>
                <div className={styles["home-quick-stat-info"]}>
                  <span className={styles["home-quick-stat-number"]}>{stats.tasksCompleted}</span>
                  <span className={styles["home-quick-stat-label"]}>Completed</span>
                </div>
              </div>
              <div className={styles["home-quick-stat"]}>
                <div className={styles["home-quick-stat-icon-wrapper"]}>
                  <Icon name="alertCircle" className={styles["home-quick-stat-icon"]} />
                </div>
                <div className={styles["home-quick-stat-info"]}>
                  <span className={styles["home-quick-stat-number"]}>{stats.overdue}</span>
                  <span className={styles["home-quick-stat-label"]}>Overdue</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}