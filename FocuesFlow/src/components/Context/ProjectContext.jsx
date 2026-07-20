import React, { createContext, useState, useContext } from 'react';

const ProjectContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Q4 Marketing Strategy',
      description: 'Comprehensive marketing plan for Q4 2024 including digital campaigns, content strategy, and budget allocation.',
      priority: 'High',
      progress: 75,
      category: 'Marketing',
      team: ['AR', 'JD', 'SM'],
      tasks: 24,
      completed: 18,
      dueDate: 'Dec 15, 2024',
      created: 'Oct 1, 2024',
      starred: true,
      color: '#FBEAD9',
    },
    {
      id: 2,
      name: 'Product Redesign',
      description: 'Complete UI/UX redesign of the BrewTask platform focusing on user experience and visual aesthetics.',
      priority: 'Medium',
      progress: 45,
      category: 'Design',
      team: ['JD', 'AR'],
      tasks: 32,
      completed: 14,
      dueDate: 'Jan 20, 2025',
      created: 'Oct 15, 2024',
      starred: false,
      color: '#ECFDF5',
    },
    {
      id: 3,
      name: 'API Integration',
      description: 'Integrate third-party APIs and build robust middleware for seamless data flow between services.',
      priority: 'Medium',
      progress: 10,
      category: 'Development',
      team: ['SM', 'AR'],
      tasks: 18,
      completed: 2,
      dueDate: 'Feb 10, 2025',
      created: 'Nov 1, 2024',
      starred: false,
      color: '#DBEAFE',
    },
    {
      id: 4,
      name: 'Content Calendar',
      description: 'Plan and schedule all content for blog, social media, and email newsletters for the next quarter.',
      priority: 'Low',
      progress: 100,
      category: 'Content',
      team: ['JD'],
      tasks: 15,
      completed: 15,
      dueDate: 'Nov 30, 2024',
      created: 'Sep 1, 2024',
      starred: true,
      color: '#FCE3E0',
    },
    {
      id: 5,
      name: 'User Research',
      description: 'Conduct user interviews and surveys to gather insights for feature development and product improvements.',
      priority: 'High',
      progress: 60,
      category: 'Research',
      team: ['AR', 'SM'],
      tasks: 12,
      completed: 7,
      dueDate: 'Dec 5, 2024',
      created: 'Oct 20, 2024',
      starred: false,
      color: '#F3E8FF',
    },
    {
      id: 6,
      name: 'Documentation Overhaul',
      description: 'Rewrite and organize all technical documentation with better examples and clearer structure.',
      priority: 'Low',
      progress: 30,
      category: 'Documentation',
      team: ['SM', 'JD'],
      tasks: 20,
      completed: 6,
      dueDate: 'Jan 5, 2025',
      created: 'Nov 10, 2024',
      starred: false,
      color: '#FEF3C7',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Get project by ID
  const getProjectById = (id) => {
    return projects.find(project => project.id === id);
  };

  // Get project count
  const getProjectCount = () => {
    return projects.length;
  };

  // Get projects by priority
  const getProjectsByPriority = (priority) => {
    return projects.filter(project => project.priority === priority);
  };

  // Get projects by category
  const getProjectsByCategory = (category) => {
    return projects.filter(project => project.category === category);
  };

  // Get starred projects
  const getStarredProjects = () => {
    return projects.filter(project => project.starred);
  };

  // Get project stats
  const getProjectStats = () => {
    return {
      total: projects.length,
      high: projects.filter(p => p.priority === 'High').length,
      medium: projects.filter(p => p.priority === 'Medium').length,
      low: projects.filter(p => p.priority === 'Low').length,
    };
  };

  // Add a new project
  const addProject = async (projectData) => {
    setIsLoading(true);
    try {
      const newProject = {
        id: Date.now(),
        ...projectData,
        progress: 0,
        team: ['You'],
        tasks: 0,
        completed: 0,
        created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        starred: false,
        color: '#FBEAD9',
      };
      setProjects(prev => [newProject, ...prev]);
      return { success: true, project: newProject };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Update a project
  const updateProject = async (id, updatedData) => {
    setIsLoading(true);
    try {
      setProjects(prev => prev.map(project =>
        project.id === id ? { ...project, ...updatedData } : project
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a project
  const deleteProject = async (id) => {
    setIsLoading(true);
    try {
      setProjects(prev => prev.filter(project => project.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle project star
  const toggleProjectStar = async (id) => {
    setIsLoading(true);
    try {
      setProjects(prev => prev.map(project =>
        project.id === id ? { ...project, starred: !project.starred } : project
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Update project progress
  const updateProjectProgress = async (id, progress) => {
    setIsLoading(true);
    try {
      setProjects(prev => prev.map(project =>
        project.id === id ? { ...project, progress: Math.min(100, Math.max(0, progress)) } : project
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Update project tasks count
  const updateProjectTasks = async (id, taskCount, completedCount) => {
    setIsLoading(true);
    try {
      setProjects(prev => prev.map(project =>
        project.id === id ? { 
          ...project, 
          tasks: taskCount,
          completed: completedCount,
          progress: taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0
        } : project
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      setProjects,
      isLoading,
      getProjectById,
      getProjectCount,
      getProjectsByPriority,
      getProjectsByCategory,
      getStarredProjects,
      getProjectStats,
      addProject,
      updateProject,
      deleteProject,
      toggleProjectStar,
      updateProjectProgress,
      updateProjectTasks,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};