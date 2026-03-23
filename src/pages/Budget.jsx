// ============================================================
// FILE: src/pages/Budget.jsx
// FinlyticsX — Budget Intelligence Page
// FIXED: useCurrency destructured correctly
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdEdit,
  MdCheck,
  MdClose,
  MdWarning,
  MdTrendingUp,
  MdTrendingDown,
  MdRestaurant,
  MdDirectionsCar,
  MdHome,
  MdShoppingBag,
  MdMovie,
  MdFitnessCenter,
  MdElectricalServices,
  MdSubscriptions,
  MdLock,
  MdRadar,
  MdSpeed,
  MdCalendarToday,
  MdAdd,
} from 'react-icons/md';
import { useFinance } from '../context/FinanceContext';
import useCurrency from '../hooks/useCurrency';
import useCountUp from '../hooks/useCountUp';
import './Budget.css';

const CATEGORY_CONFIG = {
  Food: { icon: MdRestaurant, color: '#ff6b35' },
  Travel: { icon: MdDirectionsCar, color: '#00d4ff' },
  Rent: { icon: MdHome, color: '#8877ff' },
  Shopping: { icon: MdShoppingBag, color: '#ff2a6d' },
  Entertainment: { icon: MdMovie, color: '#bf5af2' },
  Health: { icon: MdFitnessCenter, color: '#30d158' },
  Utilities: { icon: MdElectricalServices, color: '#ffd60a' },
  Subscriptions: { icon: MdSubscriptions, color: '#ff9f0a' },
};

const AMBER = '#ffaa00';
const AMBER_BRIGHT = '#ffd060';
const AMBER_DIM = '#cc8800';
const GOLD_GLOW = 'rgba(255,170,0,0.28)';

function getDaysRemaining() {
  const now = new Date();
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return last.getDate() - now.getDate();
}
function getDaysInMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}
function getDaysElapsed() {
  return new Date().getDate();
}

function extractBudgetAmount(budget) {
  if (!budget) return 0;
  if (typeof budget === 'number') return budget;
  if (typeof budget === 'object' && 'monthlyBudget' in budget)
    return budget.monthlyBudget || 0;
  return 0;
}

// ── Circular Dial ──────────────────────────────────────────
function CircularDial({ percent, size = 220, stroke = 14 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const clampedPct = Math.min(percent, 100);
  const offset = circ - (clampedPct / 100) * circ;
  const isOver = percent > 100;
  const isCritical = percent >= 85;
  const dialColor = isOver ? '#ff4444' : isCritical ? '#ffaa00' : AMBER;

  return (
    <div className="bdg-dial" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="bdg-dial__svg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,170,0,0.1)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={dialColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{
            filter: `drop-shadow(0 0 8px ${dialColor}) drop-shadow(0 0 20px ${dialColor}55)`,
          }}
        />
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = (tick / 100) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const cx = size / 2 + (r + stroke / 2 + 6) * Math.cos(rad);
          const cy = size / 2 + (r + stroke / 2 + 6) * Math.sin(rad);
          return (
            <circle
              key={tick}
              cx={cx}
              cy={cy}
              r={1.5}
              fill={tick <= clampedPct ? dialColor : 'rgba(255,170,0,0.2)'}
            />
          );
        })}
      </svg>
      <div className="bdg-dial__center">
        <motion.span
          className="bdg-dial__pct"
          style={{ color: dialColor }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {Math.round(clampedPct)}%
        </motion.span>
        <span className="bdg-dial__label">USED</span>
        {isOver && (
          <motion.span
            className="bdg-dial__over"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            OVER BUDGET
          </motion.span>
        )}
      </div>
    </div>
  );
}

