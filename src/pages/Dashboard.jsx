/* ============================================
   FILE: src/pages/Dashboard.jsx
   Boot animation: GSAP-powered, once per session
   ============================================ */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import {
  MdFastfood,
  MdFlight,
  MdHome,
  MdShoppingCart,
  MdMovie,
  MdHealthAndSafety,
  MdBolt,
  MdSubscriptions,
  MdAdd,
} from 'react-icons/md';

import { useFinance } from '../context/FinanceContext';
import useCurrency from '../hooks/useCurrency';
import useCountUp from '../hooks/useCountUp';
import { fetchNews } from '../services/api';

import SpendingDonut from '../components/Charts/SpendingDonut';
import MonthlyTrend from '../components/Charts/MonthlyTrend';
import TransactionCard from '../components/TransactionCard/TransactionCard';

import './Dashboard.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const BOOT_SESSION_KEY = 'finlytics_booted';

const BOOT_LINES = [
  { text: 'FINLYTICS/X KERNEL v4.1.7', delay: 0 },
  { text: 'INITIALIZING SECURE ENCLAVE...', delay: 0.18 },
  { text: 'LOADING FINANCIAL INTELLIGENCE MODULES...', delay: 0.36 },
  { text: 'ESTABLISHING ENCRYPTED CHANNEL...', delay: 0.54 },
  { text: 'THREAT ASSESSMENT ACTIVE', delay: 0.72 },
  { text: 'DECRYPTING ASSET LEDGER...', delay: 0.9 },
  { text: 'ALL SYSTEMS NOMINAL ■', delay: 1.08 },
];

const categoryIconMap = {
  Food: MdFastfood,
  Travel: MdFlight,
  Rent: MdHome,
  Shopping: MdShoppingCart,
  Entertainment: MdMovie,
  Health: MdHealthAndSafety,
  Utilities: MdBolt,
  Subscriptions: MdSubscriptions,
};

// ─── Framer variants (dashboard content) ──────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  }),
};
const microVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.35 + i * 0.06,
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};
const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' },
  }),
};

// ─── Empty state ───────────────────────────────────────────────────────────────

