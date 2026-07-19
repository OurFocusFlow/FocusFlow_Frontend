import React, { createContext, useState, useContext, useCallback } from 'react';

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
      dueSort: 1729747200000,
      status: "In Progress",
      completed: false,
      category: "Design",
      assignees: ["AR", "JD"],
      created: "Oct 20, 2023",
      attachments: 0,
      comments: 0,
    },
    {
      id: 2,
      title: "Coffee Bean Sourcing Audit",
      description: "Review the sustainability reports from Colombian...",
      priority: "Medium",
      dueDate: "Oct 25, 2024",
      dueSort: 1729833600000,
      status: "Pending",
      completed: false,
      category: "Marketing",
      assignees: ["AR"],
      created: "Oct 18, 2023",
      attachments: 0,
      comments: 0,
    },
    {
      id: 3,
      title: "Team Synchrony Sync",
      description: "Weekly check-in with the design and engineering...",
      priority: "Low",
      dueDate: "Oct 23, 2024",
      dueSort: 1729660800000,
      status: "Completed",
      completed: true,
      category: "Content",
      assignees: ["JD", "SM"],
      created: "Oct 15, 2023",
      attachments: 0,
      comments: 0,
    },
    {
      id: 4,
      title: "Client Onboarding Flow",
      description: "Map the first-week experience for new enterprise...",
      priority: "High",
      dueDate: "Oct 26, 2024",
      dueSort: 1729920000000,
      status: "Pending",
      completed: false,
      category: "Development",
      assignees: ["AR", "JD", "SM"],
      created: "Oct 22, 2023",
      attachments: 0,
      comments: 0,
    },
    {
      id: 5,
      title: "API Rate Limit Review",
      description: "Audit current thresholds against Q3 traffic spikes...",
      priority: "Medium",
      dueDate: "Oct 27, 2024",
      dueSort: 1730006400000,
      status: "In Progress",
      completed: false,
      category: "Development",
      assignees: ["JD"],
      created: "Oct 19, 2023",
      attachments: 0,
      comments: 0,
    },
    {
      id: 6,
      title: "Newsletter Copy Pass",
      description: "Tighten subject lines and CTA placement for the...",
      priority: "Low",
      dueDate: "Oct 22, 2024",
      dueSort: 1729574400000,
      status: "Completed",
      completed: true,
      category: "Content",
      assignees: ["SM"],
      created: "Oct 21, 2023",
      attachments: 0,
      comments: 0,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const getTaskCount = useCallback(() => tasks.length, [tasks]);
  const getPendingCount = useCallback(() => tasks.filter(task => !task.completed).length, [tasks]);
  const getCompletedCount = useCallback(() => tasks.filter(task => task.completed).length, [tasks]);

  // Async add task - simulates API call
  const addTask = useCallback(async (newTask) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const taskWithId = { ...newTask, id: Date.now() };
      setTasks(prev => [...prev, taskWithId]);
      return { success: true, task: taskWithId };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Async update task - simulates API call
  const updateTask = useCallback(async (id, updatedTask) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let updated = null;
      setTasks(prev => {
        const newTasks = prev.map(task => {
          if (task.id === id) {
            updated = { ...task, ...updatedTask };
            return updated;
          }
          return task;
        });
        return newTasks;
      });
      
      return { success: true, task: updated };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Async delete task - simulates API call
  const deleteTask = useCallback(async (id) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let deleted = null;
      setTasks(prev => {
        const taskToDelete = prev.find(task => task.id === id);
        if (taskToDelete) deleted = taskToDelete;
        return prev.filter(task => task.id !== id);
      });
      
      return { success: true, task: deleted };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Async toggle task complete - simulates API call
  const toggleTaskComplete = useCallback(async (id) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let toggled = null;
      setTasks(prev => prev.map(task => {
        if (task.id === id) {
          toggled = { ...task, completed: !task.completed };
          return toggled;
        }
        return task;
      }));
      
      return { success: true, task: toggled };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <TaskContext.Provider value={{
      tasks,
      setTasks,
      isLoading,
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