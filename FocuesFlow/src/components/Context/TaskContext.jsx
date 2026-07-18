import React, { createContext, useState, useContext } from 'react';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Q4 Marketing Strategy Deck",
      description: "Refine the final narrative and adjust the budget...",
      priority: "High",
      dueDate: "Oct 24, 2024",
      dueSort: 1,
      status: "In Progress",
      completed: false,
      category: "Design",
      assignees: ["AR", "JD"],
      created: "Oct 20, 2023",
    },
    {
      id: 2,
      title: "Coffee Bean Sourcing Audit",
      description: "Review the sustainability reports from Colombian...",
      priority: "Medium",
      dueDate: "Oct 25, 2024",
      dueSort: 2,
      status: "Pending",
      completed: false,
      category: "Marketing",
      assignees: ["AR"],
      created: "Oct 18, 2023",
    },
    {
      id: 3,
      title: "Team Synchrony Sync",
      description: "Weekly check-in with the design and engineering...",
      priority: "Low",
      dueDate: "Oct 23, 2024",
      dueSort: 0,
      status: "Completed",
      completed: true,
      category: "Content",
      assignees: ["JD", "SM"],
      created: "Oct 15, 2023",
    },
    {
      id: 4,
      title: "Client Onboarding Flow",
      description: "Map the first-week experience for new enterprise...",
      priority: "High",
      dueDate: "Oct 26, 2024",
      dueSort: 3,
      status: "Pending",
      completed: false,
      category: "Development",
      assignees: ["AR", "JD", "SM"],
      created: "Oct 22, 2023",
    },
    {
      id: 5,
      title: "API Rate Limit Review",
      description: "Audit current thresholds against Q3 traffic spikes...",
      priority: "Medium",
      dueDate: "Oct 27, 2024",
      dueSort: 4,
      status: "In Progress",
      completed: false,
      category: "Development",
      assignees: ["JD"],
      created: "Oct 19, 2023",
    },
    {
      id: 6,
      title: "Newsletter Copy Pass",
      description: "Tighten subject lines and CTA placement for the...",
      priority: "Low",
      dueDate: "Oct 22, 2024",
      dueSort: -1,
      status: "Completed",
      completed: true,
      category: "Content",
      assignees: ["SM"],
      created: "Oct 21, 2023",
    },
  ]);

  // Get task count for the sidebar badge
  const getTaskCount = () => {
    return tasks.length;
  };

  // Get pending tasks count
  const getPendingCount = () => {
    return tasks.filter(task => !task.completed).length;
  };

  // Get completed tasks count
  const getCompletedCount = () => {
    return tasks.filter(task => task.completed).length;
  };

  const addTask = (newTask) => {
    setTasks(prev => [...prev, { ...newTask, id: Date.now() }]);
  };

  const updateTask = (id, updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updatedTask } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTaskComplete = (id) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      setTasks,
      getTaskCount,
      getPendingCount,
      getCompletedCount,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskComplete,
    }}>
      {children}
    </TaskContext.Provider>
  );
};