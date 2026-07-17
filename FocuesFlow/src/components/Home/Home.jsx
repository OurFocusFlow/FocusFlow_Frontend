import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
// Import images
import snoozeImage from '../../assets/Images/The-Snooze-Button-Testt-Spotting-the-Decisions-You-Keep-Deferring.jpg';
import splitImage from '../../assets/Images/Image3.png';

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
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const r4 = useReveal();
  
  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check authentication status from localStorage
    const token = localStorage.getItem('authToken');
    const name = localStorage.getItem('userName') || 'John Doe';
    setIsAuthenticated(token !== null);
    setUserName(name);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setShowDropdown(false);
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

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo} onClick={() => handleNavigate('/')} style={{ cursor: 'pointer' }}>
          BrewTask
        </div>
        
        {/* Show nav links only if authenticated */}
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
          <button className={styles.iconBtn} aria-label="Toggle theme">🌙</button>

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
                style={{ cursor: 'pointer' }}
              />
              {showDropdown && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownHeader}>
                    <div className={styles.dropdownAvatar}>JD</div>
                    <div className={styles.dropdownUserInfo}>
                      <span className={styles.dropdownUserName}>{userName}</span>
                      <span className={styles.dropdownUserEmail}>john@company.com</span>
                    </div>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <button 
                    className={styles.dropdownItem}
                    onClick={() => {
                      setShowDropdown(false);
                      handleNavigate('/profile');
                    }}
                  >
                    <span>👤</span> Profile
                  </button>
                  <button 
                    className={styles.dropdownItem}
                    onClick={() => {
                      setShowDropdown(false);
                      handleNavigate('/settings');
                    }}
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
                onClick={() => handleNavigate('/signup')}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.badgeWrap}>
          <span className={styles.ritualRing} aria-hidden="true" />
          <span className={styles.badge}>
            <span className={styles.badgeDot} />
            NOW BREWING V2.0
          </span>
        </div>
        <h1 className={styles.heroTitle}>
          Brew Your <span className={styles.heroAccent}>Best Work</span>
        </h1>
        <p className={styles.heroSubtitle}>
          The premium task management ritual for professionals who value
          focus over noise. Transform your to-do list into a curated experience
          of intentional productivity.
        </p>
        <div className={styles.heroActions}>
          <button 
            className={styles.primaryBtn} 
            onClick={handleStartBrewing}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Start Brewing Free'}
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
          <h2 className={styles.featuresTitle}>Crafted for Clarity</h2>
          <p className={styles.featuresSubtitle}>
            Every feature is designed to reduce cognitive load and help you enter a
            state of flow.
          </p>
        </div>

        <div ref={r2} className={`${styles.bentoGrid} ${styles.reveal}`}>
          <div className={styles.bentoCardLight}>
            <div className={styles.bentoIcon}>☕</div>
            <h3 className={styles.bentoTitle}>Coffee-Powered Focus</h3>
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
              <h3 className={styles.bentoTitleLight}>Ritual Tracking</h3>
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
              <h3 className={styles.bentoTitle}>Seamless Collaboration</h3>
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
          <span className={styles.eyebrow}>THE AESTHETIC OF WORK</span>
          <h2 className={styles.splitTitle}>A Workspace That Respects Your Mind</h2>
          <p className={styles.splitText}>
            We believe your tools should be as refined as your ambitions. BrewTask
            removes the jarring alerts and cluttered interfaces of the past, replacing
            them with a warm, tactile environment that promotes deep focus and
            intentionality.
          </p>
          <ul className={styles.checklist}>
            <li><CheckIcon /> Custom circular checkmarks for satisfying task completion</li>
            <li><CheckIcon /> Glassmorphism overlays for deep architectural hierarchy</li>
            <li><CheckIcon /> Ambient dark mode for midnight oil sessions</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section ref={r4} className={`${styles.ctaSection} ${styles.reveal}`}>
        <h2 className={styles.ctaTitle}>Ready to start your ritual?</h2>
        <p className={styles.ctaSubtitle}>
          Join 50,000+ professionals who have traded chaos for the calm of
          BrewTask.
        </p>
        <div className={styles.ctaForm}>
          <input type="email" placeholder="Enter your email" className={styles.ctaInput} />
          <button 
            className={styles.ctaButton}
            onClick={handleStartBrewing}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
          </button>
        </div>
        <p className={styles.ctaNote}>No credit card required. Free 14-day trial.</p>
      </section>
    </div>
  );
}