import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
  AvatarGroup,
  Dialog,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useProjects } from '../Context/ProjectContext';
import styles from './Projects.module.css';
import ToastNotification from '../ToastNotification/ToastNotification';

function Icon({ name, className }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14" strokeLinecap="round" />,
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
      </>
    ),
    folder: (
      <>
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12.5 2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    alertCircle: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5m0 3h.01" strokeLinecap="round" />
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
    arrowForward: <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />,
    star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    starBorder: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />,
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

const Projects = () => {
  const navigate = useNavigate();
  const { 
    projects, 
    addProject, 
    updateProject, 
    deleteProject, 
    toggleProjectStar,
    isLoading 
  } = useProjects();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    category: 'Design',
    priority: 'Medium',
    dueDate: '',
  });

  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    category: '',
    dueDate: '',
    priority: '',
  });

  const [createErrors, setCreateErrors] = useState({
    name: '',
    description: '',
    dueDate: '',
  });

  // Get today's date for validation
  const today = new Date().toISOString().split('T')[0];

  const showToast = (type, message, title) => {
    setToast({ type, message, title });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const priorityOptions = ['All', 'High', 'Medium', 'Low'];
  const categoryOptions = ['All', 'Marketing', 'Design', 'Development', 'Content', 'Research', 'Documentation'];

  const getPriorityColor = (priority) => {
    const map = {
      High: styles.priorityHigh,
      Medium: styles.priorityMedium,
      Low: styles.priorityLow,
    };
    return map[priority] || '';
  };

  const getPriorityDotColor = (priority) => {
    const map = {
      High: '#dc2626',
      Medium: '#d97706',
      Low: '#059669',
    };
    return map[priority] || '#7E7471';
  };

  const filteredProjects = projects
    .filter((p) => {
      if (filterPriority !== 'all' && p.priority !== filterPriority) return false;
      if (filterCategory !== 'all' && p.category !== filterCategory) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return p.name.toLowerCase().includes(search) || 
               p.description.toLowerCase().includes(search) ||
               p.category.toLowerCase().includes(search);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.created) - new Date(a.created);
      if (sortBy === 'progress') return b.progress - a.progress;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const stats = {
    total: projects.length,
    high: projects.filter(p => p.priority === 'High').length,
    medium: projects.filter(p => p.priority === 'Medium').length,
    low: projects.filter(p => p.priority === 'Low').length,
  };

  const handleMenuOpen = (event, project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStarToggle = async (id) => {
    const result = await toggleProjectStar(id);
    if (result.success) {
      const project = projects.find(p => p.id === id);
      showToast('success', `Project ${project?.starred ? 'unstarred' : 'starred'}`, 'Project Updated');
    }
  };

  const handleDeleteProject = async () => {
    const result = await deleteProject(selectedProject.id);
    setShowDeleteModal(false);
    setSelectedProject(null);
    if (result.success) {
      showToast('success', `Project "${selectedProject?.name}" has been deleted.`, 'Project Deleted');
    } else {
      showToast('error', 'Failed to delete project', 'Error');
    }
  };

  const handleEditProject = () => {
    // Convert dueDate from display format to input format if needed
    let dueDateValue = '';
    if (selectedProject.dueDate) {
      const dateParts = selectedProject.dueDate.split(' ');
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
      name: selectedProject.name,
      description: selectedProject.description,
      category: selectedProject.category,
      dueDate: dueDateValue,
      priority: selectedProject.priority,
    });
    setShowEditModal(true);
    handleMenuClose();
  };

  const handleSaveEdit = async () => {
    // Validate Name
    if (!editForm.name.trim()) {
      showToast('error', 'Please enter a project name.', 'Missing Name');
      return;
    }

    // Validate Description
    if (!editForm.description.trim()) {
      showToast('error', 'Please enter a project description.', 'Missing Description');
      return;
    }

    // Validate Due Date
    if (!editForm.dueDate) {
      showToast('error', 'Please select a due date.', 'Missing Due Date');
      return;
    }

    // Validate Due Date is not in the past
    if (editForm.dueDate < today) {
      showToast('error', 'Due date cannot be in the past. Please select a future date.', 'Invalid Date');
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

    const result = await updateProject(selectedProject.id, updatedData);
    setShowEditModal(false);
    setSelectedProject(null);
    if (result.success) {
      showToast('success', `Project "${editForm.name}" has been updated.`, 'Project Updated');
    } else {
      showToast('error', 'Failed to update project', 'Error');
    }
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({ ...prev, [name]: value }));
    if (createErrors[name]) {
      setCreateErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCreateProject = async () => {
    // Validate Name
    if (!createForm.name.trim()) {
      setCreateErrors(prev => ({ ...prev, name: 'Project name is required' }));
      showToast('error', 'Please enter a project name.', 'Missing Name');
      return;
    }

    // Validate Description
    if (!createForm.description.trim()) {
      setCreateErrors(prev => ({ ...prev, description: 'Description is required' }));
      showToast('error', 'Please enter a project description.', 'Missing Description');
      return;
    }

    // Validate Due Date
    if (!createForm.dueDate) {
      setCreateErrors(prev => ({ ...prev, dueDate: 'Due date is required' }));
      showToast('error', 'Please select a due date.', 'Missing Due Date');
      return;
    }

    // Validate Due Date is not in the past
    if (createForm.dueDate < today) {
      setCreateErrors(prev => ({ ...prev, dueDate: 'Due date cannot be in the past' }));
      showToast('error', 'Due date cannot be in the past. Please select a future date.', 'Invalid Date');
      return;
    }

    setIsSubmitting(true);
    
    // Format date for display
    const dateObj = new Date(createForm.dueDate + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const projectData = {
      name: createForm.name,
      description: createForm.description,
      priority: createForm.priority,
      category: createForm.category,
      dueDate: formattedDate,
    };

    const result = await addProject(projectData);
    setShowCreateModal(false);
    setCreateForm({
      name: '',
      description: '',
      category: 'Design',
      priority: 'Medium',
      dueDate: '',
    });
    setCreateErrors({ name: '', description: '', dueDate: '' });
    setIsSubmitting(false);
    
    if (result.success) {
      showToast('success', `Project "${result.project.name}" has been created.`, 'Project Created');
    } else {
      showToast('error', 'Failed to create project', 'Error');
    }
  };

  const handleViewProject = (id) => {
    navigate(`/project/${id}`);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setShowDeleteModal(true);
  };

  return (
    <Box className={styles.page}>
      {/* Background Decorations */}
      <div className={styles["projects-bg"]}>
        <div className={styles["projects-bg-orb"]} />
        <div className={styles["projects-bg-orb"]} />
        <div className={styles["projects-bg-orb"]} />
        <div className={styles["projects-bg-grid"]} />
        <div className={styles["projects-bg-glow"]} />
      </div>

      <Box className={styles.pageInner}>
        {/* Page Header */}
        <Box className={styles.pageHeader}>
          <Box className={styles.pageHeaderLeft}>
            <h1 className={styles.pageTitle}>Projects</h1>
            <p className={styles.pageSubtitle}>Manage and track all your projects in one place</p>
          </Box>
          <button
            className={styles.createBtn}
            onClick={() => setShowCreateModal(true)}
          >
            <Icon name="plus" className={styles.createBtnIcon} />
            New Project
          </button>
        </Box>

        {/* Stats Row */}
        <Box className={styles.statsRow}>
          <Box className={styles.statBox}>
            <Box className={styles.statTop}>
              <Box className={`${styles.statIconWrap} ${styles.iconTotal}`}>
                <Icon name="folder" className={styles.statIcon} />
              </Box>
              <span className={styles.statTrend}>Total</span>
            </Box>
            <span className={styles.statLabel}>All Projects</span>
            <span className={styles.statValue}>{stats.total}</span>
          </Box>

          <Box className={styles.statBox}>
            <Box className={styles.statTop}>
              <Box className={`${styles.statIconWrap} ${styles.iconHigh}`}>
                <Icon name="alertCircle" className={styles.statIcon} />
              </Box>
              <span className={styles.statTrend}>High</span>
            </Box>
            <span className={styles.statLabel}>High Priority</span>
            <span className={styles.statValue}>{stats.high}</span>
          </Box>

          <Box className={styles.statBox}>
            <Box className={styles.statTop}>
              <Box className={`${styles.statIconWrap} ${styles.iconMedium}`}>
                <Icon name="clock" className={styles.statIcon} />
              </Box>
              <span className={styles.statTrend}>Medium</span>
            </Box>
            <span className={styles.statLabel}>Medium Priority</span>
            <span className={styles.statValue}>{stats.medium}</span>
          </Box>

          <Box className={styles.statBox}>
            <Box className={styles.statTop}>
              <Box className={`${styles.statIconWrap} ${styles.iconLow}`}>
                <Icon name="check" className={styles.statIcon} />
              </Box>
              <span className={`${styles.statTrend} ${styles.trendPositive}`}>Low</span>
            </Box>
            <span className={styles.statLabel}>Low Priority</span>
            <span className={styles.statValue}>{stats.low}</span>
          </Box>
        </Box>

        {/* Filters with Labels */}
        <Box className={styles.filtersSection}>
          <Box className={styles.searchWrapper}>
            <Icon name="search" className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </Box>

          <Box className={styles.filterGroup}>
            {/* Priority Filter */}
            <Box className={styles.filterWrapper}>
              <label className={styles.filterLabel}>Priority</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className={styles.filterSelect}
              >
                {priorityOptions.map((option) => (
                  <option key={option} value={option === 'All' ? 'all' : option}>
                    {option}
                  </option>
                ))}
              </select>
            </Box>

            {/* Category Filter */}
            <Box className={styles.filterWrapper}>
              <label className={styles.filterLabel}>Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={styles.filterSelect}
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option === 'All' ? 'all' : option}>
                    {option}
                  </option>
                ))}
              </select>
            </Box>

            {/* Sort By */}
            <Box className={styles.filterWrapper}>
              <label className={styles.filterLabel}>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="recent">Most Recent</option>
                <option value="progress">Progress</option>
                <option value="name">Name</option>
              </select>
            </Box>
          </Box>
        </Box>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Box className={styles.emptyState}>
            <span className={styles.emptyIcon}>📂</span>
            <h3 className={styles.emptyTitle}>No projects found</h3>
            <p className={styles.emptyText}>
              {searchTerm || filterPriority !== 'all' || filterCategory !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Create your first project to get started'}
            </p>
          </Box>
        ) : (
          <Box className={styles.projectsGrid}>
            {filteredProjects.map((project) => (
              <Box key={project.id} className={styles.projectCard}>
                {/* Header */}
                <Box className={styles.projectCardHeader}>
                  <Box className={styles.projectCardTitleWrapper}>
                    <Box 
                      className={styles.projectColorBar} 
                      style={{ backgroundColor: project.color || '#E6E2DF' }}
                    />
                    <Box>
                      <h3 className={styles.projectName}>{project.name}</h3>
                      <Box className={styles.projectBadges}>
                        <span className={`${styles.priorityBadge} ${getPriorityColor(project.priority)}`}>
                          <span 
                            className={styles.priorityDot} 
                            style={{ backgroundColor: getPriorityDotColor(project.priority) }}
                          />
                          {project.priority}
                        </span>
                        <span className={styles.categoryBadge}>
                          {project.category}
                        </span>
                      </Box>
                    </Box>
                  </Box>
                  <Box className={styles.projectCardActions}>
                    <button 
                      className={styles.starBtn}
                      onClick={() => handleStarToggle(project.id)}
                    >
                      {project.starred ? (
                        <Icon name="star" className={styles.starIconActive} />
                      ) : (
                        <Icon name="starBorder" className={styles.starIcon} />
                      )}
                    </button>
                    <button
                      className={styles.moreBtn}
                      onClick={(e) => handleMenuOpen(e, project)}
                    >
                      <MoreVertIcon className={styles.moreIcon} />
                    </button>
                  </Box>
                </Box>

                {/* Description */}
                <p className={styles.projectDescription}>{project.description}</p>

                {/* Progress */}
                <Box className={styles.progressSection}>
                  <Box className={styles.progressHeader}>
                    <span className={styles.progressLabel}>Progress</span>
                    <span className={styles.progressValue}>{project.progress}%</span>
                  </Box>
                  <Box className={styles.progressBarWrapper}>
                    <Box 
                      className={styles.progressBar}
                      style={{ width: `${project.progress}%` }}
                    />
                  </Box>
                </Box>

                {/* Meta Info */}
                <Box className={styles.projectMeta}>
                  <Box className={styles.metaItem}>
                    <span className={styles.metaLabel}>Tasks</span>
                    <span className={styles.metaValue}>
                      {project.completed}/{project.tasks}
                    </span>
                  </Box>
                  <Box className={styles.metaItem}>
                    <span className={styles.metaLabel}>Due Date</span>
                    <span className={styles.metaValue}>{project.dueDate}</span>
                  </Box>
                </Box>

                {/* Footer */}
                <Box className={styles.projectCardFooter}>
                  <AvatarGroup max={3} className={styles.teamAvatars}>
                    {project.team.map((member, index) => (
                      <Avatar key={index} className={styles.teamAvatar}>
                        {member}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                  <button 
                    className={styles.viewBtn}
                    onClick={() => handleViewProject(project.id)}
                  >
                    View Project
                    <Icon name="arrowForward" className={styles.viewBtnIcon} />
                  </button>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className={styles.menu}
        classes={{
          paper: styles.menuPaper,
        }}
      >
        <MenuItem onClick={handleEditProject} className={styles.menuItem}>
          <Icon name="edit" className={styles.menuIcon} />
          Edit Project
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} className={styles.menuItemDanger}>
          <Icon name="trash" className={styles.menuIcon} />
          Delete Project
        </MenuItem>
      </Menu>

      {/* Create Project Modal */}
      <Dialog
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        maxWidth="sm"
        fullWidth
        className={styles.createDialog}
        PaperProps={{
          className: styles.createDialogPaper,
        }}
      >
        <Box className={styles.createModalContent}>
          <Box className={styles.createModalHeader}>
            <Box className={styles.createModalHeaderLeft}>
              <Box className={styles.createModalIconWrapper}>
                <Icon name="folder" className={styles.createModalIcon} />
              </Box>
              <Box>
                <h2 className={styles.createModalTitle}>Create New Project</h2>
                <p className={styles.createModalSubtitle}>Set up a new project to organize your team's work.</p>
              </Box>
            </Box>
            <button 
              className={styles.createModalClose} 
              onClick={() => setShowCreateModal(false)}
              disabled={isSubmitting}
            >
              <CloseIcon />
            </button>
          </Box>

          <Box className={styles.createModalForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Project Name
                <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Q4 Marketing Strategy"
                value={createForm.name}
                onChange={handleCreateInputChange}
                className={`${styles.formInput} ${createErrors.name ? styles.formInputError : ''}`}
                disabled={isSubmitting}
              />
              {createErrors.name && (
                <span className={styles.formError}>{createErrors.name}</span>
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
                value={createForm.description}
                onChange={handleCreateInputChange}
                className={`${styles.formTextarea} ${createErrors.description ? styles.formInputError : ''}`}
                rows="3"
                disabled={isSubmitting}
              />
              {createErrors.description && (
                <span className={styles.formError}>{createErrors.description}</span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category</label>
                <select
                  name="category"
                  value={createForm.category}
                  onChange={handleCreateInputChange}
                  className={styles.formSelect}
                  disabled={isSubmitting}
                >
                  {categoryOptions.filter(c => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Priority</label>
                <select
                  name="priority"
                  value={createForm.priority}
                  onChange={handleCreateInputChange}
                  className={styles.formSelect}
                  disabled={isSubmitting}
                >
                  {priorityOptions.filter(p => p !== 'All').map((priority) => (
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
                value={createForm.dueDate}
                onChange={handleCreateInputChange}
                className={`${styles.formInput} ${createErrors.dueDate ? styles.formInputError : ''}`}
                min={today}
                disabled={isSubmitting}
              />
              {createErrors.dueDate && (
                <span className={styles.formError}>{createErrors.dueDate}</span>
              )}
            </div>
          </Box>

          <Box className={styles.createModalFooter}>
            <button 
              className={styles.cancelBtn} 
              onClick={() => setShowCreateModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              className={styles.saveBtn}
              onClick={handleCreateProject}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner} />
                  Creating...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Create Project
                </>
              )}
            </button>
          </Box>
        </Box>
      </Dialog>

      {/* Edit Project Modal */}
      <Dialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        maxWidth="sm"
        fullWidth
        className={styles.createDialog}
        PaperProps={{
          className: styles.createDialogPaper,
        }}
      >
        <Box className={styles.createModalContent}>
          <Box className={styles.createModalHeader}>
            <Box className={styles.createModalHeaderLeft}>
              <Box className={styles.createModalIconWrapper}>
                <Icon name="folder" className={styles.createModalIcon} />
              </Box>
              <Box>
                <h2 className={styles.createModalTitle}>Edit Project</h2>
                <p className={styles.createModalSubtitle}>Update your project details.</p>
              </Box>
            </Box>
            <button 
              className={styles.createModalClose} 
              onClick={() => setShowEditModal(false)}
            >
              <CloseIcon />
            </button>
          </Box>

          <Box className={styles.createModalForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Project Name
                <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Q4 Marketing Strategy"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Description
                <span className={styles.requiredStar}>*</span>
              </label>
              <textarea
                placeholder="Briefly describe the project goals and deliverables..."
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className={styles.formTextarea}
                rows="3"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className={styles.formSelect}
                >
                  {categoryOptions.filter(c => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Priority</label>
                <select
                  value={editForm.priority}
                  onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                  className={styles.formSelect}
                >
                  {priorityOptions.filter(p => p !== 'All').map((priority) => (
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
                value={editForm.dueDate}
                onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                className={styles.formInput}
                min={today}
              />
            </div>
          </Box>

          <Box className={styles.createModalFooter}>
            <button 
              className={styles.cancelBtn} 
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
            <button 
              className={styles.saveBtn}
              onClick={handleSaveEdit}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Save Changes
            </button>
          </Box>
        </Box>
      </Dialog>

      {/* Delete Modal */}
      <Dialog
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
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
            Are you sure you want to delete <strong>"{selectedProject?.name}"</strong>?<br />
            This action cannot be undone and all associated tasks will be removed.
          </p>
          <Box className={styles.deleteDialogActions}>
            <button onClick={() => setShowDeleteModal(false)} className={styles.deleteDialogCancel}>
              Cancel
            </button>
            <button onClick={handleDeleteProject} className={styles.deleteDialogConfirm}>
              Yes, Delete
            </button>
          </Box>
        </Box>
      </Dialog>

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

export default Projects;