// ── Velocity Bar ───────────────────────────────────────────
function VelocityBar({ spent, budget, daysElapsed, daysInMonth }) {
  const expectedSpend = budget > 0 ? budget * (daysElapsed / daysInMonth) : 0;
  const actualPct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const expectedPct =
    budget > 0 ? Math.min((expectedSpend / budget) * 100, 100) : 0;
  const isAhead = spent > expectedSpend;
  const velocityColor = isAhead ? '#ff4444' : '#30d158';

  return (
    <div className="bdg-velocity">
      <div className="bdg-velocity__header">
        <span className="bdg-velocity__title">
          <MdSpeed size={12} style={{ marginRight: 5 }} />
          SPENDING VELOCITY
        </span>
        <span className="bdg-velocity__status" style={{ color: velocityColor }}>
          {isAhead ? '▲ Ahead of pace' : '▼ Under control'}
        </span>
      </div>
      <div className="bdg-velocity__track">
        <div
          className="bdg-velocity__expected-marker"
          style={{ left: `${expectedPct}%` }}
          title={`Expected: ₹${Math.round(expectedSpend).toLocaleString('en-IN')}`}
        />
        <motion.div
          className="bdg-velocity__fill"
          style={{
            background: `linear-gradient(90deg, ${AMBER_DIM}, ${AMBER}, ${AMBER_BRIGHT})`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${actualPct}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        />
        <motion.div
          className="bdg-velocity__glow-edge"
          initial={{ left: 0 }}
          animate={{ left: `${actualPct}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        />
      </div>
      <div className="bdg-velocity__labels">
        <span>₹0</span>
        <span style={{ color: AMBER }}>
          ₹{Math.round(spent).toLocaleString('en-IN')} spent
        </span>
        <span>₹{Math.round(budget).toLocaleString('en-IN')}</span>
      </div>
      <p className="bdg-velocity__note">
        Expected spend by today: ₹
        {Math.round(expectedSpend).toLocaleString('en-IN')} based on{' '}
        {daysElapsed}/{daysInMonth} days elapsed
      </p>
    </div>
  );
}

// ── Budget Edit Modal ──────────────────────────────────────
function BudgetEditModal({ current, onSave, onClose }) {
  const [value, setValue] = useState(current > 0 ? String(current) : '');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSave = () => {
    const num = Number(value);
    if (!value || isNaN(num) || num <= 0) {
      setError('Enter a valid positive amount');
      return;
    }
    if (num > 10000000) {
      setError('Amount too large');
      return;
    }
    onSave(num);
    onClose();
  };

  return (
    <motion.div
      className="bdg-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bdg-modal"
        initial={{ scale: 0.88, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 12, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bdg-modal__header">
          <span className="bdg-modal__title">
            {current > 0 ? 'Adjust Monthly Budget' : 'Set Monthly Budget'}
          </span>
          <button className="bdg-modal__close" onClick={onClose}>
            <MdClose size={16} />
          </button>
        </div>
        <p className="bdg-modal__desc">
          Your total spending limit for the month.
        </p>
        {current > 0 && (
          <p className="bdg-modal__current">
            Current: <strong>₹{current.toLocaleString('en-IN')}</strong>
          </p>
        )}
        <div className="bdg-modal__input-wrap">
          <span className="bdg-modal__currency">₹</span>
          <input
            ref={inputRef}
            type="number"
            className="bdg-modal__input"
            value={value}
            placeholder={current > 0 ? String(current) : '50000'}
            onChange={(e) => {
              setValue(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>
        {error && <p className="bdg-modal__error">{error}</p>}
        <div className="bdg-modal__presets">
          {[10000, 25000, 50000, 100000].map((p) => (
            <button
              key={p}
              className="bdg-modal__preset"
              onClick={() => {
                setValue(String(p));
                setError('');
              }}
            >
              ₹{p.toLocaleString('en-IN')}
            </button>
          ))}
        </div>
        <div className="bdg-modal__actions">
          <button className="bdg-modal__cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="bdg-modal__save" onClick={handleSave}>
            <MdCheck size={14} /> {current > 0 ? 'Update Budget' : 'Set Budget'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Category Budget Row ────────────────────────────────────
function CategoryBudgetRow({ name, spent, limit, onEdit, index }) {
  const cfg = CATEGORY_CONFIG[name] || { icon: MdRestaurant, color: AMBER };
  const Icon = cfg.icon;
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const isOver = spent > limit && limit > 0;
  const isCritical = pct >= 85 && !isOver;
  const hasLimit = limit > 0;
  const barColor = isOver ? '#ff4444' : isCritical ? '#ffaa00' : cfg.color;

  return (
    <motion.div
      className={`bdg-cat-row ${isOver ? 'over' : ''}`}
      style={{ '--row-color': cfg.color, '--row-glow': `${cfg.color}30` }}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.045,
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      layout
    >
      <div
        className="bdg-cat-row__icon"
        style={{
          background: `${cfg.color}15`,
          color: cfg.color,
          boxShadow: isOver ? `0 0 12px ${cfg.color}40` : 'none',
        }}
      >
        <Icon size={15} />
      </div>
      <div className="bdg-cat-row__body">
        <div className="bdg-cat-row__top">
          <span className="bdg-cat-row__name">{name}</span>
          <div className="bdg-cat-row__amounts">
            {isOver && <MdWarning size={11} style={{ color: '#ff4444' }} />}
            <span
              className="bdg-cat-row__spent"
              style={{ color: isOver ? '#ff4444' : cfg.color }}
            >
              ₹{Math.round(spent).toLocaleString('en-IN')}
            </span>
            {hasLimit && (
              <span className="bdg-cat-row__limit">
                / ₹{Math.round(limit).toLocaleString('en-IN')}
              </span>
            )}
            {!hasLimit && (
              <span className="bdg-cat-row__no-limit">No limit set</span>
            )}
          </div>
        </div>
        <div className="bdg-cat-row__track">
          <motion.div
            className="bdg-cat-row__fill"
            style={{ background: barColor, boxShadow: `0 0 8px ${barColor}60` }}
            initial={{ width: 0 }}
            animate={{ width: hasLimit ? `${pct}%` : '0%' }}
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2 + index * 0.04,
            }}
          />
          {hasLimit && (
            <div
              className="bdg-cat-row__expected"
              style={{
                left: `${(getDaysElapsed() / getDaysInMonth()) * 100}%`,
              }}
            />
          )}
        </div>
        {hasLimit && (
          <div className="bdg-cat-row__pct-label">
            <span style={{ color: isOver ? '#ff4444' : 'var(--bdg-muted)' }}>
              {Math.round(pct)}% {isOver ? 'OVER LIMIT' : 'of limit'}
            </span>
            <span style={{ color: 'var(--bdg-muted)' }}>
              ₹{Math.max(0, Math.round(limit - spent)).toLocaleString('en-IN')}{' '}
              remaining
            </span>
          </div>
        )}
      </div>
      <button
        className="bdg-cat-row__edit"
        onClick={() => onEdit(name, limit)}
        title="Set limit"
      >
        <MdEdit size={13} />
      </button>
    </motion.div>
  );
}

// ── Category Limit Modal ───────────────────────────────────
function CategoryLimitModal({ name, current, onSave, onClose }) {
  const cfg = CATEGORY_CONFIG[name] || { icon: MdRestaurant, color: AMBER };
  const Icon = cfg.icon;
  const [value, setValue] = useState(current > 0 ? String(current) : '');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSave = () => {
    if (value === '' || value === '0') {
      onSave(0);
      onClose();
      return;
    }
    const num = Number(value);
    if (isNaN(num) || num < 0) {
      setError('Enter a valid amount');
      return;
    }
    onSave(num);
    onClose();
  };

  return (
    <motion.div
      className="bdg-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bdg-modal"
        initial={{ scale: 0.88, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 12, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bdg-modal__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: `${cfg.color}18`,
                color: cfg.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={14} />
            </div>
            <span className="bdg-modal__title">{name} Limit</span>
          </div>
          <button className="bdg-modal__close" onClick={onClose}>
            <MdClose size={16} />
          </button>
        </div>
        <p className="bdg-modal__desc">
          Set a monthly spending limit for <strong>{name}</strong>. Leave empty
          or enter 0 to remove.
        </p>
        <div
          className="bdg-modal__input-wrap"
          style={{ '--modal-accent': cfg.color }}
        >
          <span className="bdg-modal__currency" style={{ color: cfg.color }}>
            ₹
          </span>
          <input
            ref={inputRef}
            type="number"
            className="bdg-modal__input"
            value={value}
            placeholder="e.g. 8000"
            onChange={(e) => {
              setValue(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>
        {error && <p className="bdg-modal__error">{error}</p>}
        <div className="bdg-modal__actions">
          {current > 0 && (
            <button
              className="bdg-modal__remove"
              onClick={() => {
                onSave(0);
                onClose();
              }}
            >
              Remove limit
            </button>
          )}
          <button className="bdg-modal__cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bdg-modal__save"
            style={{ background: cfg.color, borderColor: cfg.color }}
            onClick={handleSave}
          >
            <MdCheck size={14} /> Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Insight Card ───────────────────────────────────────────
function InsightCard({ icon: Icon, title, value, sub, accent, index }) {
  return (
    <motion.div
      className="bdg-insight"
      style={{ '--ins-accent': accent }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.1 + index * 0.07,
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="bdg-insight__icon">
        <Icon size={14} />
      </div>
      <div className="bdg-insight__body">
        <span className="bdg-insight__title">{title}</span>
        <span className="bdg-insight__value" style={{ color: accent }}>
          {value}
        </span>
        <span className="bdg-insight__sub">{sub}</span>
      </div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────
export default function Budget() {
  const {
    transactions,
    budget,
    setBudget,
    totalExpenses,
    budgetUsedPercent,
    transactionsByCategory,
  } = useFinance();

  // ── THE FIX: destructure formatCurrency properly ──
  const { formatCurrency } = useCurrency();

  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [categoryLimits, setCategoryLimits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bdg_cat_limits') || '{}');
    } catch {
      return {};
    }
  });

  const daysRemaining = getDaysRemaining();
  const daysInMonth = getDaysInMonth();
  const daysElapsed = getDaysElapsed();
  const monthlyBudget = extractBudgetAmount(budget);

  useEffect(() => {
    localStorage.setItem('bdg_cat_limits', JSON.stringify(categoryLimits));
  }, [categoryLimits]);

  const remaining = Math.max(0, monthlyBudget - totalExpenses);
  const pct = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0;
  const isOver = totalExpenses > monthlyBudget && monthlyBudget > 0;
  const isCritical = pct >= 85 && !isOver;

  const dailyBudget = daysRemaining > 0 ? remaining / daysRemaining : 0;
  const projectedSpend =
    daysElapsed > 0 ? (totalExpenses / daysElapsed) * daysInMonth : 0;

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const overLimitCats = Object.entries(categoryLimits).filter(
    ([name, limit]) => limit > 0 && (transactionsByCategory[name] || 0) > limit,
  );

  const handleSaveBudget = (amount) => {
    if (typeof setBudget === 'function') {
      try {
        setBudget({ monthlyBudget: amount });
      } catch {
        setBudget(amount);
      }
    }
  };

  const handleSaveCategoryLimit = (name, amount) => {
    setCategoryLimits((prev) => ({ ...prev, [name]: amount }));
  };

  const animBudget = useCountUp(monthlyBudget);
  const animSpent = useCountUp(Math.round(totalExpenses));
  const animRemaining = useCountUp(Math.round(remaining));
  const animDaily = useCountUp(Math.round(dailyBudget));

  const statusColor = isOver ? '#ff4444' : isCritical ? AMBER : '#30d158';
  const statusLabel = isOver
    ? 'OVER BUDGET'
    : isCritical
      ? 'CRITICAL'
      : 'ON TRACK';

  return (
    <div className="bdg-page">
      <div className="bdg-scanlines" aria-hidden />

      <AnimatePresence>
        {showBudgetModal && (
          <BudgetEditModal
            current={monthlyBudget}
            onSave={handleSaveBudget}
            onClose={() => setShowBudgetModal(false)}
          />
        )}
        {editCategory && (
          <CategoryLimitModal
            name={editCategory.name}
            current={editCategory.current}
            onSave={(amt) => handleSaveCategoryLimit(editCategory.name, amt)}
            onClose={() => setEditCategory(null)}
          />
        )}
      </AnimatePresence>

      <div className="bdg-content">
        {/* Header */}
        <motion.div
          className="bdg-header"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
        >
          <div className="bdg-header__left">
            <div className="bdg-header__eyebrow">
              <span className="bdg-eyebrow-dot" /> FINANCIAL COMMAND
            </div>
            <h1 className="bdg-header__title">Budget Control</h1>
            <p className="bdg-header__sub">
              {daysRemaining} days remaining ·{' '}
              {new Date().toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <motion.button
            className="bdg-btn-set"
            onClick={() => setShowBudgetModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {monthlyBudget > 0 ? <MdEdit size={14} /> : <MdAdd size={14} />}
            {monthlyBudget > 0 ? 'Adjust Budget' : 'Set Budget'}
          </motion.button>
        </motion.div>

        <div className="bdg-glow-rule" />

        {/* Hero */}
        <div className="bdg-hero">
          <div
            className="bdg-hero__orb"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${GOLD_GLOW} 0%, transparent 70%)`,
            }}
          />
          <div className="bdg-hero__top">
            <motion.div
              className="bdg-hero__dial-wrap"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.15,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <CircularDial percent={pct} size={220} stroke={14} />
              <motion.div
                className="bdg-status-badge"
                style={{
                  '--badge-color': statusColor,
                  '--badge-bg': `${statusColor}18`,
                }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                <span
                  className="bdg-status-dot"
                  style={{
                    background: statusColor,
                    boxShadow: `0 0 6px ${statusColor}`,
                    animation: isOver
                      ? 'bdgPulse 1s infinite'
                      : 'bdgPulse 2.5s infinite',
                  }}
                />
                {statusLabel}
              </motion.div>
            </motion.div>
            <div className="bdg-hero__stats">
              {[
                {
                  label: 'Monthly Budget',
                  value: formatCurrency(animBudget),
                  accent: AMBER,
                  icon: MdLock,
                  sub: 'Total allocation',
                },
                {
                  label: 'Spent',
                  value: formatCurrency(animSpent),
                  accent: isOver ? '#ff4444' : '#ff9f0a',
                  icon: MdTrendingUp,
                  sub: `${Math.round(pct)}% of budget`,
                },
                {
                  label: 'Remaining',
                  value: formatCurrency(animRemaining),
                  accent: isOver ? '#ff4444' : '#30d158',
                  icon: MdTrendingDown,
                  sub: `${daysRemaining} days left`,
                },
                {
                  label: 'Daily Allowance',
                  value: formatCurrency(animDaily),
                  accent: AMBER_BRIGHT,
                  icon: MdCalendarToday,
                  sub: 'Remaining ÷ days',
                },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  className="bdg-stat-card"
                  style={{ '--s-accent': s.accent }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.15 + i * 0.08,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div className="bdg-stat-card__icon">
                    <s.icon size={13} />
                  </div>
                  <div className="bdg-stat-card__body">
                    <span className="bdg-stat-card__label">{s.label}</span>
                    <span
                      className="bdg-stat-card__value"
                      style={{ color: s.accent }}
                    >
                      {s.value}
                    </span>
                    <span className="bdg-stat-card__sub">{s.sub}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <VelocityBar
              spent={totalExpenses}
              budget={monthlyBudget}
              daysElapsed={daysElapsed}
              daysInMonth={daysInMonth}
            />
          </motion.div>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {overLimitCats.length > 0 && (
            <motion.div
              className="bdg-alerts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="bdg-alerts__header">
                <MdWarning size={14} style={{ color: '#ff4444' }} />
                <span>
                  {overLimitCats.length} categor
                  {overLimitCats.length > 1 ? 'ies' : 'y'} over limit
                </span>
              </div>
              <div className="bdg-alerts__list">
                {overLimitCats.map(([name, limit]) => {
                  const spent = transactionsByCategory[name] || 0;
                  const excess = spent - limit;
                  const cfg = CATEGORY_CONFIG[name];
                  return (
                    <span
                      key={name}
                      className="bdg-alert-chip"
                      style={{ '--chip-color': cfg?.color || AMBER }}
                    >
                      {name} +₹{Math.round(excess).toLocaleString('en-IN')}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Insights */}
        <div className="bdg-insights-row">
          <InsightCard
            index={0}
            icon={MdRadar}
            accent={AMBER}
            title="Projected spend"
            value={`₹${Math.round(projectedSpend).toLocaleString('en-IN')}`}
            sub="At current pace, end of month"
          />
          <InsightCard
            index={1}
            icon={MdSpeed}
            accent={
              projectedSpend > monthlyBudget && monthlyBudget > 0
                ? '#ff4444'
                : '#30d158'
            }
            title="Projection vs budget"
            value={
              monthlyBudget > 0
                ? `${projectedSpend > monthlyBudget ? '▲' : '▼'} ${Math.abs(Math.round(((projectedSpend - monthlyBudget) / monthlyBudget) * 100))}%`
                : '—'
            }
            sub={
              projectedSpend > monthlyBudget
                ? 'Will exceed budget'
                : 'Will stay within budget'
            }
          />
          <InsightCard
            index={2}
            icon={MdTrendingDown}
            accent={
              savingsRate >= 20
                ? '#30d158'
                : savingsRate > 0
                  ? AMBER
                  : '#ff4444'
            }
            title="Savings rate"
            value={`${savingsRate.toFixed(1)}%`}
            sub={
              savingsRate >= 20
                ? 'Excellent'
                : savingsRate > 0
                  ? 'Could improve'
                  : 'Spending exceeds income'
            }
          />
          <InsightCard
            index={3}
            icon={MdCalendarToday}
            accent={AMBER_BRIGHT}
            title="Daily pace"
            value={`₹${daysElapsed > 0 ? Math.round(totalExpenses / daysElapsed).toLocaleString('en-IN') : 0}`}
            sub={`Avg per day · ${daysElapsed} days in`}
          />
        </div>

        {/* Category limits */}
        <div className="bdg-section">
          <div className="bdg-section__header">
            <div className="bdg-section__bar" />
            <h2 className="bdg-section__title">Category Limits</h2>
            <span className="bdg-section__count">
              {Object.values(categoryLimits).filter((v) => v > 0).length} /{' '}
              {Object.keys(CATEGORY_CONFIG).length} set
            </span>
          </div>
          <p className="bdg-section__desc">
            Click the edit icon to set a monthly spending limit per category.
          </p>
          <div className="bdg-cat-list">
            <AnimatePresence>
              {Object.entries(CATEGORY_CONFIG).map(([name], i) => (
                <CategoryBudgetRow
                  key={name}
                  name={name}
                  spent={transactionsByCategory[name] || 0}
                  limit={categoryLimits[name] || 0}
                  onEdit={(n, lim) =>
                    setEditCategory({ name: n, current: lim })
                  }
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* No budget empty state */}
        <AnimatePresence>
          {!monthlyBudget && (
            <motion.div
              className="bdg-empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="bdg-empty__glyph">◈</div>
              <p className="bdg-empty__title">No budget set</p>
              <p className="bdg-empty__sub">
                Set your monthly budget to unlock velocity tracking, daily
                allowance and projections.
              </p>
              <button
                className="bdg-empty__cta"
                onClick={() => setShowBudgetModal(true)}
              >
                <MdAdd size={14} /> Set Monthly Budget
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