function DashboardEmpty() {
  return (
    <motion.div
      className="dash-empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="dash-empty__glyph">◈</div>
      <h2 className="dash-empty__title">No financial data yet</h2>
      <p className="dash-empty__sub">
        Add your first transaction to start tracking income, expenses, and
        financial insights across your dashboard.
      </p>
      <Link to="/transactions/new" className="dash-empty__cta">
        <MdAdd size={14} /> Add your first transaction
      </Link>
      <div className="dash-empty__features">
        {[
          'Spending charts',
          'Budget tracking',
          'Category breakdown',
          'Monthly trends',
        ].map((f) => (
          <span key={f} className="dash-empty__feature">
            {f}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Boot overlay (GSAP-driven) ────────────────────────────────────────────────

function BootOverlay({ onComplete }) {
  const overlayRef = useRef(null);
  const noiseRef = useRef(null);
  const scanRef = useRef(null);
  const gridRef = useRef(null);
  const logoRef = useRef(null);
  const logoTextRef = useRef(null);
  const linesRef = useRef([]);
  const progressTrackRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressLabelRef = useRef(null);
  const statusRef = useRef(null);
  const tlRef = useRef(null);

  // Register line refs
  const setLineRef = (el, i) => {
    linesRef.current[i] = el;
  };

  useEffect(() => {
    // Kill any existing timeline (Strict Mode double-invoke guard)
    if (tlRef.current) {
      tlRef.current.kill();
    }

    const overlay = overlayRef.current;
    const tl = gsap.timeline({
      onComplete: () => {
        // Mark session then fire callback
        sessionStorage.setItem(BOOT_SESSION_KEY, 'true');
        onComplete();
      },
    });
    tlRef.current = tl;

    // ── 0. Set initial states ────────────────────────────────────────────────
    gsap.set(overlay, { opacity: 1 });
    gsap.set(noiseRef.current, { opacity: 0 });
    gsap.set(scanRef.current, { opacity: 0 });
    gsap.set(gridRef.current, { opacity: 0, scaleY: 0 });
    gsap.set(logoRef.current, { opacity: 0, scaleX: 0 });
    gsap.set(logoTextRef.current, { opacity: 0, y: 8 });
    gsap.set(linesRef.current, { opacity: 0, x: -10 });
    gsap.set(progressTrackRef.current, { opacity: 0, scaleX: 0 });
    gsap.set(progressBarRef.current, {
      scaleX: 0,
      transformOrigin: 'left center',
    });
    gsap.set(progressLabelRef.current, { opacity: 0 });
    gsap.set(statusRef.current, { opacity: 0 });

    // ── 1. Noise burst ───────────────────────────────────────────────────────
    tl.to(noiseRef.current, { opacity: 0.06, duration: 0.08 })
      .to(noiseRef.current, { opacity: 0.02, duration: 0.06 })
      .to(noiseRef.current, { opacity: 0.08, duration: 0.06 })
      .to(noiseRef.current, { opacity: 0.03, duration: 0.1 });

    // ── 2. Grid expands ──────────────────────────────────────────────────────
    tl.to(
      gridRef.current,
      { opacity: 0.06, scaleY: 1, duration: 0.6, ease: 'power2.out' },
      '<0.05',
    );

    // ── 3. Scanlines appear ──────────────────────────────────────────────────
    tl.to(
      scanRef.current,
      { opacity: 1, duration: 0.4, ease: 'power1.inOut' },
      '<0.1',
    );

    // ── 4. Logo line draws in ────────────────────────────────────────────────
    tl.to(
      logoRef.current,
      {
        opacity: 1,
        scaleX: 1,
        duration: 0.5,
        ease: 'power3.out',
        transformOrigin: 'left center',
      },
      '-=0.1',
    );

    // ── 5. Logo text fades up ────────────────────────────────────────────────
    tl.to(
      logoTextRef.current,
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
      '-=0.1',
    );

    // ── 6. Terminal lines stagger in ─────────────────────────────────────────
    tl.to(
      linesRef.current,
      {
        opacity: 1,
        x: 0,
        duration: 0.22,
        stagger: 0.16,
        ease: 'power2.out',
      },
      '+=0.1',
    );

    // ── 7. Progress track appears ────────────────────────────────────────────
    tl.to(
      progressTrackRef.current,
      {
        opacity: 1,
        scaleX: 1,
        duration: 0.4,
        ease: 'power2.out',
        transformOrigin: 'left center',
      },
      '-=0.2',
    );

    tl.to(progressLabelRef.current, { opacity: 1, duration: 0.2 }, '<');

    // ── 8. Progress bar fills ────────────────────────────────────────────────
    tl.to(
      progressBarRef.current,
      {
        scaleX: 1,
        duration: 1.4,
        ease: 'power1.inOut',
      },
      '-=0.1',
    );

    // ── 9. Glitch flash ──────────────────────────────────────────────────────
    tl.to(noiseRef.current, { opacity: 0.18, duration: 0.04 })
      .to(noiseRef.current, { opacity: 0.02, duration: 0.04 })
      .to(noiseRef.current, { opacity: 0.12, duration: 0.03 })
      .to(noiseRef.current, { opacity: 0.02, duration: 0.06 });

    // ── 10. Status line ──────────────────────────────────────────────────────
    tl.to(statusRef.current, { opacity: 1, duration: 0.3 }, '-=0.1');

    // ── 11. Hold ─────────────────────────────────────────────────────────────
    tl.to({}, { duration: 0.6 });

    // ── 12. Exit: scanlines off, grid collapses, overlay fades out ───────────
    tl.to(scanRef.current, { opacity: 0, duration: 0.3 })
      .to(
        gridRef.current,
        { opacity: 0, scaleY: 0.5, duration: 0.5, ease: 'power2.in' },
        '<',
      )
      .to(noiseRef.current, { opacity: 0.15, duration: 0.06 })
      .to(noiseRef.current, { opacity: 0, duration: 0.12 })
      .to(
        overlay,
        { opacity: 0, duration: 0.55, ease: 'power2.inOut' },
        '-=0.1',
      );

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="boot-overlay" ref={overlayRef}>
      {/* Layers */}
      <div className="boot-noise" ref={noiseRef} />
      <div className="boot-scanlines" ref={scanRef} />
      <div className="boot-grid" ref={gridRef} />

      {/* Content */}
      <div className="boot-content">
        {/* Logo bar */}
        <div className="boot-logo-wrap">
          <div className="boot-logo-line" ref={logoRef} />
          <span className="boot-logo-text" ref={logoTextRef}>
            FINLYTICS<span className="boot-logo-slash">/</span>X
          </span>
        </div>

        {/* Terminal lines */}
        <div className="boot-terminal">
          {BOOT_LINES.map((line, i) => (
            <div key={i} className="boot-line" ref={(el) => setLineRef(el, i)}>
              <span className="boot-line-prefix">›</span>
              <span className="boot-line-text">{line.text}</span>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="boot-progress-wrap" ref={progressTrackRef}>
          <div className="boot-progress-track">
            <div className="boot-progress-bar" ref={progressBarRef} />
          </div>
          <span className="boot-progress-label" ref={progressLabelRef}>
            LOADING SYSTEM
          </span>
        </div>

        {/* Status */}
        <div className="boot-status" ref={statusRef}>
          <span className="boot-status-dot" />
          ACCESS GRANTED — SECURE SESSION ACTIVE
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

function Dashboard() {
  const {
    transactions,
    totalIncome,
    totalExpenses,
    netBalance,
    budgetRemaining,
    budgetUsedPercent,
    transactionsByCategory,
  } = useFinance();

  const { formatCurrency } = useCurrency();

  const income = useCountUp(totalIncome);
  const expenses = useCountUp(totalExpenses);
  const balance = useCountUp(netBalance);
  const budget = useCountUp(budgetRemaining);

  const [news, setNews] = useState([]);

  // ── Session-based boot gate ────────────────────────────────────────────────
  // Initialised synchronously from sessionStorage — no useEffect lag,
  // no flicker, no empty-flash before the overlay appears.
  const [showBoot, setShowBoot] = useState(
    () => !sessionStorage.getItem(BOOT_SESSION_KEY),
  );

  useEffect(() => {
    fetchNews().then(setNews);
  }, []);

  // Derived stats
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const avgDaily = totalExpenses / 30;
  const topCategory = Object.entries(transactionsByCategory).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const recurringCount = transactions.filter((t) => t.recurring).length;
  const sortedCategories = Object.entries(transactionsByCategory).sort(
    (a, b) => b[1] - a[1],
  );
  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <>
      {/* Boot overlay — rendered above everything, removed after animation */}
      {showBoot && <BootOverlay onComplete={() => setShowBoot(false)} />}

      {/* Dashboard (always in DOM so GSAP reveal feels instant after boot) */}
      <motion.div
        className="dashboard"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <div className="dashboard-content">
          {transactions.length === 0 ? (
            <DashboardEmpty />
          ) : (
            <>
              {/* TICKER */}
              <div className="ticker">
                <span className="live-dot">● LIVE</span>
                <div className="ticker-track">
                  {news.length > 0 ? (
                    news.map((n, i) => (
                      <span key={i}>
                        <span className="source">{n.source}</span> {n.title}{' '}
                        &nbsp;//&nbsp;
                      </span>
                    ))
                  ) : (
                    <span>
                      FINLYTICS/X FINANCIAL INTELLIGENCE FEED ACTIVE // MARKET
                      DATA STREAMING // ALL SYSTEMS NOMINAL //
                    </span>
                  )}
                </div>
              </div>

              <div className="dashboard-sections">
                {/* SUMMARY CARDS */}
                <div className="summary-cards-grid">
                  {[
                    {
                      label: 'Total Income',
                      value: formatCurrency(income),
                      trend: '+12% vs last month',
                      cls: 'income',
                    },
                    {
                      label: 'Total Expenses',
                      value: formatCurrency(expenses),
                      trend: '-4% vs last month',
                      cls: 'expense',
                    },
                    {
                      label: 'Net Balance',
                      value: formatCurrency(balance),
                      trend: 'Stable',
                      cls: 'balance',
                    },
                    {
                      label: 'Budget Remaining',
                      value: formatCurrency(budget),
                      trend: `${budgetUsedPercent.toFixed(1)}% used`,
                      cls: 'budget',
                      isBudget: true,
                    },
                  ].map((card, i) => (
                    <motion.div
                      key={card.cls}
                      className={`card ${card.cls}`}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <h4>{card.label}</h4>
                      <h2>{card.value}</h2>
                      {card.isBudget && (
                        <div className="progress">
                          <div
                            className="progress-bar"
                            style={{
                              width: `${Math.min(budgetUsedPercent, 100)}%`,
                            }}
                          />
                        </div>
                      )}
                      <p className="trend">{card.trend}</p>
                    </motion.div>
                  ))}
                </div>

                {/* MICRO STATS */}
                <div className="micro-stats-grid">
                  {[
                    {
                      value: `${savingsRate.toFixed(1)}%`,
                      label: 'Savings Rate',
                    },
                    {
                      value: formatCurrency(avgDaily),
                      label: 'Avg Daily Spend',
                    },
                    { value: topCategory?.[0] ?? '—', label: 'Top Category' },
                    { value: transactions.length, label: 'Total Transactions' },
                    { value: recurringCount, label: 'Recurring' },
                  ].map((s, i) => (
                    <motion.div
                      key={s.label}
                      className="micro-card"
                      custom={i}
                      variants={microVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <h2>{s.value}</h2>
                      <p>{s.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* CHARTS */}
                <motion.div
                  className="charts-grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.4 }}
                >
                  <div className="chart-wrapper">
                    <p className="chart-title">Spending Distribution</p>
                    <div className="chart-inner">
                      <SpendingDonut />
                    </div>
                  </div>
                  <div className="chart-wrapper">
                    <p className="chart-title">Monthly Trend</p>
                    <div className="chart-inner">
                      <MonthlyTrend />
                    </div>
                  </div>
                </motion.div>

                {/* BOTTOM GRID */}
                <motion.div
                  className="bottom-grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                >
                  <div className="panel">
                    <div className="panel-header">
                      <h3>Category Breakdown</h3>
                    </div>
                    <div className="category-breakdown-list">
                      {sortedCategories.map(([name, value], i) => {
                        const Icon = categoryIconMap[name] || MdFastfood;
                        const pct =
                          totalExpenses > 0 ? (value / totalExpenses) * 100 : 0;
                        return (
                          <motion.div
                            key={name}
                            className="category-row"
                            custom={i}
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <div className="category-icon-wrap">
                              <Icon style={{ fontSize: 14 }} />
                            </div>
                            <span className="category-name">{name}</span>
                            <span className="category-amount">
                              {formatCurrency(value)}
                            </span>
                            <div className="category-bar-track">
                              <div
                                className="category-bar-fill"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="panel">
                    <div className="panel-header">
                      <h3>Recent Transactions</h3>
                      <Link to="/transactions" className="panel-header-link">
                        View all →
                      </Link>
                    </div>
                    <div className="transactions-list">
                      {recentTx.map((tx, i) => (
                        <motion.div
                          key={tx.id}
                          custom={i}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <TransactionCard tx={tx} />
                        </motion.div>
                      ))}
                    </div>
                    <Link to="/transactions" className="view-all-btn">
                      View all transactions →
                    </Link>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}

export default Dashboard;
