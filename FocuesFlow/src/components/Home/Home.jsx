import { useEffect, useRef } from 'react';
import styles from './Home.module.css';

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
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const r4 = useReveal();

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>BrewTask</div>
        <div className={styles.navLinks}>
          <a href="#" className={styles.navLinkActive}>Dashboard</a>
          <a href="#" className={styles.navLink}>Projects</a>
          <a href="#" className={styles.navLink}>Calendar</a>
        </div>
        <div className={styles.navRight}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input type="text" placeholder="Search tasks..." className={styles.searchInput} />
          </div>
          <button className={styles.iconBtn} aria-label="Toggle theme">🌙</button>
          <button className={styles.iconBtn} aria-label="Notifications">🔔</button>
          <div className={styles.avatar} />
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
          <button className={styles.primaryBtn}>Start Brewing Free</button>
          <button className={styles.secondaryBtn}>View Demo</button>
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
            <div className={styles.bentoImage} />
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
        <div className={styles.splitImage} />
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
          <button className={styles.ctaButton}>Get Started</button>
        </div>
        <p className={styles.ctaNote}>No credit card required. Free 14-day trial.</p>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div>
          <div className={styles.footerLogo}>BrewTask</div>
          <p className={styles.footerCopy}>© 2024 BrewTask. Crafted for focused minds.</p>
        </div>
        <div className={styles.footerLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Changelog</a>
          <a href="#" className={styles.footerLinkActive}>Status</a>
        </div>
        <div className={styles.footerIcons}>
          <span>@</span>
          <span>🌐</span>
        </div>
      </footer>
    </div>
  );
}