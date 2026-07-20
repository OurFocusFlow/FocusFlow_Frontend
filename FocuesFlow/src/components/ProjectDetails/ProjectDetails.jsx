import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Avatar,
  AvatarGroup,
  Chip,
  LinearProgress,
  Divider,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  People as PeopleIcon,
  AttachFile as AttachFileIcon,
  Comment as CommentIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { useProjects } from '../Context/ProjectContext';
import { useTasks } from '../Context/TaskContext';
import styles from './ProjectDetails.module.css';
import ToastNotification from '../ToastNotification/ToastNotification';
import CreateTaskModal from '../CreateTaskModal/CreateTaskModal';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    projects, 
    getProjectById,
    updateProject, 
    deleteProject, 
    toggleProjectStar,
    updateProjectTasks,
    isLoading: projectsLoading 
  } = useProjects();
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask,
    isLoading: tasksLoading 
  } = useTasks();
  
  const [project, setProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [editErrors, setEditErrors] = useState({
    name: '',
    description: '',
    dueDate: '',
  });
  
  // Edit project form
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    category: '',
    priority: '',
    dueDate: '',
  });

  // Get project from context when ID changes
  useEffect(() => {
    if (id) {
      const projectData = getProjectById(parseInt(id));
      if (projectData) {
        setProject(projectData);
        const projectTasksData = tasks.filter(task => task.projectId === parseInt(id));
        setProjectTasks(projectTasksData);
      } else {
        navigate('/projects');
      }
    }
  }, [id, getProjectById, tasks, navigate]);

  // Update project tasks count when tasks change
  useEffect(() => {
    if (project) {
      const projectTasksData = tasks.filter(task => task.projectId === project.id);
      setProjectTasks(projectTasksData);
      
      const totalTasks = projectTasksData.length;
      const completedTasks = projectTasksData.filter(task => task.completed).length;
      
      if (totalTasks !== project.tasks || completedTasks !== project.completed) {
        updateProjectTasks(project.id, totalTasks, completedTasks);
      }
    }
  }, [tasks, project, updateProjectTasks]);

  const showToast = (type, message, title) => {
    setToast({ type, message, title });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const handleBack = () => {
    navigate('/projects');
  };

  const handleEditProject = () => {
    // Convert dueDate from display format to input format if needed
    let dueDateValue = '';
    if (project.dueDate) {
      const dateParts = project.dueDate.split(' ');
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
      name: project.name,
      description: project.description,
      category: project.category,
      priority: project.priority,
      dueDate: dueDateValue,
    });
    setEditErrors({ name: '', description: '', dueDate: '' });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    if (editErrors[name]) {
      setEditErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSaveEdit = async () => {
    // Reset errors
    setEditErrors({ name: '', description: '', dueDate: '' });
    let hasError = false;
    const errors = { name: '', description: '', dueDate: '' };

    // Validate Name
    if (!editForm.name.trim()) {
      errors.name = 'Project name is required';
      hasError = true;
    }

    // Validate Description
    if (!editForm.description.trim()) {
      errors.description = 'Description is required';
      hasError = true;
    }

    // Validate Due Date
    const today = new Date().toISOString().split('T')[0];
    if (!editForm.dueDate) {
      errors.dueDate = 'Due date is required';
      hasError = true;
    } else if (editForm.dueDate < today) {
      errors.dueDate = 'Due date cannot be in the past';
      hasError = true;
    }

    if (hasError) {
      setEditErrors(errors);
      const firstError = errors.name || errors.description || errors.dueDate;
      showToast('error', firstError, 'Validation Error');
      return;
    }

    // Format date for display
    const dateObj = new Date(editForm.dueDate + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const updatedData = {
      name: editForm.name,
      description: editForm.description,
      category: editForm.category,
      dueDate: formattedDate,
      priority: editForm.priority,
    };

    setIsSubmitting(true);
    const result = await updateProject(project.id, updatedData);
    setIsSubmitting(false);
    setIsEditModalOpen(false);
    setEditErrors({ name: '', description: '', dueDate: '' });
    
    if (result.success) {
      showToast('success', `Project "${editForm.name}" has been updated.`, 'Project Updated');
    } else {
      showToast('error', 'Failed to update project', 'Error');
    }
  };

  const handleDeleteProject = async () => {
    const result = await deleteProject(project.id);
    setIsDeleteModalOpen(false);
    if (result.success) {
      showToast('success', 'Project deleted successfully!', 'Project Deleted');
      setTimeout(() => {
        navigate('/projects');
      }, 1500);
    } else {
      showToast('error', 'Failed to delete project', 'Error');
    }
  };

  const handleToggleStar = async () => {
    const result = await toggleProjectStar(project.id);
    if (result.success) {
      showToast('success', `Project ${project.starred ? 'unstarred' : 'starred'}`, 'Project Updated');
    }
  };

  const handleCreateTask = async (taskData) => {
    const newTask = {
      ...taskData,
      projectId: project.id,
      projectName: project.name,
      date: taskData.dueDate,
      dueDate: taskData.dueDate,
      status: 'Pending',
      completed: false,
      assignees: ['You'],
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      attachments: 0,
      comments: 0,
    };
    
    const result = await addTask(newTask);
    setIsCreateTaskModalOpen(false);
    if (result.success) {
      showToast('success', 'Task added to project successfully!', 'Task Created');
    } else {
      showToast('error', 'Failed to create task', 'Error');
    }
  };

  const handleToggleTaskComplete = async (taskId) => {
    const task = projectTasks.find(t => t.id === taskId);
    if (task) {
      const result = await updateTask(taskId, { 
        completed: !task.completed,
        status: !task.completed ? 'Completed' : 'Pending'
      });
      if (!result.success) {
        showToast('error', 'Failed to update task status', 'Error');
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    const result = await deleteTask(taskId);
    if (result.success) {
      showToast('success', 'Task removed from project', 'Task Deleted');
    } else {
      showToast('error', 'Failed to delete task', 'Error');
    }
  };

  const priorityColor = (priority) => {
    const map = {
      High: '#dc2626',
      Medium: '#d97706',
      Low: '#059669',
    };
    return map[priority] || '#7E7471';
  };

  const getPriorityClass = (priority) => {
    const map = {
      High: styles.priorityHigh,
      Medium: styles.priorityMedium,
      Low: styles.priorityLow,
    };
    return map[priority] || '';
  };

  const filteredTasks = projectTasks
    .filter(task => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'completed') return task.completed;
      if (filterStatus === 'pending') return !task.completed;
      return true;
    })
    .filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (!project) {
    return (
      <Box className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <Typography>Loading project...</Typography>
      </Box>
    );
  }

  const isLoading = projectsLoading || tasksLoading;

  return (
    <Box className={styles.page}>
      {/* Background Decorations */}
      <div className={styles["project-bg"]}>
        <div className={styles["project-bg-orb"]} />
        <div className={styles["project-bg-orb"]} />
        <div className={styles["project-bg-orb"]} />
        <div className={styles["project-bg-grid"]} />
        <div className={styles["project-bg-glow"]} />
      </div>

      <Box className={styles.pageInner}>
        {/* Back Button */}
        <button className={styles.backBtn} onClick={handleBack}>
          <ArrowBackIcon className={styles.backIcon} />
          Back to Projects
        </button>

        {/* Project Header */}
        <Box className={styles.projectHeader}>
          <Box className={styles.projectHeaderLeft}>
            <Box 
              className={styles.projectColorBar}
              style={{ backgroundColor: project.color || '#E6E2DF' }}
            />
            <Box>
              <Box className={styles.projectTitleRow}>
                <h1 className={styles.projectTitle}>{project.name}</h1>
                <button 
                  className={styles.starBtn}
                  onClick={handleToggleStar}
                  disabled={isLoading}
                >
                  {project.starred ? (
                    <StarIcon className={styles.starIconActive} />
                  ) : (
                    <StarBorderIcon className={styles.starIcon} />
                  )}
                </button>
              </Box>
              <Box className={styles.projectBadges}>
                <span className={`${styles.priorityBadge} ${getPriorityClass(project.priority)}`}>
                  <span 
                    className={styles.priorityDot}
                    style={{ backgroundColor: priorityColor(project.priority) }}
                  />
                  {project.priority}
                </span>
                <span className={styles.categoryBadge}>{project.category}</span>
              </Box>
            </Box>
          </Box>
          <Box className={styles.projectHeaderActions}>
            <button 
              className={styles.editBtn} 
              onClick={handleEditProject}
              disabled={isLoading}
            >
              <EditIcon className={styles.btnIcon} />
              Edit Project
            </button>
            <button 
              className={styles.deleteBtn} 
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isLoading}
            >
              <DeleteIcon className={styles.btnIcon} />
            </button>
          </Box>
        </Box>

        {/* Project Stats */}
        <Box className={styles.projectStats}>
          <Box className={styles.statCard}>
            <span className={styles.statNumber}>{projectTasks.length}</span>
            <span className={styles.statLabel}>Total Tasks</span>
          </Box>
          <Box className={styles.statCard}>
            <span className={styles.statNumber}>{projectTasks.filter(t => t.completed).length}</span>
            <span className={styles.statLabel}>Completed</span>
          </Box>
          <Box className={styles.statCard}>
            <span className={styles.statNumber}>{projectTasks.filter(t => !t.completed).length}</span>
            <span className={styles.statLabel}>Pending</span>
          </Box>
          <Box className={styles.statCard}>
            <span className={styles.statNumber}>{project.progress}%</span>
            <span className={styles.statLabel}>Progress</span>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box className={styles.progressSection}>
          <Box className={styles.progressHeader}>
            <span className={styles.progressLabel}>Project Progress</span>
            <span className={styles.progressValue}>{project.progress}%</span>
          </Box>
          <Box className={styles.progressBarWrapper}>
            <Box 
              className={styles.progressBar}
              style={{ width: `${project.progress}%` }}
            />
          </Box>
        </Box>

        {/* Project Description */}
        <Box className={styles.descriptionSection}>
          <h3 className={styles.sectionTitle}>Description</h3>
          <p className={styles.descriptionText}>{project.description}</p>
        </Box>

        {/* Project Meta */}
        <Box className={styles.metaSection}>
          <Box className={styles.metaItem}>
            <ScheduleIcon className={styles.metaIcon} />
            <Box>
              <span className={styles.metaLabel}>Due Date</span>
              <span className={styles.metaValue}>{project.dueDate}</span>
            </Box>
          </Box>
          <Box className={styles.metaItem}>
            <PeopleIcon className={styles.metaIcon} />
            <Box>
              <span className={styles.metaLabel}>Team</span>
              <AvatarGroup max={5} className={styles.teamAvatars}>
                {project.team && project.team.map((member, index) => (
                  <Avatar key={index} className={styles.teamAvatar}>
                    {member}
                  </Avatar>
                ))}
              </AvatarGroup>
            </Box>
          </Box>
          <Box className={styles.metaItem}>
            <span className={styles.metaLabel}>Created</span>
            <span className={styles.metaValue}>{project.created}</span>
          </Box>
        </Box>

        <Divider className={styles.divider} />

        {/* Tasks Section */}
        <Box className={styles.tasksSection}>
          <Box className={styles.tasksHeader}>
            <h3 className={styles.sectionTitle}>Project Tasks</h3>
            <button 
              className={styles.addTaskBtn}
              onClick={() => setIsCreateTaskModalOpen(true)}
              disabled={isLoading}
            >
              <AddIcon className={styles.btnIcon} />
              Add Task
            </button>
          </Box>

          {/* Task Filters */}
          <Box className={styles.taskFilters}>
            <Box className={styles.searchWrapper}>
              <SearchIcon className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </Box>
            <Box className={styles.filterButtons}>
              {['all', 'pending', 'completed'].map((status) => (
                <button
                  key={status}
                  className={`${styles.filterBtn} ${filterStatus === status ? styles.filterBtnActive : ''}`}
                  onClick={() => setFilterStatus(status)}
                >
                  {status === 'all' ? 'All' : status === 'pending' ? 'Pending' : 'Completed'}
                </button>
              ))}
            </Box>
          </Box>

          {/* Task List */}
          {filteredTasks.length === 0 ? (
            <Box className={styles.emptyTasks}>
              <span className={styles.emptyIcon}>📋</span>
              <h4>No tasks found</h4>
              <p>Add a task to this project to get started</p>
            </Box>
          ) : (
            <Box className={styles.taskList}>
              {filteredTasks.map((task) => (
                <Box key={task.id} className={styles.taskItem}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTaskComplete(task.id)}
                    className={styles.taskCheckbox}
                    disabled={isLoading}
                  />
                  <Box className={styles.taskContent}>
                    <Box className={styles.taskHeader}>
                      <span className={`${styles.taskTitle} ${task.completed ? styles.taskCompleted : ''}`}>
                        {task.title}
                      </span>
                      <Box className={styles.taskBadges}>
                        <span className={`${styles.taskPriority} ${getPriorityClass(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={styles.taskCategory}>{task.category}</span>
                      </Box>
                    </Box>
                    {task.description && (
                      <p className={styles.taskDescription}>{task.description}</p>
                    )}
                    <Box className={styles.taskMeta}>
                      {task.dueDate && (
                        <span className={styles.taskMetaItem}>
                          <ScheduleIcon className={styles.metaIconSmall} />
                          {task.dueDate}
                        </span>
                      )}
                      {task.assignees && task.assignees.length > 0 && (
                        <span className={styles.taskMetaItem}>
                          <PeopleIcon className={styles.metaIconSmall} />
                          {task.assignees.join(', ')}
                        </span>
                      )}
                    </Box>
                  </Box>
                  <button 
                    className={styles.deleteTaskBtn}
                    onClick={() => handleDeleteTask(task.id)}
                    disabled={isLoading}
                  >
                    <DeleteIcon className={styles.btnIconSmall} />
                  </button>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Edit Project Modal - Like CreateTaskModal */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
        className={styles.editDialog}
        PaperProps={{
          className: styles.editDialogPaper,
        }}
      >
        <Box className={styles.editModalContent}>
          {/* Header */}
          <Box className={styles.editModalHeader}>
            <Box className={styles.editModalHeaderLeft}>
              <Box className={styles.editModalIconWrapper}>
                <EditIcon className={styles.editModalIcon} />
              </Box>
              <Box>
                <h2 className={styles.editModalTitle}>Edit Project</h2>
                <p className={styles.editModalSubtitle}>Update your project details.</p>
              </Box>
            </Box>
            <button 
              className={styles.editModalClose} 
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
            >
              <CloseIcon />
            </button>
          </Box>

          {/* Form */}
          <Box className={styles.editModalForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Project Name
                <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Q4 Marketing Strategy"
                value={editForm.name}
                onChange={handleEditChange}
                className={`${styles.formInput} ${editErrors.name ? styles.formInputError : ''}`}
                disabled={isSubmitting}
              />
              {editErrors.name && (
                <span className={styles.formError}>{editErrors.name}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Description
                <span className={styles.requiredStar}>*</span>
              </label>
              <textarea
                name="description"
                placeholder="Briefly describe the project goals and deliverables..."
                value={editForm.description}
                onChange={handleEditChange}
                className={`${styles.formTextarea} ${editErrors.description ? styles.formInputError : ''}`}
                rows="3"
                disabled={isSubmitting}
              />
              {editErrors.description && (
                <span className={styles.formError}>{editErrors.description}</span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category</label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className={styles.formSelect}
                  disabled={isSubmitting}
                >
                  {['Marketing', 'Design', 'Development', 'Content', 'Research', 'Documentation'].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Priority</label>
                <select
                  name="priority"
                  value={editForm.priority}
                  onChange={handleEditChange}
                  className={styles.formSelect}
                  disabled={isSubmitting}
                >
                  {['High', 'Medium', 'Low'].map((priority) => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Due Date
                <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={editForm.dueDate}
                onChange={handleEditChange}
                className={`${styles.formInput} ${editErrors.dueDate ? styles.formInputError : ''}`}
                min={new Date().toISOString().split('T')[0]}
                disabled={isSubmitting}
              />
              {editErrors.dueDate && (
                <span className={styles.formError}>{editErrors.dueDate}</span>
              )}
            </div>
          </Box>

          {/* Footer */}
          <Box className={styles.editModalFooter}>
            <button 
              className={styles.cancelBtn} 
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              className={styles.saveBtn}
              onClick={handleSaveEdit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner} />
                  Saving...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </Box>
        </Box>
      </Dialog>

      {/* Delete Project Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        maxWidth="xs"
        fullWidth
        className={styles.deleteDialog}
        PaperProps={{
          className: styles.deleteDialogPaper,
        }}
      >
        <Box className={styles.deleteDialogContent}>
          <Box className={styles.deleteDialogIconWrapper}>
            <DeleteIcon className={styles.deleteDialogIcon} />
          </Box>
          <h3 className={styles.deleteDialogTitle}>Delete Project?</h3>
          <p className={styles.deleteDialogText}>
            Are you sure you want to delete <strong>"{project.name}"</strong>?<br />
            This action cannot be undone and all associated tasks will be removed.
          </p>
          <Box className={styles.deleteDialogActions}>
            <button onClick={() => setIsDeleteModalOpen(false)} className={styles.deleteDialogCancel}>
              Cancel
            </button>
            <button onClick={handleDeleteProject} className={styles.deleteDialogConfirm} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </Box>
        </Box>
      </Dialog>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onSave={handleCreateTask}
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
    </Box>
  );
};

export default ProjectDetails;