import React, { useState } from 'react';
import {
  Box, Typography, TextField, Select, MenuItem, Button,
  Accordion, AccordionSummary, AccordionDetails, InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
  MenuBook as MenuBookIcon,
  Groups as GroupsIcon,
  ConfirmationNumber as TicketIcon,
  CheckCircle as CheckCircleIcon,
  ArrowOutward as ArrowOutwardIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { useDarkMode } from '../Context/DarkModeContext';
import { useAccentColor } from '../Context/AccentColorContext';
import styles from './Support.module.css';

// Helper function to convert hex to rgb
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `${r}, ${g}, ${b}`;
  }
  return '251, 188, 0';
};

// Helper function to check if accent color is the default amber
const isDefaultAmber = (hex) => {
  return hex && hex.toLowerCase() === '#fbbc00';
};

// FAQ data with topics
const FAQS = [
  { q: 'How do I create a new task?', a: 'Click "New Task" in the sidebar, or press N anywhere in the app. Fill in the title, description, due date, and priority, then save.', topic: 'Getting Started' },
  { q: 'Can I share a project with my team?', a: 'Open any project, click "Share" in the top right, and invite teammates by email. You can set their role to Viewer, Editor, or Admin.', topic: 'Team Collaboration' },
  { q: 'How do I reset my password?', a: 'Go to Settings → Security → Change Password. You\'ll get a confirmation email once it\'s updated.', topic: 'Account & Billing' },
  { q: 'Is there a mobile app?', a: 'BrewTask is fully responsive in the browser. A dedicated iOS and Android app is on our roadmap.', topic: 'Getting Started' },
  { q: 'What happens to my data if I delete my account?', a: 'All tasks, projects, and history are permanently erased within 30 days and cannot be recovered after that window.', topic: 'Account & Billing' },
  { q: 'How do I turn off notifications?', a: 'Go to Settings → Notifications and toggle off Desktop Alerts, Email Notifications, or Daily Summary individually.', topic: 'Notifications' },
  { q: 'Can I integrate BrewTask with other tools?', a: 'Yes! BrewTask supports integrations with Slack, Google Calendar, Trello, and more. Check the Integrations section in Settings.', topic: 'Integrations' },
  { q: 'What should I do if I encounter a bug?', a: 'Please submit a ticket through our Support page with steps to reproduce the issue. Our team will review it within 24 hours.', topic: 'Troubleshooting' },
  { q: 'How do I invite team members?', a: 'Go to Team → Invite Members. Enter their email addresses and select their role. They\'ll receive an invitation email.', topic: 'Team Collaboration' },
  { q: 'Is there a free trial?', a: 'Yes! BrewTask offers a 14-day free trial with full access to all features. No credit card required.', topic: 'Account & Billing' },
  { q: 'How do I manage notifications for my team?', a: 'Admins can configure team notification settings in Settings → Notifications. You can set default preferences for all members.', topic: 'Notifications' },
  { q: 'Can I export my data?', a: 'Yes, you can export your tasks, projects, and team data in CSV or JSON format from Settings → Data Export.', topic: 'Integrations' },
];

const TOPICS = ['All', 'Getting Started', 'Account & Billing', 'Team Collaboration', 'Notifications', 'Integrations', 'Troubleshooting'];

const CHANNELS = [
  { icon: <EmailIcon />, label: 'Email Support', detail: 'support@brewtask.com', action: 'Send email', href: 'mailto:support@brewtask.com' },
  { icon: <ChatIcon />, label: 'Live Chat', detail: 'Avg. reply time: 4 min', action: 'Start chat' },
  { icon: <GroupsIcon />, label: 'Community Forum', detail: 'Ask other BrewTask users', action: 'Visit forum' },
  { icon: <MenuBookIcon />, label: 'Documentation', detail: 'Guides & API reference', action: 'Read docs' },
];

