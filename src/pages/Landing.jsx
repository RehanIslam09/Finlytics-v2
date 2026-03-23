// ============================================================
// FILE: src/pages/Landing.jsx
// FinlyticsX — Intelligence-Grade Landing Page
// CIA Terminal × Cyberpunk Finance × Bloomberg OS
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import './Landing.css';

// ── Icon components (inline SVG — no extra deps) ──────────
const Icon = {
  Shield: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" />
    </svg>
  ),
  Chart: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Brain: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  Target: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Lightning: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Layers: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  ArrowR: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Check: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Scan: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  ),
  Globe: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
};

// ── Animated counter hook ──────────────────────────────────
function useCounter(target, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

// ── Glitch text effect ─────────────────────────────────────
function GlitchText({ text, className }) {
  return (
    <span className={`lnd-glitch ${className || ''}`} data-text={text}>
      {text}
    </span>
  );
}

// ── Animated grid background ───────────────────────────────
function GridBackground() {
  return (
    <div className="lnd-grid-bg" aria-hidden>
      <div className="lnd-grid-lines" />
      <div className="lnd-grid-radial" />
      <div className="lnd-scanline" />
    </div>
  );
}

// ── Section reveal wrapper ─────────────────────────────────
function Reveal({ children, delay = 0, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── Stat card with counter ─────────────────────────────────
function StatCard({ value, suffix, label, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCounter(value, 1800, inView);
  return (
    <motion.div
      ref={ref}
      className="lnd-stat-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="lnd-stat-value">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="lnd-stat-label">{label}</div>
    </motion.div>
  );
}

// ── Feature card ───────────────────────────────────────────
function FeatureCard({ icon: IconComp, title, desc, accent, delay }) {
  return (
    <Reveal delay={delay} className="lnd-feature-card-wrap">
      <div className="lnd-feature-card" style={{ '--fa': accent }}>
        <div className="lnd-feature-card__corner-tl" />
        <div className="lnd-feature-card__corner-br" />
        <div className="lnd-feature-card__icon">
          <IconComp />
        </div>
        <h3 className="lnd-feature-card__title">{title}</h3>
        <p className="lnd-feature-card__desc">{desc}</p>
        <div className="lnd-feature-card__glow" />
      </div>
    </Reveal>
  );
}

// ── Step component ─────────────────────────────────────────
function Step({ num, title, desc, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      className="lnd-step"
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="lnd-step__num">{String(num).padStart(2, '0')}</div>
      <div className="lnd-step__body">
        <h3 className="lnd-step__title">{title}</h3>
        <p className="lnd-step__desc">{desc}</p>
      </div>
    </motion.div>
  );
}

// ── Mock dashboard preview ─────────────────────────────────
function DashboardPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const bars = [65, 40, 80, 55, 90, 45, 70, 85, 30, 60, 75, 50];
  return (
    <motion.div
      ref={ref}
      className="lnd-preview"
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Window chrome */}
      <div className="lnd-preview__chrome">
        <div className="lnd-preview__dots">
          <span />
          <span />
          <span />
        </div>
        <div className="lnd-preview__title">FINLYTICS/X — DASHBOARD</div>
        <div className="lnd-preview__status">
          <span className="lnd-preview__live-dot" />
          LIVE
        </div>
      </div>

      {/* Dashboard body */}
      <div className="lnd-preview__body">
        {/* Stat row */}
        <div className="lnd-preview__stats">
          {[
            { label: 'INCOME', val: '₹1,16,127', color: '#00ff88' },
            { label: 'EXPENSES', val: '₹84,231', color: '#ff4444' },
            { label: 'NET', val: '₹31,896', color: '#00f5ff' },
            { label: 'BUDGET', val: '68%', color: '#ffaa00' },
          ].map((s) => (
            <div key={s.label} className="lnd-preview__stat">
              <span className="lnd-preview__stat-label">{s.label}</span>
              <span
                className="lnd-preview__stat-val"
                style={{ color: s.color }}
              >
                {s.val}
              </span>
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="lnd-preview__chart">
          <div className="lnd-preview__chart-label">MONTHLY TREND</div>
          <div className="lnd-preview__bars">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                className="lnd-preview__bar"
                initial={{ height: 0 }}
                animate={inView ? { height: `${h}%` } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.3 + i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ opacity: 0.4 + (h / 100) * 0.6 }}
              />
            ))}
          </div>
        </div>

        {/* Transaction rows */}
        <div className="lnd-preview__txs">
          {[
            {
              name: 'Salary Credit',
              cat: 'INCOME',
              amt: '+₹59,007',
              color: '#00ff88',
            },
            {
              name: 'AWS Freelance',
              cat: 'INCOME',
              amt: '+₹32,400',
              color: '#00ff88',
            },
            {
              name: 'Swiggy Order',
              cat: 'FOOD',
              amt: '-₹847',
              color: '#ff6b35',
            },
            {
              name: 'Adobe Suite',
              cat: 'SUBS',
              amt: '-₹4,230',
              color: '#ff9f0a',
            },
          ].map((tx, i) => (
            <motion.div
              key={i}
              className="lnd-preview__tx"
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.07 }}
            >
              <span className="lnd-preview__tx-name">{tx.name}</span>
              <span
                className="lnd-preview__tx-cat"
                style={{
                  color: tx.color,
                  borderColor: `${tx.color}30`,
                  background: `${tx.color}10`,
                }}
              >
                {tx.cat}
              </span>
              <span className="lnd-preview__tx-amt" style={{ color: tx.color }}>
                {tx.amt}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scan overlay */}
      <div className="lnd-preview__scan-overlay" />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN LANDING PAGE
// ══════════════════════════════════════════════════════════
export default function Landing() {
  const navigate = useNavigate();
  const [ticker, setTicker] = useState(0);
  const tickerItems = [
    'REAL-TIME EXPENSE TRACKING',
    'BUDGET INTELLIGENCE',
    'CURRENCY CONVERSION',
    'INVOICE MANAGEMENT',
    'SAVINGS GOALS',
    'FINANCIAL ANALYTICS',
  ];

  // Rotate ticker
  useEffect(() => {
    const iv = setInterval(
      () => setTicker((t) => (t + 1) % tickerItems.length),
      2800,
    );
    return () => clearInterval(iv);
  }, []);

  const features = [
    {
      icon: Icon.Chart,
      title: 'Real-Time Tracking',
      desc: 'Every transaction logged instantly. Income, expenses, and patterns surfaced in real time.',
      accent: '#ff2a2a',
    },
    {
      icon: Icon.Brain,
      title: 'Budget Intelligence',
      desc: 'Set limits, track velocity, get daily allowances. Know exactly where your money goes.',
      accent: '#00f5ff',
    },
    {
      icon: Icon.Layers,
      title: 'Deep Analytics',
      desc: 'Heatmaps, radar charts, net worth trajectory. Six months of financial intelligence at a glance.',
      accent: '#00ff88',
    },
    {
      icon: Icon.Target,
      title: 'Smart Categorization',
      desc: '8 expense categories, auto-tagged. Filter, sort, and search across your entire ledger.',
      accent: '#ffaa00',
    },
    {
      icon: Icon.Lightning,
      title: 'Invoice Pipeline',
      desc: 'Freelancer-grade invoice tracking. Draft to paid in one kanban board. CSV export for tax.',
      accent: '#bf5af2',
    },
    {
      icon: Icon.Shield,
      title: 'Savings Goals',
      desc: 'Set targets, track progress, celebrate milestones. Confetti when you hit 100%.',
      accent: '#ff6b35',
    },
  ];

  return (
    <div className="lnd-page">
      <GridBackground />

      {/* ── NAVBAR ── */}
      <nav className="lnd-nav">
        <div className="lnd-nav__logo">
          <span className="lnd-nav__logo-dot">●</span>
          FINLYTICS<span className="lnd-nav__logo-x">X</span>
        </div>
        <div className="lnd-nav__links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#who">For you</a>
        </div>
        <div className="lnd-nav__actions">
          <SignInButton mode="modal">
            <button className="lnd-btn-ghost">Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="lnd-btn-primary">Get Started</button>
          </SignUpButton>
        </div>
      </nav>

      {/* ── TICKER ── */}
      <div className="lnd-ticker">
        <span className="lnd-ticker__label">SYSTEM ACTIVE</span>
        <div className="lnd-ticker__sep" />
        <AnimatePresence mode="wait">
          <motion.span
            key={ticker}
            className="lnd-ticker__text"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {tickerItems[ticker]}
          </motion.span>
        </AnimatePresence>
        <div className="lnd-ticker__pulse" />
      </div>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="lnd-hero">
        {/* Eyebrow */}
        <motion.div
          className="lnd-hero__eyebrow"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="lnd-hero__eyebrow-dot" />
          INTELLIGENCE-GRADE FINANCIAL OS
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="lnd-hero__headline"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Your Finances.
          <br />
          <span className="lnd-hero__headline-accent">
            <GlitchText text="Decoded." />
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          className="lnd-hero__sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          Intelligence-grade finance tracking for students and freelancers.
          <br />
          Every rupee tracked. Every pattern surfaced. Every decision sharper.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="lnd-hero__ctas"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <SignUpButton mode="modal">
            <button className="lnd-cta-primary">
              <span>Get Started Free</span>
              <span className="lnd-cta-primary__icon">
                <Icon.ArrowR />
              </span>
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="lnd-cta-ghost">Sign In to Dashboard</button>
          </SignInButton>
        </motion.div>

        {/* Trust line */}
        <motion.div
          className="lnd-hero__trust"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {['No credit card', 'Data stays local', 'Free forever'].map((t) => (
            <span key={t} className="lnd-hero__trust-item">
              <span className="lnd-hero__trust-check">
                <Icon.Check />
              </span>
              {t}
            </span>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="lnd-hero__stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <StatCard
            value={7}
            suffix=" pages"
            label="Full app pages"
            delay={0}
          />
          <div className="lnd-hero__stats-sep" />
          <StatCard
            value={6}
            suffix=" charts"
            label="Analytics views"
            delay={0.1}
          />
          <div className="lnd-hero__stats-sep" />
          <StatCard
            value={100}
            suffix="%"
            label="Client-side privacy"
            delay={0.2}
          />
          <div className="lnd-hero__stats-sep" />
          <StatCard value={6} suffix="x" label="Currency support" delay={0.3} />
        </motion.div>
      </section>

      {/* ── HERO PREVIEW ── */}
      <section className="lnd-preview-section">
        <DashboardPreview />
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════ */}
      <section className="lnd-section" id="features">
        <Reveal>
          <div className="lnd-section__header">
            <div className="lnd-section__eyebrow">CAPABILITIES</div>
            <h2 className="lnd-section__title">
              Built for people who take
              <br />
              <span className="lnd-accent">money seriously.</span>
            </h2>
            <p className="lnd-section__sub">
              Not a budgeting app. Not a spreadsheet replacement.
              <br />A complete financial intelligence platform.
            </p>
          </div>
        </Reveal>
        <div className="lnd-features-grid">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section className="lnd-section lnd-section--dark" id="how">
        <Reveal>
          <div className="lnd-section__header">
            <div className="lnd-section__eyebrow">PROTOCOL</div>
            <h2 className="lnd-section__title">
              Three steps to
              <br />
              <span className="lnd-accent">financial clarity.</span>
            </h2>
          </div>
        </Reveal>

        <div className="lnd-steps">
          <Step
            num={1}
            delay={0.1}
            title="Log every transaction"
            desc="Add income and expenses in seconds. Custom categories, recurring flags, notes. Your complete financial record."
          />
          <div className="lnd-steps__connector" />
          <Step
            num={2}
            delay={0.2}
            title="Analyse your patterns"
            desc="Charts, heatmaps, category radar, net worth trajectory. Six months of history decoded into actionable intelligence."
          />
          <div className="lnd-steps__connector" />
          <Step
            num={3}
            delay={0.3}
            title="Optimise your spending"
            desc="Set budgets, track velocity, save toward goals, invoice clients. Take full command of your financial system."
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHO IT'S FOR
      ══════════════════════════════════════════════════ */}
      <section className="lnd-section" id="who">
        <Reveal>
          <div className="lnd-section__header">
            <div className="lnd-section__eyebrow">WHO IT'S FOR</div>
            <h2 className="lnd-section__title">
              Designed for two groups
              <br />
              <span className="lnd-accent">everyone ignores.</span>
            </h2>
          </div>
        </Reveal>

        <div className="lnd-who-grid">
          <Reveal delay={0.1} className="lnd-who-card-wrap">
            <div className="lnd-who-card lnd-who-card--students">
              <div className="lnd-who-card__tag">STUDENTS</div>
              <h3 className="lnd-who-card__title">
                Tight budgets.
                <br />
                High ambition.
              </h3>
              <p className="lnd-who-card__desc">
                Track your stipend, manage hostel expenses, stay within budget
                every month. Know exactly what you can afford before you spend
                it.
              </p>
              <ul className="lnd-who-card__list">
                {[
                  'Monthly budget tracking',
                  'Category spending limits',
                  'Savings goals (laptop, travel, emergency)',
                  'Visual spending breakdown',
                ].map((item) => (
                  <li key={item}>
                    <span className="lnd-who-card__check">
                      <Icon.Check />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="lnd-who-card__glow" />
            </div>
          </Reveal>

          <Reveal delay={0.2} className="lnd-who-card-wrap">
            <div className="lnd-who-card lnd-who-card--freelancers">
              <div className="lnd-who-card__tag">FREELANCERS</div>
              <h3 className="lnd-who-card__title">
                Irregular income.
                <br />
                Maximum control.
              </h3>
              <p className="lnd-who-card__desc">
                Track client invoices, manage variable income, understand your
                real earnings. Never lose a payment or miss a due date again.
              </p>
              <ul className="lnd-who-card__list">
                {[
                  'Invoice pipeline (Draft → Sent → Paid)',
                  'Auto overdue detection',
                  'Income vs expense analytics',
                  'CSV export for tax records',
                ].map((item) => (
                  <li key={item}>
                    <span className="lnd-who-card__check">
                      <Icon.Check />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="lnd-who-card__glow" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════ */}
      <section className="lnd-final-cta">
        <div className="lnd-final-cta__grid-overlay" aria-hidden />
        <Reveal>
          <div className="lnd-final-cta__eyebrow">
            <span className="lnd-final-cta__eyebrow-dot" />
            BEGIN ASSESSMENT
          </div>
          <h2 className="lnd-final-cta__title">
            Take control of your
            <br />
            <span className="lnd-accent">financial intelligence.</span>
          </h2>
          <p className="lnd-final-cta__sub">
            Free. Private. Your data never leaves your device.
          </p>
          <SignUpButton mode="modal">
            <button className="lnd-cta-primary lnd-cta-primary--lg">
              <span>Get Started Free</span>
              <span className="lnd-cta-primary__icon">
                <Icon.ArrowR />
              </span>
            </button>
          </SignUpButton>
          <div className="lnd-final-cta__version">
            FINLYTICS/X v2.0 — INTELLIGENCE EDITION
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lnd-footer">
        <div className="lnd-footer__logo">
          <span className="lnd-nav__logo-dot">●</span>
          FINLYTICS<span className="lnd-nav__logo-x">X</span>
        </div>
        <div className="lnd-footer__links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#who">For you</a>
        </div>
        <div className="lnd-footer__copy">
          © 2026 FinlyticsX. All systems operational.
        </div>
      </footer>
    </div>
  );
}
