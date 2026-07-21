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
import { useDarkMode } from '../Context/DarkModeContext';
import styles from './ProjectDetails.module.css';
import ToastNotification from '../ToastNotification/ToastNotification';
import CreateTaskModal from '../CreateTaskModal/CreateTaskModal';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
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
    setEditErrors({ name: '', description: '', dueDate: '' });
    let hasError = false;
    const errors = { name: '', description: '', dueDate: '' };

    if (!editForm.name.trim()) {
      errors.name = 'Project name is required';
      hasError = true;
    }

    if (!editForm.description.trim()) {
      errors.description = 'Description is required';
      hasError = true;
    }

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

  const handleCreateTask = async (taskData, error) => {
    if (error) {
      showToast('error', error, 'Validation Error');
      return;
    }

    if (!taskData.title.trim()) {
      showToast('error', 'Please enter a task title.', 'Missing Title');
      return;
    }

    if (!taskData.description.trim()) {
      showToast('error', 'Please enter a task description.', 'Missing Description');
      return;
    }

    if (!taskData.dueDate) {
      showToast('error', 'Please select a due date.', 'Missing Due Date');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (taskData.dueDate < today) {
      showToast('error', 'Due date cannot be in the past. Please select a future date.', 'Invalid Date');
      return;
    }

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
    
    setIsSubmitting(true);
    const result = await addTask(newTask);
    setIsSubmitting(false);
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
      const newStatus = !task.completed;
      const result = await updateTask(taskId, { 
        completed: newStatus,
        status: newStatus ? 'Completed' : 'Pending'
      });
      
      if (result.success) {
        const statusText = newStatus ? 'completed' : 'uncompleted';
        showToast('success', `Task "${task.title}" marked as ${statusText}`, 'Task Updated');
      } else {
        showToast('error', 'Failed to update task status', 'Error');
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    const task = projectTasks.find(t => t.id === taskId);
    if (!task) return;
    
    const result = await deleteTask(taskId);
    if (result.success) {
      showToast('success', `Task "${task.title}" has been removed from the project.`, 'Task Deleted');
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
      <Box className={`${styles.loadingContainer} ${isDarkMode ? styles.darkLoadingContainer : ""}`}>
        <div className={styles.spinner} />
        <Typography className={isDarkMode ? styles.darkLoadingText : ""}>Loading project...</Typography>
      </Box>
    );
  }

  const isLoading = projectsLoading || tasksLoading;

  return (
    <Box className={`${styles.page} ${isDarkMode ? styles.darkPage : ""}`}>
      {/* Background Decorations */}
      <div className={`${styles["project-bg"]} ${isDarkMode ? styles.darkBg : ""}`}>
        <div className={styles["project-bg-orb"]} />
        <div className={styles["project-bg-orb"]} />
        <div className={styles["project-bg-orb"]} />
        <div className={`${styles["project-bg-grid"]} ${isDarkMode ? styles.darkBgGrid : ""}`} />
        <div className={`${styles["project-bg-glow"]} ${isDarkMode ? styles.darkBgGlow : ""}`} />
      </div>

      <Box className={styles.pageInner}>
        {/* Back Button */}
        <button 
          className={`${styles.backBtn} ${isDarkMode ? styles.darkBackBtn : ""}`} 
          onClick={handleBack}
        >
          <ArrowBackIcon className={styles.backIcon} />
          <span>Back to Projects</span>
        </button>

        {/* Project Header */}
        <Box className={`${styles.projectHeader} ${isDarkMode ? styles.darkProjectHeader : ""}`}>
          <Box className={styles.projectHeaderLeft}>
            <Box 
              className={styles.projectColorBar}
              style={{ backgroundColor: project.color || '#E6E2DF' }}
            />
            <Box>
              <Box className={styles.projectTitleRow}>
                <h1 className={`${styles.projectTitle} ${isDarkMode ? styles.darkProjectTitle : ""}`}>{project.name}</h1>
                <button 
                  className={`${styles.starBtn} ${isDarkMode ? styles.darkStarBtn : ""}`}
                  onClick={handleToggleStar}
                  disabled={isLoading}
                >
                  {project.starred ? (
                    <StarIcon className={`${styles.starIconActive} ${isDarkMode ? styles.darkStarIconActive : ""}`} />
                  ) : (
                    <StarBorderIcon className={`${styles.starIcon} ${isDarkMode ? styles.darkStarIcon : ""}`} />
                  )}
                </button>
              </Box>
              <Box className={styles.projectBadges}>
                <span className={`${styles.priorityBadge} ${getPriorityClass(project.priority)} ${isDarkMode ? styles.darkPriorityBadge : ""}`}>
                  <span 
                    className={styles.priorityDot}
                    style={{ backgroundColor: priorityColor(project.priority) }}
                  />
                  {project.priority}
                </span>
                <span className={`${styles.categoryBadge} ${isDarkMode ? styles.darkCategoryBadge : ""}`}>{project.category}</span>
              </Box>
            </Box>
          </Box>
          <Box className={styles.projectHeaderActions}>
            <button 
              className={`${styles.editBtn} ${isDarkMode ? styles.darkEditBtn : ""}`} 
              onClick={handleEditProject}
              disabled={isLoading}
            >
              <EditIcon className={styles.btnIcon} />
              Edit Project
            </button>
            <button 
              className={`${styles.deleteBtn} ${isDarkMode ? styles.darkDeleteBtn : ""}`} 
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isLoading}
            >
              <DeleteIcon className={styles.btnIcon} />
            </button>
          </Box>
        </Box>

        {/* Project Stats */}
        <Box className={styles.projectStats}>
          <Box className={`${styles.statCard} ${isDarkMode ? styles.darkStatCard : ""}`}>
            <span className={`${styles.statNumber} ${isDarkMode ? styles.darkStatNumber : ""}`}>{projectTasks.length}</span>
            <span className={`${styles.statLabel} ${isDarkMode ? styles.darkStatLabel : ""}`}>Total Tasks</span>
          </Box>
          <Box className={`${styles.statCard} ${isDarkMode ? styles.darkStatCard : ""}`}>
            <span className={`${styles.statNumber} ${isDarkMode ? styles.darkStatNumber : ""}`}>{projectTasks.filter(t => t.completed).length}</span>
            <span className={`${styles.statLabel} ${isDarkMode ? styles.darkStatLabel : ""}`}>Completed</span>
          </Box>
          <Box className={`${styles.statCard} ${isDarkMode ? styles.darkStatCard : ""}`}>
            <span className={`${styles.statNumber} ${isDarkMode ? styles.darkStatNumber : ""}`}>{projectTasks.filter(t => !t.completed).length}</span>
            <span className={`${styles.statLabel} ${isDarkMode ? styles.darkStatLabel : ""}`}>Pending</span>
          </Box>
          <Box className={`${styles.statCard} ${isDarkMode ? styles.darkStatCard : ""}`}>
            <span className={`${styles.statNumber} ${isDarkMode ? styles.darkStatNumber : ""}`}>{project.progress}%</span>
            <span className={`${styles.statLabel} ${isDarkMode ? styles.darkStatLabel : ""}`}>Progress</span>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box className={`${styles.progressSection} ${isDarkMode ? styles.darkProgressSection : ""}`}>
          <Box className={styles.progressHeader}>
            <span className={`${styles.progressLabel} ${isDarkMode ? styles.darkProgressLabel : ""}`}>Project Progress</span>
            <span className={`${styles.progressValue} ${isDarkMode ? styles.darkProgressValue : ""}`}>{project.progress}%</span>
          </Box>
          <Box className={`${styles.progressBarWrapper} ${isDarkMode ? styles.darkProgressBarWrapper : ""}`}>
            <Box 
              className={`${styles.progressBar} ${isDarkMode ? styles.darkProgressBar : ""}`}
              style={{ width: `${project.progress}%` }}
            />
          </Box>
        </Box>

        {/* Project Description */}
        <Box className={`${styles.descriptionSection} ${isDarkMode ? styles.darkDescriptionSection : ""}`}>
          <h3 className={`${styles.sectionTitle} ${isDarkMode ? styles.darkSectionTitle : ""}`}>Description</h3>
          <p className={`${styles.descriptionText} ${isDarkMode ? styles.darkDescriptionText : ""}`}>{project.description}</p>
        </Box>

        {/* Project Meta */}
        <Box className={styles.metaSection}>
          <Box className={`${styles.metaItem} ${isDarkMode ? styles.darkMetaItem : ""}`}>
            <ScheduleIcon className={`${styles.metaIcon} ${isDarkMode ? styles.darkMetaIcon : ""}`} />
            <Box>
              <span className={`${styles.metaLabel} ${isDarkMode ? styles.darkMetaLabel : ""}`}>Due Date</span>
              <span className={`${styles.metaValue} ${isDarkMode ? styles.darkMetaValue : ""}`}>{project.dueDate}</span>
            </Box>
          </Box>
          <Box className={`${styles.metaItem} ${isDarkMode ? styles.darkMetaItem : ""}`}>
            <PeopleIcon className={`${styles.metaIcon} ${isDarkMode ? styles.darkMetaIcon : ""}`} />
            <Box>
              <span className={`${styles.metaLabel} ${isDarkMode ? styles.darkMetaLabel : ""}`}>Team</span>
              <AvatarGroup max={5} className={styles.teamAvatars}>
                {project.team && project.team.map((member, index) => (
                  <Avatar key={index} className={`${styles.teamAvatar} ${isDarkMode ? styles.darkTeamAvatar : ""}`}>
                    {member}
                  </Avatar>
                ))}
              </AvatarGroup>
            </Box>
          </Box>
          <Box className={`${styles.metaItem} ${isDarkMode ? styles.darkMetaItem : ""}`}>
            <span className={`${styles.metaLabel} ${isDarkMode ? styles.darkMetaLabel : ""}`}>Created</span>
            <span className={`${styles.metaValue} ${isDarkMode ? styles.darkMetaValue : ""}`}>{project.created}</span>
          </Box>
        </Box>

        <Divider className={`${styles.divider} ${isDarkMode ? styles.darkDivider : ""}`} />

        {/* Tasks Section */}
        <Box className={`${styles.tasksSection} ${isDarkMode ? styles.darkTasksSection : ""}`}>
          <Box className={styles.tasksHeader}>
            <h3 className={`${styles.sectionTitle} ${isDarkMode ? styles.darkSectionTitle : ""}`}>Project Tasks</h3>
            <button 
              className={`${styles.addTaskBtn} ${isDarkMode ? styles.darkAddTaskBtn : ""}`}
              onClick={() => setIsCreateTaskModalOpen(true)}
              disabled={isLoading}
            >
              <AddIcon className={styles.btnIcon} />
              Add Task
            </button>
          </Box>

          {/* Task Filters */}
          <Box className={styles.taskFilters}>
            <Box className={`${styles.searchWrapper} ${isDarkMode ? styles.darkSearchWrapper : ""}`}>
              <SearchIcon className={`${styles.searchIcon} ${isDarkMode ? styles.darkSearchIcon : ""}`} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${styles.searchInput} ${isDarkMode ? styles.darkSearchInput : ""}`}
              />
            </Box>
            <Box className={styles.filterButtons}>
              {['all', 'pending', 'completed'].map((status) => (
                <button
                  key={status}
                  className={`${styles.filterBtn} ${filterStatus === status ? styles.filterBtnActive : ''} ${isDarkMode ? styles.darkFilterBtn : ''}`}
                  onClick={() => setFilterStatus(status)}
                >
                  {status === 'all' ? 'All' : status === 'pending' ? 'Pending' : 'Completed'}
                </button>
              ))}
            </Box>
          </Box>

          {/* Task List */}
          {filteredTasks.length === 0 ? (
            <Box className={`${styles.emptyTasks} ${isDarkMode ? styles.darkEmptyTasks : ""}`}>
              <span className={styles.emptyIcon}>📋</span>
              <h4 className={isDarkMode ? styles.darkEmptyTitle : ""}>No tasks found</h4>
              <p className={isDarkMode ? styles.darkEmptyText : ""}>Add a task to this project to get started</p>
            </Box>
          ) : (
            <Box className={styles.taskList}>
              {filteredTasks.map((task) => (
                <Box key={task.id} className={`${styles.taskItem} ${isDarkMode ? styles.darkTaskItem : ""}`}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTaskComplete(task.id)}
                    className={`${styles.taskCheckbox} ${isDarkMode ? styles.darkTaskCheckbox : ""}`}
                    disabled={isLoading}
                  />
                  <Box className={styles.taskContent}>
                    <Box className={styles.taskHeader}>
                      <span className={`${styles.taskTitle} ${task.completed ? styles.taskCompleted : ''} ${isDarkMode ? styles.darkTaskTitle : ""}`}>
                        {task.title}
                      </span>
                      <Box className={styles.taskBadges}>
                        <span className={`${styles.taskPriority} ${getPriorityClass(task.priority)} ${isDarkMode ? styles.darkTaskPriority : ""}`}>
                          {task.priority}
                        </span>
                        <span className={`${styles.taskCategory} ${isDarkMode ? styles.darkTaskCategory : ""}`}>{task.category}</span>
                      </Box>
                    </Box>
                    {task.description && (
                      <p className={`${styles.taskDescription} ${isDarkMode ? styles.darkTaskDescription : ""}`}>{task.description}</p>
                    )}
                    <Box className={styles.taskMeta}>
                      {task.dueDate && (
                        <span className={`${styles.taskMetaItem} ${isDarkMode ? styles.darkTaskMetaItem : ""}`}>
                          <ScheduleIcon className={styles.metaIconSmall} />
                          {task.dueDate}
                        </span>
                      )}
                      {task.assignees && task.assignees.length > 0 && (
                        <span className={`${styles.taskMetaItem} ${isDarkMode ? styles.darkTaskMetaItem : ""}`}>
                          <PeopleIcon className={styles.metaIconSmall} />
                          {task.assignees.join(', ')}
                        </span>
                      )}
                    </Box>
                  </Box>
                  <button 
                    className={`${styles.deleteTaskBtn} ${isDarkMode ? styles.darkDeleteTaskBtn : ""}`}
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

      {/* Edit Project Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
        className={styles.editDialog}
        PaperProps={{
          className: `${styles.editDialogPaper} ${isDarkMode ? styles.darkEditDialogPaper : ""}`,
        }}
      >
        <Box className={`${styles.editModalContent} ${isDarkMode ? styles.darkEditModalContent : ""}`}>
          <Box className={`${styles.editModalHeader} ${isDarkMode ? styles.darkEditModalHeader : ""}`}>
            <Box className={styles.editModalHeaderLeft}>
              <Box className={`${styles.editModalIconWrapper} ${isDarkMode ? styles.darkEditModalIconWrapper : ""}`}>
                <EditIcon className={styles.editModalIcon} />
              </Box>
              <Box>
                <h2 className={`${styles.editModalTitle} ${isDarkMode ? styles.darkEditModalTitle : ""}`}>Edit Project</h2>
                <p className={`${styles.editModalSubtitle} ${isDarkMode ? styles.darkEditModalSubtitle : ""}`}>Update your project details.</p>
              </Box>
            </Box>
            <button 
              className={`${styles.editModalClose} ${isDarkMode ? styles.darkEditModalClose : ""}`} 
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
            >
              <CloseIcon />
            </button>
          </Box>

          <Box className={`${styles.editModalForm} ${isDarkMode ? styles.darkEditModalForm : ""}`}>
            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${isDarkMode ? styles.darkFormLabel : ""}`}>
                Project Name
                <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Q4 Marketing Strategy"
                value={editForm.name}
                onChange={handleEditChange}
                className={`${styles.formInput} ${editErrors.name ? styles.formInputError : ''} ${isDarkMode ? styles.darkFormInput : ""}`}
                disabled={isSubmitting}
              />
              {editErrors.name && (
                <span className={`${styles.formError} ${isDarkMode ? styles.darkFormError : ""}`}>{editErrors.name}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${isDarkMode ? styles.darkFormLabel : ""}`}>
                Description
                <span className={styles.requiredStar}>*</span>
              </label>
              <textarea
                name="description"
                placeholder="Briefly describe the project goals and deliverables..."
                value={editForm.description}
                onChange={handleEditChange}
                className={`${styles.formTextarea} ${editErrors.description ? styles.formInputError : ''} ${isDarkMode ? styles.darkFormTextarea : ""}`}
                rows="3"
                disabled={isSubmitting}
              />
              {editErrors.description && (
                <span className={`${styles.formError} ${isDarkMode ? styles.darkFormError : ""}`}>{editErrors.description}</span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${isDarkMode ? styles.darkFormLabel : ""}`}>Category</label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className={`${styles.formSelect} ${isDarkMode ? styles.darkFormSelect : ""}`}
                  disabled={isSubmitting}
                >
                  {['Marketing', 'Design', 'Development', 'Content', 'Research', 'Documentation'].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${isDarkMode ? styles.darkFormLabel : ""}`}>Priority</label>
                <select
                  name="priority"
                  value={editForm.priority}
                  onChange={handleEditChange}
                  className={`${styles.formSelect} ${isDarkMode ? styles.darkFormSelect : ""}`}
                  disabled={isSubmitting}
                >
                  {['High', 'Medium', 'Low'].map((priority) => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${isDarkMode ? styles.darkFormLabel : ""}`}>
                Due Date
                <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={editForm.dueDate}
                onChange={handleEditChange}
                className={`${styles.formInput} ${editErrors.dueDate ? styles.formInputError : ''} ${isDarkMode ? styles.darkFormInput : ""}`}
                min={new Date().toISOString().split('T')[0]}
                disabled={isSubmitting}
              />
              {editErrors.dueDate && (
                <span className={`${styles.formError} ${isDarkMode ? styles.darkFormError : ""}`}>{editErrors.dueDate}</span>
              )}
            </div>
          </Box>

          <Box className={`${styles.editModalFooter} ${isDarkMode ? styles.darkEditModalFooter : ""}`}>
            <button 
              className={`${styles.cancelBtn} ${isDarkMode ? styles.darkCancelBtn : ""}`} 
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              className={`${styles.saveBtn} ${isDarkMode ? styles.darkSaveBtn : ""}`}
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
          className: `${styles.deleteDialogPaper} ${isDarkMode ? styles.darkDeleteDialogPaper : ""}`,
        }}
      >
        <Box className={`${styles.deleteDialogContent} ${isDarkMode ? styles.darkDeleteDialogContent : ""}`}>
          <Box className={`${styles.deleteDialogIconWrapper} ${isDarkMode ? styles.darkDeleteDialogIconWrapper : ""}`}>
            <DeleteIcon className={`${styles.deleteDialogIcon} ${isDarkMode ? styles.darkDeleteDialogIcon : ""}`} />
          </Box>
          <h3 className={`${styles.deleteDialogTitle} ${isDarkMode ? styles.darkDeleteDialogTitle : ""}`}>Delete Project?</h3>
          <p className={`${styles.deleteDialogText} ${isDarkMode ? styles.darkDeleteDialogText : ""}`}>
            Are you sure you want to delete <strong>"{project.name}"</strong>?<br />
            This action cannot be undone and all associated tasks will be removed.
          </p>
          <Box className={styles.deleteDialogActions}>
            <button onClick={() => setIsDeleteModalOpen(false)} className={`${styles.deleteDialogCancel} ${isDarkMode ? styles.darkDeleteDialogCancel : ""}`}>
              Cancel
            </button>
            <button onClick={handleDeleteProject} className={`${styles.deleteDialogConfirm} ${isDarkMode ? styles.darkDeleteDialogConfirm : ""}`} disabled={isLoading}>
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