import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../Context/DarkModeContext';
import { useAccentColor } from '../Context/AccentColorContext';
import styles from './Home.module.css';
// Import images
import snoozeImage from '../../assets/Images/The-Snooze-Button-Testt-Spotting-the-Decisions-You-Keep-Deferring.jpg';
import splitImage from '../../assets/Images/Image3.png';

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

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.revealed);
          io.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.5 9.2L7.7 11.4L12.5 6.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { accentColor } = useAccentColor();
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const r4 = useReveal();
  
  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Determine if we should use accent color for elements
  const shouldUseAccent = isDarkMode && !isDefaultAmber(accentColor);
  
  // Get accent color RGB
  const accentRgb = hexToRgb(accentColor);

  useEffect(() => {
    // Check authentication status from localStorage
    const token = localStorage.getItem('authToken');
    const name = localStorage.getItem('userName') || 'John Doe';
    const email = localStorage.getItem('userEmail') || 'john@company.com';
    setIsAuthenticated(token !== null);
    setUserName(name);
    setUserEmail(email);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setShowDropdown(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleAvatarClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleStartBrewing = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Theme toggle handler
  const handleThemeToggle = () => {
    toggleDarkMode();
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'JD';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div 
      className={styles.page}
      style={{
        '--accent-color': accentColor,
        '--accent-rgb': accentRgb,
      }}
    >
      {/* Background Decorations */}
      <div className={styles["home-bg"]}>
        <div 
          className={styles["home-bg-orb"]}
          style={{
            background: shouldUseAccent ? `radial-gradient(circle, rgba(${accentRgb}, 0.12) 0%, rgba(${accentRgb}, 0) 70%)` : undefined,
          }}
        />
        <div 
          className={styles["home-bg-orb"]}
          style={{
            background: shouldUseAccent ? `radial-gradient(circle, rgba(${accentRgb}, 0.08) 0%, rgba(${accentRgb}, 0) 70%)` : undefined,
          }}
        />
        <div 
          className={styles["home-bg-orb"]}
          style={{
            background: shouldUseAccent ? `radial-gradient(circle, rgba(${accentRgb}, 0.06) 0%, rgba(${accentRgb}, 0) 70%)` : undefined,
          }}
        />
        <div 
          className={styles["home-bg-grid"]}
          style={{
            backgroundImage: shouldUseAccent ? 
              `linear-gradient(rgba(${accentRgb}, 0.03) 1px, transparent 1px),
               linear-gradient(90deg, rgba(${accentRgb}, 0.03) 1px, transparent 1px)` : undefined,
          }}
        />
        <div 
          className={styles["home-bg-glow"]}
          style={{
            background: shouldUseAccent ? 
              `radial-gradient(circle, rgba(${accentRgb}, 0.08) 0%, transparent 70%)` : undefined,
          }}
        />
        <div 
          className={styles["home-bg-ambient"]}
          style={{
            background: shouldUseAccent ? 
              `radial-gradient(ellipse at 20% 50%, rgba(${accentRgb}, 0.06) 0%, transparent 50%),
               radial-gradient(ellipse at 80% 50%, rgba(${accentRgb}, 0.04) 0%, transparent 50%),
               radial-gradient(ellipse at 50% 0%, rgba(${accentRgb}, 0.03) 0%, transparent 30%)` : undefined,
            display: shouldUseAccent ? 'block' : 'none',
          }}
        />
      </div>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo} onClick={() => handleNavigate('/')} style={{ cursor: 'pointer' }}>
          BrewTask
        </div>
        
        {/* Desktop Nav Links */}
        {isAuthenticated && (
          <div className={styles.navLinks}>
            <a 
              href="#"
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('/dashboard');
              }}
            >
              Dashboard
            </a>
            <a 
              href="#"
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('/projects');
              }}
            >
              Projects
            </a>
            <a 
              href="#"
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('/calendar');
              }}
            >
              Calendar
            </a>
          </div>
        )}

        <div className={styles.navRight}>
          {/* Search - only show if authenticated */}
          {isAuthenticated && (
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input type="text" placeholder="Search tasks..." className={styles.searchInput} />
            </div>
          )}

          {/* Theme toggle - always visible */}
          <button 
            className={styles.iconBtn} 
            aria-label="Toggle theme"
            onClick={handleThemeToggle}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {/* Notifications - only show if authenticated */}
          {isAuthenticated && (
            <button className={styles.iconBtn} aria-label="Notifications">🔔</button>
          )}

          {/* Avatar / Auth Buttons */}
          {isAuthenticated ? (
            <div className={styles.avatarWrapper} ref={dropdownRef}>
              <div 
                className={styles.avatar}
                onClick={handleAvatarClick}
                style={{ 
                  cursor: 'pointer',
                  background: shouldUseAccent ? accentColor : undefined,
                  color: shouldUseAccent ? '#000000' : undefined,
                }}
              >
                {getInitials(userName)}
              </div>
              {showDropdown && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownHeader}>
                    <div 
                      className={styles.dropdownAvatar}
                      style={{
                        background: shouldUseAccent ? accentColor : undefined,
                        color: shouldUseAccent ? '#000000' : undefined,
                      }}
                    >
                      {getInitials(userName)}
                    </div>
                    <div className={styles.dropdownUserInfo}>
                      <span className={styles.dropdownUserName}>{userName}</span>
                      <span className={styles.dropdownUserEmail}>{userEmail}</span>
                    </div>
                  </div>
                  <div className={styles.dropdownDivider} />
                  
                  <button 
                    className={styles.dropdownItem}
                    onClick={() => handleNavigate('/dashboard')}
                  >
                    <span>📊</span> Dashboard
                  </button>
                  <button 
                    className={styles.dropdownItem}
                    onClick={() => handleNavigate('/my-tasks')}
                  >
                    <span>✅</span> My Tasks
                  </button>
                  <button 
                    className={styles.dropdownItem}
                    onClick={() => handleNavigate('/projects')}
                  >
                    <span>📁</span> Projects
                  </button>
                  <button 
                    className={styles.dropdownItem}
                    onClick={() => handleNavigate('/calendar')}
                  >
                    <span>📅</span> Calendar
                  </button>
                  <button 
                    className={styles.dropdownItem}
                    onClick={() => handleNavigate('/team')}
                  >
                    <span>👥</span> Team
                  </button>
                  
                  <div className={styles.dropdownDivider} />
                  
                  <button 
                    className={styles.dropdownItem}
                    onClick={() => handleNavigate('/profile')}
                  >
                    <span>👤</span> Profile
                  </button>
                  <button 
                    className={styles.dropdownItem}
                    onClick={() => handleNavigate('/settings')}
                  >
                    <span>⚙️</span> Settings
                  </button>
                  
                  <div className={styles.dropdownDivider} />
                  
                  <button 
                    className={`${styles.dropdownItem} ${styles.dropdownItemLogout}`}
                    onClick={handleLogout}
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <button 
                className={styles.loginBtn}
                onClick={() => handleNavigate('/login')}
              >
                Log In
              </button>
              <button 
                className={styles.signupBtn}
                style={{
                  background: shouldUseAccent ? accentColor : undefined,
                  color: shouldUseAccent ? '#000000' : undefined,
                }}
                onClick={() => handleNavigate('/signup')}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`} ref={mobileMenuRef}>
        <div className={styles.mobileMenuHeader}>
          <span className={styles.mobileMenuLogo}>BrewTask</span>
          <button className={styles.mobileMenuClose} onClick={toggleMobileMenu}>✕</button>
        </div>
        <div className={styles.mobileMenuLinks}>
          <a 
            href="#"
            className={styles.mobileNavLink}
            onClick={(e) => {
              e.preventDefault();
              handleNavigate('/');
            }}
          >
            🏠 Home
          </a>
          
          {isAuthenticated ? (
            <>
              <a 
                href="#"
                className={styles.mobileNavLink}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/dashboard');
                }}
              >
                📊 Dashboard
              </a>
              <a 
                href="#"
                className={styles.mobileNavLink}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/my-tasks');
                }}
              >
                ✅ My Tasks
              </a>
              <a 
                href="#"
                className={styles.mobileNavLink}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/projects');
                }}
              >
                📁 Projects
              </a>
              <a 
                href="#"
                className={styles.mobileNavLink}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/calendar');
                }}
              >
                📅 Calendar
              </a>
              <a 
                href="#"
                className={styles.mobileNavLink}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/team');
                }}
              >
                👥 Team
              </a>
              <a 
                href="#"
                className={styles.mobileNavLink}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/profile');
                }}
              >
                👤 Profile
              </a>
              <a 
                href="#"
                className={styles.mobileNavLink}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/settings');
                }}
              >
                ⚙️ Settings
              </a>
              <div className={styles.mobileDivider} />
              <a 
                href="#"
                className={`${styles.mobileNavLink} ${styles.mobileNavLinkLogout}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                🚪 Logout
              </a>
            </>
          ) : (
            <>
              <a 
                href="#"
                className={styles.mobileNavLink}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/login');
                }}
              >
                🔐 Log In
              </a>
              <a 
                href="#"
                className={`${styles.mobileNavLink} ${styles.mobileNavLinkSignup}`}
                style={{
                  background: shouldUseAccent ? accentColor : undefined,
                  color: shouldUseAccent ? '#000000' : undefined,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/signup');
                }}
              >
                ✨ Sign Up
              </a>
            </>
          )}
        </div>
      </div>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.badgeWrap}>
          <span className={styles.ritualRing} aria-hidden="true" />
          <span 
            className={styles.badge}
            style={{
              color: shouldUseAccent ? accentColor : undefined,
              borderColor: shouldUseAccent ? accentColor : undefined,
            }}
          >
            <span 
              className={styles.badgeDot}
              style={{
                background: shouldUseAccent ? accentColor : undefined,
              }}
            />
            {isDarkMode ? 'NOCTURNAL ROAST V2.0' : 'NOW BREWING V2.0'}
          </span>
        </div>
        <h1 className={styles.heroTitle}>
          Brew Your <span 
            className={styles.heroAccent}
            style={{
              color: shouldUseAccent ? accentColor : undefined,
            }}
          >
            Best Work
          </span>
        </h1>
        <p className={styles.heroSubtitle}>
          The premium task management ritual for professionals who value
          focus over noise. Transform your to-do list into a curated experience
          of intentional productivity.
        </p>
        <div className={styles.heroActions}>
          <button 
            className={styles.primaryBtn}
            style={{
              background: shouldUseAccent ? accentColor : undefined,
              color: shouldUseAccent ? '#000000' : undefined,
              boxShadow: shouldUseAccent ? `0 4px 20px rgba(${accentRgb}, 0.15)` : undefined,
            }}
            onMouseEnter={(e) => {
              if (shouldUseAccent) {
                e.currentTarget.style.boxShadow = `0 8px 30px rgba(${accentRgb}, 0.25)`;
              }
            }}
            onMouseLeave={(e) => {
              if (shouldUseAccent) {
                e.currentTarget.style.boxShadow = `0 4px 20px rgba(${accentRgb}, 0.15)`;
              }
            }}
            onClick={handleStartBrewing}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Start Brewing Free'}
          </button>
          <button 
            className={styles.secondaryBtn}
            style={{
              borderColor: shouldUseAccent ? accentColor : undefined,
              color: shouldUseAccent ? accentColor : undefined,
            }}
            onClick={() => navigate('/demo')}
          >
            View Demo
          </button>
        </div>

        <div className={styles.logoStrip}>
          <span>Forbes</span>
          <span>The Verge</span>
          <span>Wired</span>
          <span>Monocle</span>
        </div>
      </section>

      {/* Features intro */}
      <section className={styles.features}>
        <div ref={r1} className={styles.reveal}>
          <h2 className={styles.featuresTitle}>
            Crafted for Clarity
          </h2>
          <p className={styles.featuresSubtitle}>
            Every feature is designed to reduce cognitive load and help you enter a
            state of flow.
          </p>
        </div>

        <div ref={r2} className={`${styles.bentoGrid} ${styles.reveal}`}>
          <div className={styles.bentoCardLight}>
            <div className={styles.bentoIcon}>☕</div>
            <h3 className={styles.bentoTitle}>
              Coffee-Powered Focus
            </h3>
            <p className={styles.bentoText}>
              Integrate your deep work sessions with Pomodoro-style
              timers tuned to the perfect brew cycle. Sync your
              productivity with your physical rituals.
            </p>
            <div className={styles.bentoImage}>
              <img 
                src={snoozeImage} 
                alt="Snooze Button Decisions - Spotting the Decisions You Keep Deferring"
                className={styles.bentoImageContent}
              />
            </div>
          </div>

          <div className={styles.bentoRight}>
            <div className={styles.bentoCardDark}>
              <div className={styles.bentoIcon}>📑</div>
              <h3 className={styles.bentoTitleLight}>
                Ritual Tracking
              </h3>
              <p className={styles.bentoTextLight}>
                Build lasting habits with recurring task
                templates designed for creative workflows.
              </p>
              <svg className={styles.cardRing} viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="4 6" />
              </svg>
            </div>

            <div className={styles.bentoCardGray}>
              <div className={styles.bentoIcon}>🎨</div>
              <h3 className={styles.bentoTitle}>
                Seamless Collaboration
              </h3>
              <p className={styles.bentoText}>
                Shared workspaces that feel like a quiet
                library, not a noisy chat room.
              </p>
              <div className={styles.avatarStack}>
                <div className={styles.stackAvatar} style={{ background: '#FDB56C' }} />
                <div className={styles.stackAvatar} style={{ background: '#4B3832' }} />
                <div className={styles.stackAvatar} style={{ background: '#7E7471' }} />
                <div className={styles.stackAvatarMore}>+4</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Split section */}
      <section ref={r3} className={`${styles.splitSection} ${styles.reveal}`}>
        <div className={styles.splitImage}>
          <img 
            src={splitImage} 
            alt="BrewTask - Elevate Your Coffee Rituals"
            className={styles.splitImageContent}
          />
        </div>
        <div className={styles.splitContent}>
          <span 
            className={styles.eyebrow}
            style={{
              color: shouldUseAccent ? accentColor : undefined,
            }}
          >
            THE AESTHETIC OF WORK
          </span>
          <h2 className={styles.splitTitle}>
            A Workspace That Respects Your Mind
          </h2>
          <p className={styles.splitText}>
            We believe your tools should be as refined as your ambitions. BrewTask
            removes the jarring alerts and cluttered interfaces of the past, replacing
            them with a warm, tactile environment that promotes deep focus and
            intentionality.
          </p>
          <ul className={styles.checklist}>
            <li>
              <CheckIcon /> Custom circular checkmarks for satisfying task completion
            </li>
            <li>
              <CheckIcon /> Glassmorphism overlays for deep architectural hierarchy
            </li>
            <li>
              <CheckIcon /> Ambient dark mode for midnight oil sessions
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section ref={r4} className={`${styles.ctaSection} ${styles.reveal}`}>
        <h2 className={styles.ctaTitle}>
          Ready to start your ritual?
        </h2>
        <p className={styles.ctaSubtitle}>
          Join 50,000+ professionals who have traded chaos for the calm of
          BrewTask.
        </p>
        <div className={styles.ctaForm}>
          <input type="email" placeholder="Enter your email" className={styles.ctaInput} />
          <button 
            className={styles.ctaButton}
            style={{
              background: shouldUseAccent ? accentColor : undefined,
              color: shouldUseAccent ? '#000000' : undefined,
              boxShadow: shouldUseAccent ? `0 4px 20px rgba(${accentRgb}, 0.15)` : undefined,
            }}
            onMouseEnter={(e) => {
              if (shouldUseAccent) {
                e.currentTarget.style.boxShadow = `0 8px 30px rgba(${accentRgb}, 0.25)`;
              }
            }}
            onMouseLeave={(e) => {
              if (shouldUseAccent) {
                e.currentTarget.style.boxShadow = `0 4px 20px rgba(${accentRgb}, 0.15)`;
              }
            }}
            onClick={handleStartBrewing}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
          </button>
        </div>
        <p className={styles.ctaNote}>
          No credit card required. Free 14-day trial.
        </p>
      </section>
    </div>
  );
}