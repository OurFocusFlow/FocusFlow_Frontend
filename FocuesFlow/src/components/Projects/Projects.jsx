import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Folder as FolderIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Q4 Marketing Strategy',
      description: 'Comprehensive marketing plan for Q4 2024 including digital campaigns, content strategy, and budget allocation.',
      status: 'Active',
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
      status: 'Active',
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
      status: 'Planning',
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
      status: 'Completed',
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
      status: 'Active',
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
      status: 'Active',
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

  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    category: 'Design',
    status: 'Planning',
    dueDate: '',
  });

  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    category: '',
    dueDate: '',
    status: '',
  });

  const [createErrors, setCreateErrors] = useState({
    name: '',
  });

  const showToast = (type, message, title) => {
    setToast({ type, message, title });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const statusOptions = ['All', 'Active', 'Planning', 'Completed'];
  const categoryOptions = ['All', 'Marketing', 'Design', 'Development', 'Content', 'Research', 'Documentation'];

  const getStatusColor = (status) => {
    const map = {
      Active: styles.statusActive,
      Planning: styles.statusPlanning,
      Completed: styles.statusCompleted,
    };
    return map[status] || '';
  };

  const getStatusDotColor = (status) => {
    const map = {
      Active: '#059669',
      Planning: '#d97706',
      Completed: '#059669',
    };
    return map[status] || '#7E7471';
  };

  const filteredProjects = projects
    .filter((p) => {
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
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
    active: projects.filter(p => p.status === 'Active').length,
    planning: projects.filter(p => p.status === 'Planning').length,
    completed: projects.filter(p => p.status === 'Completed').length,
  };

  const handleMenuOpen = (event, project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStarToggle = (id) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, starred: !p.starred } : p
    ));
    const project = projects.find(p => p.id === id);
    showToast('success', `Project ${project?.starred ? 'unstarred' : 'starred'}`, 'Project Updated');
  };

  const handleDeleteProject = () => {
    setProjects(prev => prev.filter(p => p.id !== selectedProject.id));
    setShowDeleteModal(false);
    setSelectedProject(null);
    showToast('success', `Project "${selectedProject?.name}" has been deleted.`, 'Project Deleted');
  };

  const handleEditProject = () => {
    setEditForm({
      name: selectedProject.name,
      description: selectedProject.description,
      category: selectedProject.category,
      dueDate: selectedProject.dueDate,
      status: selectedProject.status,
    });
    setShowEditModal(true);
    handleMenuClose();
  };

  const handleSaveEdit = () => {
    setProjects(prev => prev.map(p =>
      p.id === selectedProject.id
        ? {
            ...p,
            name: editForm.name,
            description: editForm.description,
            category: editForm.category,
            dueDate: editForm.dueDate,
            status: editForm.status,
          }
        : p
    ));
    setShowEditModal(false);
    setSelectedProject(null);
    showToast('success', `Project "${editForm.name}" has been updated.`, 'Project Updated');
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({ ...prev, [name]: value }));
    if (createErrors[name]) {
      setCreateErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCreateProject = () => {
    if (!createForm.name.trim()) {
      setCreateErrors({ name: 'Project name is required' });
      showToast('error', 'Please enter a project name.', 'Missing Name');
      return;
    }

    setIsSubmitting(true);
    
    const newProject = {
      id: Date.now(),
      name: createForm.name,
      description: createForm.description || 'No description provided.',
      status: createForm.status,
      progress: 0,
      category: createForm.category,
      team: ['You'],
      tasks: 0,
      completed: 0,
      dueDate: createForm.dueDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      starred: false,
      color: '#FBEAD9',
    };
    
    setProjects(prev => [newProject, ...prev]);
    setShowCreateModal(false);
    setCreateForm({
      name: '',
      description: '',
      category: 'Design',
      status: 'Planning',
      dueDate: '',
    });
    setCreateErrors({ name: '' });
    setIsSubmitting(false);
    showToast('success', `Project "${newProject.name}" has been created.`, 'Project Created');
  };

  const handleViewProject = (id) => {
    navigate(`/project/${id}`);
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
              <Box className={`${styles.statIconWrap} ${styles.iconActive}`}>
                <Icon name="check" className={styles.statIcon} />
              </Box>
              <span className={styles.statTrend}>Active</span>
            </Box>
            <span className={styles.statLabel}>In Progress</span>
            <span className={styles.statValue}>{stats.active}</span>
          </Box>

          <Box className={styles.statBox}>
            <Box className={styles.statTop}>
              <Box className={`${styles.statIconWrap} ${styles.iconPlanning}`}>
                <Icon name="clock" className={styles.statIcon} />
              </Box>
              <span className={styles.statTrend}>Planning</span>
            </Box>
            <span className={styles.statLabel}>Upcoming</span>
            <span className={styles.statValue}>{stats.planning}</span>
          </Box>

          <Box className={styles.statBox}>
            <Box className={styles.statTop}>
              <Box className={`${styles.statIconWrap} ${styles.iconCompleted}`}>
                <Icon name="check" className={styles.statIcon} />
              </Box>
              <span className={`${styles.statTrend} ${styles.trendPositive}`}>Done</span>
            </Box>
            <span className={styles.statLabel}>Completed</span>
            <span className={styles.statValue}>{stats.completed}</span>
          </Box>
        </Box>

        {/* Filters */}
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
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option === 'All' ? 'all' : option}>
                  {option}
                </option>
              ))}
            </select>

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

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Box className={styles.emptyState}>
            <span className={styles.emptyIcon}>📂</span>
            <h3 className={styles.emptyTitle}>No projects found</h3>
            <p className={styles.emptyText}>
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
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
                        <span className={`${styles.statusBadge} ${getStatusColor(project.status)}`}>
                          <span 
                            className={styles.statusDot} 
                            style={{ backgroundColor: getStatusDotColor(project.status) }}
                          />
                          {project.status}
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
        <MenuItem onClick={() => setShowDeleteModal(true)} className={styles.menuItemDanger}>
          <Icon name="trash" className={styles.menuIcon} />
          Delete Project
        </MenuItem>
      </Menu>

      {/* Create Project Modal - Like CreateTaskModal */}
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
              <label className={styles.formLabel}>Description</label>
              <textarea
                name="description"
                placeholder="Briefly describe the project goals and deliverables..."
                value={createForm.description}
                onChange={handleCreateInputChange}
                className={styles.formTextarea}
                rows="3"
                disabled={isSubmitting}
              />
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
                <label className={styles.formLabel}>Status</label>
                <select
                  name="status"
                  value={createForm.status}
                  onChange={handleCreateInputChange}
                  className={styles.formSelect}
                  disabled={isSubmitting}
                >
                  {statusOptions.filter(s => s !== 'All').map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={createForm.dueDate}
                onChange={handleCreateInputChange}
                className={styles.formInput}
                disabled={isSubmitting}
              />
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
              <label className={styles.formLabel}>Description</label>
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
                <label className={styles.formLabel}>Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className={styles.formSelect}
                >
                  {statusOptions.filter(s => s !== 'All').map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Due Date</label>
              <input
                type="date"
                value={editForm.dueDate}
                onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                className={styles.formInput}
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