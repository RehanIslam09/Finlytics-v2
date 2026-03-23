// ============================================================
// FILE: src/pages/Goals.jsx
// FinlyticsX — Savings Goals
// FIXED: useCurrency wired — all amounts respect navbar FX switcher
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInDays, parseISO } from 'date-fns';
import {
  MdAdd,
  MdClose,
  MdCheck,
  MdEdit,
  MdDelete,
  MdFlag,
  MdRocketLaunch,
  MdLaptop,
  MdFlight,
  MdHome,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdSchool,
  MdSavings,
  MdCardGiftcard,
  MdBusiness,
  MdStar,
  MdTrendingUp,
  MdCalendarToday,
  MdEmojiEvents,
  MdWallet,
} from 'react-icons/md';
import useCurrency from '../hooks/useCurrency';
import './Goals.css';

// ── Constants ──────────────────────────────────────────────
const GOAL_ICONS = [
  { id: 'rocket', icon: MdRocketLaunch, label: 'Dream', color: '#ff6b35' },
  { id: 'laptop', icon: MdLaptop, label: 'Tech', color: '#00d4ff' },
  { id: 'flight', icon: MdFlight, label: 'Travel', color: '#bf5af2' },
  { id: 'home', icon: MdHome, label: 'Home', color: '#8877ff' },
  { id: 'car', icon: MdDirectionsCar, label: 'Vehicle', color: '#ff2a6d' },
  { id: 'health', icon: MdHealthAndSafety, label: 'Health', color: '#30d158' },
  { id: 'school', icon: MdSchool, label: 'Education', color: '#00f5ff' },
  { id: 'savings', icon: MdSavings, label: 'Emergency', color: '#ffaa00' },
  { id: 'gift', icon: MdCardGiftcard, label: 'Gift', color: '#ff9f0a' },
  { id: 'biz', icon: MdBusiness, label: 'Business', color: '#ffd60a' },
  { id: 'star', icon: MdStar, label: 'Wishlist', color: '#ff4466' },
  { id: 'flag', icon: MdFlag, label: 'Milestone', color: '#00ff88' },
];

const GOLD = '#ffaa00';
const EMERALD = '#00ff88';
const ROSE = '#ff4466';

const STORAGE_KEY = 'finlyticsx_goals';