const Support = () => {
  const { isDarkMode } = useDarkMode();
  const { accentColor } = useAccentColor();
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [expanded, setExpanded] = useState(false);
  const [category, setCategory] = useState('technical');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const issuedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  // Determine if accent should be used (only in dark mode AND when not default amber)
  const shouldUseAccent = isDarkMode && !isDefaultAmber(accentColor);
  
  // Convert accent color to RGB for CSS variables
  const accentRgb = hexToRgb(accentColor);

  // Determine the accent color to use
  const getAccentColor = () => {
    if (shouldUseAccent) {
      return accentColor;
    }
    if (isDarkMode) {
      return '#FBBC00'; // Default amber in dark mode
    }
    return '#885210'; // Default orange in light mode
  };

  const getAccentRgb = () => {
    if (shouldUseAccent) {
      return accentRgb;
    }
    if (isDarkMode) {
      return '251, 188, 0';
    }
    return '136, 82, 16';
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSubmitTicket = () => {
    if (!subject.trim() || !message.trim()) return;
    const num = `BT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketNumber(num);
    setSubmitted(true);
  };

  const handleNewTicket = () => {
    setSubmitted(false);
    setSubject('');
    setMessage('');
    setCategory('technical');
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setSearch('');
  };

  const filteredFaqs = FAQS.filter((item) => {
    const matchesSearch = search === '' || 
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase());
    
    const matchesTopic = selectedTopic === 'All' || item.topic === selectedTopic;
    
    return matchesSearch && matchesTopic;
  });

  return (
    <Box 
      className={`${styles.page} ${isDarkMode ? styles.darkPage : ''}`}
      style={{
        '--accent-color': getAccentColor(),
        '--accent-rgb': getAccentRgb(),
      }}
    >
      {/* Background Decorations - Same as MyTasks */}
      <div className={`${styles["support-bg"]} ${isDarkMode ? styles.darkSupportBg : ''}`}>
        <div className={styles["support-bg-orb"]} />
        <div className={styles["support-bg-orb"]} />
        <div className={styles["support-bg-orb"]} />
        <div className={`${styles["support-bg-grid"]} ${isDarkMode ? styles.darkSupportBgGrid : ''}`} />
        <div className={`${styles["support-bg-glow"]} ${isDarkMode ? styles.darkSupportBgGlow : ''}`} />
      </div>

      <Box className={`${styles.pageInner} ${isDarkMode ? styles.darkPageInner : ''}`}>
        {/* Page Header - Same style as MyTasks */}
        <Box className={`${styles.pageHeader} ${isDarkMode ? styles.darkPageHeader : ''}`}>
          <Typography className={`${styles.pageTitle} ${isDarkMode ? styles.darkPageTitle : ''}`} style={{ fontSize: "50px" , fontWeight: "bold" }}>Support</Typography>
          <Typography className={`${styles.pageSubtitle} ${isDarkMode ? styles.darkPageSubtitle : ''}`} style={{ fontSize: "20px" }}>Find answers, or reach out and we'll help you brew through it.</Typography>
        </Box>

        {/* Stats Row - Similar to MyTasks stats */}
        <Box className={styles.statsRow}>
          <Box className={`${styles.statBox} ${isDarkMode ? styles.darkStatBox : ''}`}>
            <Box className={styles.statTop}>
              <Box className={`${styles.statIconWrap} ${styles.iconFaq} ${isDarkMode ? styles.darkIconFaq : ''}`}>
                <HelpIcon className={`${styles.statIcon} ${isDarkMode ? styles.darkStatIcon : ''}`} />
              </Box>
              <span className={`${styles.statTrend} ${isDarkMode ? styles.darkStatTrend : ''}`}>{FAQS.length}</span>
            </Box>
            <span className={`${styles.statLabel} ${isDarkMode ? styles.darkStatLabel : ''}`}>Articles</span>
            <span className={`${styles.statValue} ${isDarkMode ? styles.darkStatValue : ''}`}>FAQ</span>
          </Box>

          <Box className={`${styles.statBox} ${isDarkMode ? styles.darkStatBox : ''}`}>
            <Box className={styles.statTop}>
              <Box className={`${styles.statIconWrap} ${styles.iconChannels} ${isDarkMode ? styles.darkIconChannels : ''}`}>
                <ChatIcon className={`${styles.statIcon} ${isDarkMode ? styles.darkStatIcon : ''}`} />
              </Box>
              <span className={`${styles.statTrend} ${isDarkMode ? styles.darkStatTrend : ''}`}>{CHANNELS.length}</span>
            </Box>
            <span className={`${styles.statLabel} ${isDarkMode ? styles.darkStatLabel : ''}`}>Support Channels</span>
            <span className={`${styles.statValue} ${isDarkMode ? styles.darkStatValue : ''}`}>Available</span>
          </Box>

          <Box className={`${styles.statBox} ${isDarkMode ? styles.darkStatBox : ''}`}>
            <Box className={styles.statTop}>
              <Box className={`${styles.statIconWrap} ${styles.iconTicket} ${isDarkMode ? styles.darkIconTicket : ''}`}>
                <TicketIcon className={`${styles.statIcon} ${isDarkMode ? styles.darkStatIcon : ''}`} />
              </Box>
              <span className={`${styles.statTrend} ${isDarkMode ? styles.darkStatTrend : ''}`}>24/7</span>
            </Box>
            <span className={`${styles.statLabel} ${isDarkMode ? styles.darkStatLabel : ''}`}>Support Hours</span>
            <span className={`${styles.statValue} ${isDarkMode ? styles.darkStatValue : ''}`}>Always Open</span>
          </Box>

          <Box className={`${styles.statBox} ${isDarkMode ? styles.darkStatBox : ''}`}>
            <Box className={styles.statTop}>
              <Box className={`${styles.statIconWrap} ${styles.iconResponse} ${isDarkMode ? styles.darkIconResponse : ''}`}>
                <CheckCircleIcon className={`${styles.statIcon} ${isDarkMode ? styles.darkStatIcon : ''}`} />
              </Box>
              <span className={`${styles.statTrend} ${styles.trendPositive} ${isDarkMode ? styles.darkStatTrend : ''}`}>~4 min</span>
            </Box>
            <span className={`${styles.statLabel} ${isDarkMode ? styles.darkStatLabel : ''}`}>Avg Response</span>
            <span className={`${styles.statValue} ${isDarkMode ? styles.darkStatValue : ''}`}>Fast</span>
          </Box>
        </Box>

        {/* Search + Topics */}
        <Box className={`${styles.section} ${isDarkMode ? styles.darkSection : ''}`}>
          <Box className={`${styles.searchWrapper} ${isDarkMode ? styles.darkSearchWrapper : ''}`}>
            <SearchIcon className={`${styles.searchIcon} ${isDarkMode ? styles.darkSearchIcon : ''}`} />
            <input
              type="text"
              placeholder="Search the help center…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${styles.searchInput} ${isDarkMode ? styles.darkSearchInput : ''}`}
            />
            {search && (
              <button 
                className={`${styles.clearSearchBtn} ${isDarkMode ? styles.darkClearSearchBtn : ''}`}
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </Box>
          <Box className={styles.topicRow}>
            {TOPICS.map((topic) => (
              <Box 
                key={topic} 
                className={`${styles.topicChip} ${selectedTopic === topic ? styles.topicChipActive : ''} ${isDarkMode ? styles.darkTopicChip : ''}`}
                onClick={() => handleTopicClick(topic)}
              >
                {topic}
              </Box>
            ))}
          </Box>
        </Box>

        {/* FAQ Section - Using Settings-style section */}
        <Box className={`${styles.section} ${isDarkMode ? styles.darkSection : ''}`}>
          <Box className={`${styles.sectionHeader} ${isDarkMode ? styles.darkSectionHeader : ''}`}>
            <Box className={`${styles.sectionIcon} ${isDarkMode ? styles.darkSectionIcon : ''}`}><HelpIcon /></Box>
            <Typography className={`${styles.sectionTitle} ${isDarkMode ? styles.darkSectionTitle : ''}`}>
              Frequently Asked Questions
            </Typography>
            <span className={`${styles.resultCount} ${isDarkMode ? styles.darkResultCount : ''}`}>{filteredFaqs.length} results</span>
          </Box>
          <Box className={`${styles.sectionCard} ${isDarkMode ? styles.darkSectionCard : ''}`}>
            {filteredFaqs.length === 0 ? (
              <Box className={`${styles.emptyState} ${isDarkMode ? styles.darkEmptyState : ''}`}>
                <span className={`${styles.emptyIcon} ${isDarkMode ? styles.darkEmptyIcon : ''}`}>🔍</span>
                <Typography className={`${styles.emptyTitle} ${isDarkMode ? styles.darkEmptyTitle : ''}`}>No results found</Typography>
                <Typography className={`${styles.emptyText} ${isDarkMode ? styles.darkEmptyText : ''}`}>
                  {selectedTopic !== 'All' 
                    ? `No articles found for "${selectedTopic}". Try selecting a different topic.`
                    : 'Try a different search term or submit a ticket below.'}
                </Typography>
                {selectedTopic !== 'All' && (
                  <button 
                    className={`${styles.clearTopicBtn} ${isDarkMode ? styles.darkClearTopicBtn : ''}`}
                    onClick={() => setSelectedTopic('All')}
                  >
                    View all topics
                  </button>
                )}
              </Box>
            ) : (
              filteredFaqs.map((item) => (
                <Accordion
                  key={item.q}
                  expanded={expanded === item.q}
                  onChange={handleAccordionChange(item.q)}
                  className={`${styles.accordion} ${isDarkMode ? styles.darkAccordion : ''}`}
                  disableGutters
                  elevation={0}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon className={`${styles.expandIcon} ${isDarkMode ? styles.darkExpandIcon : ''}`} />}>
                    <Box className={styles.faqHeader}>
                      <Typography className={`${styles.faqQuestion} ${isDarkMode ? styles.darkFaqQuestion : ''}`}>{item.q}</Typography>
                      <span className={`${styles.faqTopic} ${isDarkMode ? styles.darkFaqTopic : ''}`}>{item.topic}</span>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography className={`${styles.faqAnswer} ${isDarkMode ? styles.darkFaqAnswer : ''}`}>{item.a}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </Box>
        </Box>

        {/* Submit a Ticket - Using Settings-style section */}
        <Box className={`${styles.section} ${isDarkMode ? styles.darkSection : ''}`}>
          <Box className={`${styles.sectionHeader} ${isDarkMode ? styles.darkSectionHeader : ''}`}>
            <Box className={`${styles.sectionIcon} ${isDarkMode ? styles.darkSectionIcon : ''}`}><TicketIcon /></Box>
            <Typography className={`${styles.sectionTitle} ${isDarkMode ? styles.darkSectionTitle : ''}`}>Submit a Ticket</Typography>
          </Box>
          <Box className={`${styles.sectionCard} ${isDarkMode ? styles.darkSectionCard : ''}`}>
            {submitted ? (
              <Box className={`${styles.confirmState} ${isDarkMode ? styles.darkConfirmState : ''}`}>
                <Box className={`${styles.confirmIcon} ${isDarkMode ? styles.darkConfirmIcon : ''}`}>✅</Box>
                <Typography className={`${styles.confirmTitle} ${isDarkMode ? styles.darkConfirmTitle : ''}`}>Ticket {ticketNumber} submitted!</Typography>
                <Typography className={`${styles.confirmText} ${isDarkMode ? styles.darkConfirmText : ''}`}>
                  We'll reply to your account email within one business day.
                </Typography>
                <Button className={`${styles.darkButton} ${isDarkMode ? styles.darkButton : ''}`} onClick={handleNewTicket}>
                  Submit another ticket
                </Button>
              </Box>
            ) : (
              <Box className={`${styles.ticketForm} ${isDarkMode ? styles.darkTicketForm : ''}`}>
                <Box className={styles.formRow}>
                  <label className={`${styles.formLabel} ${isDarkMode ? styles.darkFormLabel : ''}`}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`${styles.formSelect} ${isDarkMode ? styles.darkFormSelect : ''}`}
                  >
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing & Account</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </Box>
                <Box className={styles.formRow}>
                  <label className={`${styles.formLabel} ${isDarkMode ? styles.darkFormLabel : ''}`}>Subject <span className={styles.requiredStar}>*</span></label>
                  <input
                    type="text"
                    placeholder="Briefly describe the issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={`${styles.formInput} ${isDarkMode ? styles.darkFormInput : ''}`}
                  />
                </Box>
                <Box className={styles.formRow}>
                  <label className={`${styles.formLabel} ${isDarkMode ? styles.darkFormLabel : ''}`}>Message <span className={styles.requiredStar}>*</span></label>
                  <textarea
                    rows="4"
                    placeholder="Give us the details — what happened, what you expected, and any steps to reproduce it"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`${styles.formTextarea} ${isDarkMode ? styles.darkFormTextarea : ''}`}
                  />
                </Box>
                <Button
                  className={`${styles.primaryButton} ${isDarkMode ? styles.darkPrimaryButton : ''}`}
                  onClick={handleSubmitTicket}
                  disabled={!subject.trim() || !message.trim()}
                >
                  <TicketIcon className={styles.buttonIcon} />
                  Submit Ticket
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {/* Other Channels - Using Settings-style section */}
        <Box className={`${styles.section} ${isDarkMode ? styles.darkSection : ''}`}>
          <Box className={`${styles.sectionHeader} ${isDarkMode ? styles.darkSectionHeader : ''}`}>
            <Box className={`${styles.sectionIcon} ${isDarkMode ? styles.darkSectionIcon : ''}`}><EmailIcon /></Box>
            <Typography className={`${styles.sectionTitle} ${isDarkMode ? styles.darkSectionTitle : ''}`}>Other Ways to Reach Us</Typography>
          </Box>
          <Box className={styles.channelGrid}>
            {CHANNELS.map((ch) => (
              <Box key={ch.label} className={`${styles.channelCard} ${isDarkMode ? styles.darkChannelCard : ''}`}>
                <Box className={`${styles.channelIcon} ${isDarkMode ? styles.darkChannelIcon : ''}`}>{ch.icon}</Box>
                <Box className={styles.channelInfo}>
                  <Typography className={`${styles.channelLabel} ${isDarkMode ? styles.darkChannelLabel : ''}`}>{ch.label}</Typography>
                  <Typography className={`${styles.channelDetail} ${isDarkMode ? styles.darkChannelDetail : ''}`}>{ch.detail}</Typography>
                </Box>
                <Box
                  component={ch.href ? 'a' : 'button'}
                  href={ch.href}
                  className={`${styles.channelAction} ${isDarkMode ? styles.darkChannelAction : ''}`}
                >
                  {ch.action} <ArrowOutwardIcon className={`${styles.channelActionIcon} ${isDarkMode ? styles.darkChannelActionIcon : ''}`} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Support;