function loadGoals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}
function saveGoals(goals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

// ── Circular Progress Arc ──────────────────────────────────
function GoalArc({ pct, color, size = 120, stroke = 8 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const clamped = Math.min(pct, 100);
  const offset = circ - (clamped / 100) * circ;
  const arcColor = pct >= 100 ? EMERALD : color;

  return (
    <svg width={size} height={size} className="gl-arc">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={arcColor}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{ filter: `drop-shadow(0 0 6px ${arcColor})` }}
      />
      {[25, 50, 75, 100].map((tick) => {
        const angle = (tick / 100) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const cx = size / 2 + (r + stroke / 2 + 4) * Math.cos(rad);
        const cy = size / 2 + (r + stroke / 2 + 4) * Math.sin(rad);
        return (
          <circle
            key={tick}
            cx={cx}
            cy={cy}
            r={1.5}
            fill={clamped >= tick ? arcColor : 'rgba(255,255,255,0.1)'}
          />
        );
      })}
    </svg>
  );
}

// ── Confetti ───────────────────────────────────────────────
function Confetti({ active }) {
  if (!active) return null;
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 200,
    y: -(Math.random() * 160 + 40),
    r: Math.random() * 6 + 3,
    color: [GOLD, EMERALD, '#00f5ff', '#ff6b35', '#bf5af2'][i % 5],
  }));
  return (
    <div className="gl-confetti">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="gl-confetti__dot"
          style={{ background: p.color, width: p.r, height: p.r }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

// ── Goal Card ──────────────────────────────────────────────
function GoalCard({ goal, onEdit, onDelete, onContribute, index }) {
  // ── useCurrency inside GoalCard so it re-renders on FX change ──
  const { formatCurrency } = useCurrency();

  const [showConfetti, setShowConfetti] = useState(false);
  const cfg = GOAL_ICONS.find((g) => g.id === goal.iconId) || GOAL_ICONS[0];
  const Icon = cfg.icon;
  const pct =
    goal.targetAmount > 0
      ? Math.min((goal.savedAmount / goal.targetAmount) * 100, 100)
      : 0;
  const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
  const isComplete = pct >= 100;
  const daysLeft = goal.targetDate
    ? differenceInDays(parseISO(goal.targetDate), new Date())
    : null;
  const isOverdue = daysLeft !== null && daysLeft < 0 && !isComplete;
  const accentColor = isComplete ? EMERALD : isOverdue ? ROSE : cfg.color;

  const prevPct = useRef(pct);
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const crossed = milestones.some((m) => prevPct.current < m && pct >= m);
    if (crossed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1400);
    }
    prevPct.current = pct;
  }, [pct]);

  return (
    <motion.div
      className={`gl-card ${isComplete ? 'complete' : ''} ${isOverdue ? 'overdue' : ''}`}
      style={{
        '--card-accent': accentColor,
        '--card-glow': `${accentColor}28`,
      }}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{
        delay: index * 0.06,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      layout
    >
      <div
        className="gl-card__top-line"
        style={{
          background: `linear-gradient(90deg,transparent,${accentColor},transparent)`,
        }}
      />
      <div className="gl-card__bracket-tl" />
      <div className="gl-card__bracket-br" />
      <Confetti active={showConfetti} />

      {/* Header */}
      <div className="gl-card__header">
        <div
          className="gl-card__icon-wrap"
          style={{
            background: `${accentColor}18`,
            boxShadow: `0 0 20px ${accentColor}25`,
          }}
        >
          {isComplete ? (
            <MdEmojiEvents size={22} style={{ color: EMERALD }} />
          ) : (
            <Icon size={22} style={{ color: accentColor }} />
          )}
        </div>
        <div className="gl-card__title-block">
          <h3 className="gl-card__title">{goal.name}</h3>
          <span
            className="gl-card__category"
            style={{
              color: accentColor,
              borderColor: `${accentColor}30`,
              background: `${accentColor}10`,
            }}
          >
            {cfg.label}
          </span>
        </div>
        <div className="gl-card__actions">
          <button
            className="gl-card__action-btn"
            onClick={() => onContribute(goal)}
            title="Add contribution"
          >
            <MdWallet size={13} />
          </button>
          <button
            className="gl-card__action-btn"
            onClick={() => onEdit(goal)}
            title="Edit"
          >
            <MdEdit size={13} />
          </button>
          <button
            className="gl-card__action-btn gl-card__action-btn--danger"
            onClick={() => onDelete(goal.id)}
            title="Delete"
          >
            <MdDelete size={13} />
          </button>
        </div>
      </div>

      {/* Arc + amounts */}
      <div className="gl-card__body">
        <div className="gl-card__arc-wrap">
          <GoalArc pct={pct} color={accentColor} size={120} stroke={8} />
          <div className="gl-card__arc-center">
            <span className="gl-card__pct" style={{ color: accentColor }}>
              {isComplete ? '✓' : `${Math.round(pct)}%`}
            </span>
            <span className="gl-card__pct-label">
              {isComplete ? 'DONE' : 'SAVED'}
            </span>
          </div>
        </div>
        <div className="gl-card__amounts">
          <div className="gl-card__amount-row">
            <span className="gl-card__amount-label">Saved</span>
            <span
              className="gl-card__amount-value"
              style={{ color: accentColor }}
            >
              {formatCurrency(goal.savedAmount)}
            </span>
          </div>
          <div className="gl-card__amount-divider" />
          <div className="gl-card__amount-row">
            <span className="gl-card__amount-label">Target</span>
            <span className="gl-card__amount-value">
              {formatCurrency(goal.targetAmount)}
            </span>
          </div>
          <div className="gl-card__amount-divider" />
          <div className="gl-card__amount-row">
            <span className="gl-card__amount-label">Remaining</span>
            <span
              className="gl-card__amount-value"
              style={{ color: isComplete ? EMERALD : 'inherit' }}
            >
              {isComplete ? 'Complete! 🎉' : formatCurrency(remaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="gl-card__bar-track">
        <motion.div
          className="gl-card__bar-fill"
          style={{
            background: `linear-gradient(90deg,${accentColor}aa,${accentColor})`,
            boxShadow: `0 0 8px ${accentColor}60`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />
      </div>

      {/* Footer */}
      <div className="gl-card__footer">
        {goal.targetDate && (
          <span className={`gl-card__deadline ${isOverdue ? 'overdue' : ''}`}>
            <MdCalendarToday size={10} />
            {isComplete
              ? 'Goal reached!'
              : isOverdue
                ? `${Math.abs(daysLeft)} days overdue`
                : `${daysLeft} days left`}
          </span>
        )}
        {goal.notes && <span className="gl-card__notes">"{goal.notes}"</span>}
      </div>

      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="gl-card__complete-banner"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <MdEmojiEvents size={12} /> GOAL ACHIEVED
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Goal Modal ─────────────────────────────────────────────
function GoalModal({ goal, onSave, onClose }) {
  const isEdit = !!goal?.id;
  const [form, setForm] = useState({
    name: goal?.name || '',
    targetAmount: goal?.targetAmount || '',
    savedAmount: goal?.savedAmount || 0,
    targetDate: goal?.targetDate || '',
    iconId: goal?.iconId || 'rocket',
    notes: goal?.notes || '',
  });
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Goal name is required';
    if (!form.targetAmount || Number(form.targetAmount) <= 0)
      e.targetAmount = 'Enter a valid target amount';
    if (Number(form.savedAmount) < 0) e.savedAmount = 'Cannot be negative';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave({
      ...goal,
      id: goal?.id || crypto.randomUUID(),
      name: form.name.trim(),
      targetAmount: Number(form.targetAmount),
      savedAmount: Number(form.savedAmount) || 0,
      targetDate: form.targetDate || null,
      iconId: form.iconId,
      notes: form.notes.trim(),
      createdAt: goal?.createdAt || new Date().toISOString(),
    });
    onClose();
  };

  const selectedCfg =
    GOAL_ICONS.find((g) => g.id === form.iconId) || GOAL_ICONS[0];

  return (
    <motion.div
      className="gl-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="gl-modal"
        style={{ '--modal-accent': selectedCfg.color }}
        initial={{ scale: 0.88, y: 32, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="gl-modal__glow-top"
          style={{
            background: `linear-gradient(90deg,transparent,${selectedCfg.color}40,transparent)`,
          }}
        />

        <div className="gl-modal__header">
          <div className="gl-modal__title-wrap">
            <div
              className="gl-modal__title-icon"
              style={{
                background: `${selectedCfg.color}18`,
                color: selectedCfg.color,
              }}
            >
              <selectedCfg.icon size={16} />
            </div>
            <span className="gl-modal__title">
              {isEdit ? 'Edit Goal' : 'New Savings Goal'}
            </span>
          </div>
          <button className="gl-modal__close" onClick={onClose}>
            <MdClose size={16} />
          </button>
        </div>

        <div className="gl-modal__body">
          <div className="gl-modal__field">
            <label className="gl-modal__label">Goal Icon</label>
            <div className="gl-icon-grid">
              {GOAL_ICONS.map((g) => {
                const GIcon = g.icon;
                const active = form.iconId === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    className={`gl-icon-btn ${active ? 'active' : ''}`}
                    style={{ '--ig-color': g.color }}
                    onClick={() => setForm((f) => ({ ...f, iconId: g.id }))}
                  >
                    <GIcon size={16} />
                    <span>{g.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="gl-modal__field">
            <label className="gl-modal__label">
              Goal Name <span className="gl-req">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              className={`gl-modal__input ${errors.name ? 'error' : ''}`}
              placeholder="e.g. New MacBook Pro"
              value={form.name}
              onChange={(e) => {
                setForm((f) => ({ ...f, name: e.target.value }));
                setErrors((er) => ({ ...er, name: '' }));
              }}
            />
            {errors.name && <p className="gl-modal__error">{errors.name}</p>}
          </div>

          <div className="gl-modal__row">
            <div className="gl-modal__field">
              <label className="gl-modal__label">
                Target Amount <span className="gl-req">*</span>
              </label>
              <div className="gl-modal__input-wrap">
                <span
                  className="gl-modal__prefix"
                  style={{ color: selectedCfg.color }}
                >
                  ₹
                </span>
                <input
                  type="number"
                  className={`gl-modal__input gl-modal__input--prefixed ${errors.targetAmount ? 'error' : ''}`}
                  placeholder="80000"
                  value={form.targetAmount}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, targetAmount: e.target.value }));
                    setErrors((er) => ({ ...er, targetAmount: '' }));
                  }}
                />
              </div>
              {errors.targetAmount && (
                <p className="gl-modal__error">{errors.targetAmount}</p>
              )}
            </div>
            <div className="gl-modal__field">
              <label className="gl-modal__label">Already Saved</label>
              <div className="gl-modal__input-wrap">
                <span className="gl-modal__prefix">₹</span>
                <input
                  type="number"
                  className={`gl-modal__input gl-modal__input--prefixed ${errors.savedAmount ? 'error' : ''}`}
                  placeholder="0"
                  value={form.savedAmount}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, savedAmount: e.target.value }));
                    setErrors((er) => ({ ...er, savedAmount: '' }));
                  }}
                />
              </div>
              {errors.savedAmount && (
                <p className="gl-modal__error">{errors.savedAmount}</p>
              )}
            </div>
          </div>

          <div className="gl-modal__field">
            <label className="gl-modal__label">
              Target Date{' '}
              <span style={{ opacity: 0.4, fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              type="date"
              className="gl-modal__input gl-modal__input--date"
              value={form.targetDate}
              style={{ colorScheme: 'dark' }}
              onChange={(e) =>
                setForm((f) => ({ ...f, targetDate: e.target.value }))
              }
            />
          </div>

          <div className="gl-modal__field">
            <label className="gl-modal__label">
              Notes{' '}
              <span style={{ opacity: 0.4, fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              className="gl-modal__input gl-modal__textarea"
              placeholder="Why this goal matters to you…"
              rows={2}
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="gl-modal__footer">
          <button className="gl-modal__btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="gl-modal__btn-save"
            style={{
              background: selectedCfg.color,
              borderColor: selectedCfg.color,
            }}
            onClick={handleSave}
          >
            <MdCheck size={14} /> {isEdit ? 'Save Changes' : 'Create Goal'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Contribute Modal ───────────────────────────────────────
function ContributeModal({ goal, onSave, onClose }) {
  const { formatCurrency } = useCurrency();
  const cfg = GOAL_ICONS.find((g) => g.id === goal.iconId) || GOAL_ICONS[0];
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);

  const handleSave = () => {
    const num = Number(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setError('Enter a valid amount');
      return;
    }
    onSave(goal.id, Math.min(num, remaining + num));
    onClose();
  };

  const QUICK = [500, 1000, 2000, 5000].filter((v) => v <= remaining + 1);

  return (
    <motion.div
      className="gl-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="gl-modal gl-modal--sm"
        style={{ '--modal-accent': cfg.color }}
        initial={{ scale: 0.88, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="gl-modal__glow-top"
          style={{
            background: `linear-gradient(90deg,transparent,${cfg.color}40,transparent)`,
          }}
        />

        <div className="gl-modal__header">
          <div className="gl-modal__title-wrap">
            <div
              className="gl-modal__title-icon"
              style={{ background: `${cfg.color}18`, color: cfg.color }}
            >
              <MdWallet size={16} />
            </div>
            <span className="gl-modal__title">Add Contribution</span>
          </div>
          <button className="gl-modal__close" onClick={onClose}>
            <MdClose size={16} />
          </button>
        </div>

        <div className="gl-modal__body">
          <div className="gl-contribute__goal-name">{goal.name}</div>
          <div className="gl-contribute__remaining">
            {formatCurrency(remaining)} remaining
          </div>
          <div className="gl-modal__input-wrap" style={{ marginBottom: 12 }}>
            <span className="gl-modal__prefix" style={{ color: cfg.color }}>
              ₹
            </span>
            <input
              ref={inputRef}
              type="number"
              className={`gl-modal__input gl-modal__input--prefixed gl-modal__input--lg ${error ? 'error' : ''}`}
              placeholder="0"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          {error && <p className="gl-modal__error">{error}</p>}
          {QUICK.length > 0 && (
            <div className="gl-contribute__quick">
              {QUICK.map((v) => (
                <button
                  key={v}
                  type="button"
                  className="gl-contribute__quick-btn"
                  style={{ '--q-color': cfg.color }}
                  onClick={() => {
                    setAmount(String(v));
                    setError('');
                  }}
                >
                  ₹{v.toLocaleString('en-IN')}
                </button>
              ))}
              <button
                type="button"
                className="gl-contribute__quick-btn"
                style={{ '--q-color': EMERALD }}
                onClick={() => {
                  setAmount(String(Math.ceil(remaining)));
                  setError('');
                }}
              >
                Full ₹{Math.ceil(remaining).toLocaleString('en-IN')}
              </button>
            </div>
          )}
        </div>

        <div className="gl-modal__footer">
          <button className="gl-modal__btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="gl-modal__btn-save"
            style={{ background: cfg.color, borderColor: cfg.color }}
            onClick={handleSave}
          >
            <MdTrendingUp size={14} /> Add ₹
            {Number(amount || 0).toLocaleString('en-IN')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Summary Strip ──────────────────────────────────────────
function SummaryStrip({ goals }) {
  const { formatCurrency } = useCurrency();

  const total = goals.length;
  const completed = goals.filter((g) => g.savedAmount >= g.targetAmount).length;
  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const overallPct = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const stats = [
    { label: 'Active Goals', value: total, accent: GOLD, icon: MdFlag },
    {
      label: 'Completed',
      value: completed,
      accent: EMERALD,
      icon: MdEmojiEvents,
    },
    {
      label: 'Total Saved',
      value: formatCurrency(totalSaved),
      accent: '#00d4ff',
      icon: MdWallet,
    },
    {
      label: 'Overall Progress',
      value: `${Math.round(overallPct)}%`,
      accent: GOLD,
      icon: MdTrendingUp,
    },
  ];

  return (
    <div className="gl-summary-strip">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          className="gl-stat-card"
          style={{ '--sc-accent': s.accent }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.07,
            duration: 0.38,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="gl-stat-icon">
            <s.icon size={15} />
          </div>
          <div className="gl-stat-body">
            <span className="gl-stat-label">{s.label}</span>
            <span className="gl-stat-value" style={{ color: s.accent }}>
              {s.value}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────
function EmptyState({ onAdd }) {
  return (
    <motion.div
      className="gl-empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="gl-empty__icon">
        <MdRocketLaunch size={40} style={{ color: GOLD, opacity: 0.6 }} />
      </div>
      <h2 className="gl-empty__title">No goals yet</h2>
      <p className="gl-empty__sub">
        Set your first savings goal — a new laptop, an emergency fund, your
        dream trip — and track your progress every step of the way.
      </p>
      <button className="gl-empty__cta" onClick={onAdd}>
        <MdAdd size={14} /> Create First Goal
      </button>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────
export default function Goals() {
  const [goals, setGoals] = useState(loadGoals);
  const [showModal, setShowModal] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [contribGoal, setContribGoal] = useState(null);

  const persist = useCallback((updated) => {
    setGoals(updated);
    saveGoals(updated);
  }, []);

  const handleSaveGoal = (goal) => {
    const existing = goals.find((g) => g.id === goal.id);
    if (existing) persist(goals.map((g) => (g.id === goal.id ? goal : g)));
    else persist([goal, ...goals]);
  };

  const handleDelete = (id) => persist(goals.filter((g) => g.id !== id));

  const handleContribute = (goalId, addAmount) => {
    persist(
      goals.map((g) =>
        g.id === goalId
          ? {
              ...g,
              savedAmount: Math.min(
                g.savedAmount + addAmount,
                g.targetAmount * 2,
              ),
            }
          : g,
      ),
    );
  };

  const completed = goals.filter((g) => g.savedAmount >= g.targetAmount);
  const active = goals.filter((g) => g.savedAmount < g.targetAmount);

  return (
    <div className="gl-page">
      <div className="gl-scanlines" aria-hidden />
      <div className="gl-orb gl-orb--1" />
      <div className="gl-orb gl-orb--2" />

      <AnimatePresence>
        {(showModal || editGoal) && (
          <GoalModal
            goal={editGoal}
            onSave={handleSaveGoal}
            onClose={() => {
              setShowModal(false);
              setEditGoal(null);
            }}
          />
        )}
        {contribGoal && (
          <ContributeModal
            goal={contribGoal}
            onSave={handleContribute}
            onClose={() => setContribGoal(null)}
          />
        )}
      </AnimatePresence>

      <div className="gl-content">
        <motion.div
          className="gl-header"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
        >
          <div className="gl-header__left">
            <div className="gl-header__eyebrow">
              <span className="gl-eyebrow-dot" /> SAVINGS INTELLIGENCE
            </div>
            <h1 className="gl-header__title">Savings Goals</h1>
            <p className="gl-header__sub">
              Define it. Track it. Achieve it. Every rupee with purpose.
            </p>
          </div>
          <motion.button
            className="gl-btn-new"
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <MdAdd size={16} /> New Goal
          </motion.button>
        </motion.div>

        <div className="gl-glow-rule" />

        {goals.length === 0 ? (
          <EmptyState onAdd={() => setShowModal(true)} />
        ) : (
          <>
            <SummaryStrip goals={goals} />

            {active.length > 0 && (
              <div className="gl-section">
                <div className="gl-section__header">
                  <div className="gl-section__bar" />
                  <h2 className="gl-section__title">In Progress</h2>
                  <span className="gl-section__count">{active.length}</span>
                </div>
                <div className="gl-cards-grid">
                  <AnimatePresence mode="popLayout">
                    {active.map((g, i) => (
                      <GoalCard
                        key={g.id}
                        goal={g}
                        index={i}
                        onEdit={setEditGoal}
                        onDelete={handleDelete}
                        onContribute={setContribGoal}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {completed.length > 0 && (
              <div className="gl-section">
                <div className="gl-section__header">
                  <div
                    className="gl-section__bar"
                    style={{
                      background: EMERALD,
                      boxShadow: `0 0 8px ${EMERALD}60`,
                    }}
                  />
                  <h2 className="gl-section__title" style={{ color: EMERALD }}>
                    Achieved 🎉
                  </h2>
                  <span
                    className="gl-section__count"
                    style={{
                      borderColor: `${EMERALD}30`,
                      background: `${EMERALD}10`,
                      color: EMERALD,
                    }}
                  >
                    {completed.length}
                  </span>
                </div>
                <div className="gl-cards-grid">
                  <AnimatePresence mode="popLayout">
                    {completed.map((g, i) => (
                      <GoalCard
                        key={g.id}
                        goal={g}
                        index={i}
                        onEdit={setEditGoal}
                        onDelete={handleDelete}
                        onContribute={setContribGoal}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
