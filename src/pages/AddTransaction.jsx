// ============================================================
// FILE: src/pages/AddTransaction.jsx
// FinlyticsX — Add Transaction Page
// Layout: Split hero (type+amount) → two-col details below
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import {
  MdArrowBack,
  MdArrowUpward,
  MdArrowDownward,
  MdRestaurant,
  MdDirectionsCar,
  MdHome,
  MdShoppingBag,
  MdMovie,
  MdFitnessCenter,
  MdElectricalServices,
  MdSubscriptions,
  MdAccountBalanceWallet,
  MdRepeat,
  MdCheckCircle,
  MdChevronLeft,
  MdChevronRight,
  MdCalendarToday,
  MdNotes,
  MdClose,
  MdWarning,
} from 'react-icons/md';
import { useFinance } from '../context/FinanceContext';
import './AddTransaction.css';

// ── Validation schema ──────────────────────────────────────
const schema = yup.object({
  title: yup
    .string()
    .trim()
    .min(2, 'At least 2 characters')
    .max(60, 'Too long')
    .required('Title is required'),
  amount: yup
    .number()
    .typeError('Enter a valid amount')
    .positive('Must be positive')
    .max(10000000, 'Too large')
    .required('Amount is required'),
  category: yup.string().required('Pick a category'),
  date: yup.string().required('Date is required'),
  notes: yup.string().max(200, 'Max 200 characters').optional(),
});

// ── Category config ────────────────────────────────────────
const CATEGORIES = [
  { id: 'Food', icon: MdRestaurant, color: '#ff6b35', label: 'Food' },
  { id: 'Travel', icon: MdDirectionsCar, color: '#00d4ff', label: 'Travel' },
  { id: 'Rent', icon: MdHome, color: '#8877ff', label: 'Rent' },
  { id: 'Shopping', icon: MdShoppingBag, color: '#ff2a6d', label: 'Shopping' },
  {
    id: 'Entertainment',
    icon: MdMovie,
    color: '#bf5af2',
    label: 'Entertainment',
  },
  { id: 'Health', icon: MdFitnessCenter, color: '#30d158', label: 'Health' },
  {
    id: 'Utilities',
    icon: MdElectricalServices,
    color: '#ffd60a',
    label: 'Utilities',
  },
  {
    id: 'Subscriptions',
    icon: MdSubscriptions,
    color: '#ff9f0a',
    label: 'Subscriptions',
  },
  {
    id: 'Income',
    icon: MdAccountBalanceWallet,
    color: '#00ff88',
    label: 'Income',
  },
];

// ── Custom Date Picker ─────────────────────────────────────
function CustomDatePicker({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(
    value ? new Date(value) : new Date(),
  );
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = value ? new Date(value) : null;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectDay = (day) => {
    if (!day) return;
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(iso);
    setOpen(false);
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isSelected = (day) => {
    if (!selected || !day) return false;
    return (
      selected.getFullYear() === year &&
      selected.getMonth() === month &&
      selected.getDate() === day
    );
  };

  const isToday = (day) => {
    if (!day) return false;
    const t = new Date();
    return (
      t.getFullYear() === year && t.getMonth() === month && t.getDate() === day
    );
  };

  return (
    <div className="adx-datepicker" ref={ref}>
      <button
        type="button"
        className={`adx-datepicker__trigger ${error ? 'adx-input--error' : ''} ${value ? 'has-value' : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        <MdCalendarToday size={14} className="adx-datepicker__icon" />
        <span>
          {value ? format(new Date(value), 'dd MMM yyyy') : 'Select date'}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="adx-calendar"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Calendar header */}
            <div className="adx-calendar__header">
              <button type="button" className="adx-cal-nav" onClick={prevMonth}>
                <MdChevronLeft size={16} />
              </button>
              <span className="adx-calendar__month">
                {MONTHS[month]} {year}
              </span>
              <button type="button" className="adx-cal-nav" onClick={nextMonth}>
                <MdChevronRight size={16} />
              </button>
            </div>

            {/* Day labels */}
            <div className="adx-calendar__days-header">
              {DAYS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            {/* Day cells */}
            <div className="adx-calendar__grid">
              {cells.map((day, i) => (
                <button
                  key={i}
                  type="button"
                  className={`adx-cal-day ${!day ? 'empty' : ''} ${isSelected(day) ? 'selected' : ''} ${isToday(day) && !isSelected(day) ? 'today' : ''}`}
                  onClick={() => selectDay(day)}
                  disabled={!day}
                >
                  {day || ''}
                </button>
              ))}
            </div>

            {/* Today shortcut */}
            <div className="adx-calendar__footer">
              <button
                type="button"
                className="adx-cal-today-btn"
                onClick={() => {
                  const t = new Date();
                  setViewDate(t);
                  const iso = format(t, 'yyyy-MM-dd');
                  onChange(iso);
                  setOpen(false);
                }}
              >
                Today
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Success Overlay ────────────────────────────────────────
function SuccessOverlay({ type, amount, title }) {
  const isIncome = type === 'income';
  return (
    <motion.div
      className="adx-success"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Radial glow */}
      <div
        className="adx-success__glow"
        style={{
          background: isIncome
            ? 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,255,136,0.18) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,42,42,0.18) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="adx-success__card"
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Icon ring */}
        <motion.div
          className="adx-success__icon"
          style={{
            borderColor: isIncome ? '#00ff88' : '#ff4444',
            boxShadow: `0 0 30px ${isIncome ? 'rgba(0,255,136,0.35)' : 'rgba(255,68,68,0.35)'}`,
          }}
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.25, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <MdCheckCircle
            size={40}
            style={{ color: isIncome ? '#00ff88' : '#ff4444' }}
          />
        </motion.div>

        <motion.p
          className="adx-success__label"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.35 }}
        >
          {isIncome ? 'INCOME RECORDED' : 'EXPENSE LOGGED'}
        </motion.p>

        <motion.p
          className="adx-success__title"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, duration: 0.35 }}
        >
          {title}
        </motion.p>

        <motion.p
          className="adx-success__amount"
          style={{ color: isIncome ? '#00ff88' : '#ff4444' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {isIncome ? '+' : '−'}₹{Number(amount).toLocaleString('en-IN')}
        </motion.p>

        <motion.p
          className="adx-success__sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          Redirecting to ledger...
        </motion.p>

        {/* Scanning line */}
        <motion.div
          className="adx-success__scan"
          initial={{ top: '0%' }}
          animate={{ top: '100%' }}
          transition={{
            delay: 0.3,
            duration: 1.4,
            ease: 'linear',
            repeat: Infinity,
          }}
          style={{
            background: isIncome
              ? 'rgba(0,255,136,0.12)'
              : 'rgba(255,68,68,0.12)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────
export default function AddTransaction() {
  const { addTransaction } = useFinance();
  const navigate = useNavigate();

  const [txType, setTxType] = useState('expense');
  const [success, setSuccess] = useState(null); // { type, amount, title }
  const [charCount, setCharCount] = useState(0);

  // ── Validation warning state ───────────────────────────
  const [submitError, setSubmitError] = useState(null);
  const [isShaking, setIsShaking] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      amount: '',
      category: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
      recurring: false,
    },
  });

  const watchedAmount = watch('amount');
  const watchedTitle = watch('title');
  const watchedCategory = watch('category');
  const watchedRecurring = watch('recurring');
  const watchedNotes = watch('notes');

  // Sync type toggle → category reset when switching to income
  useEffect(() => {
    if (txType === 'income') setValue('category', 'Income');
    else if (watchedCategory === 'Income') setValue('category', '');
  }, [txType]);

  // Notes char count
  useEffect(() => {
    setCharCount((watchedNotes || '').length);
  }, [watchedNotes]);

  // Auto-dismiss the toast when user starts fixing the missing fields
  useEffect(() => {
    if (submitError) setSubmitError(null);
  }, [watchedAmount, watchedTitle, watchedCategory]);

  // Trigger the submit button shake animation
  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 420);
  };

  // Called when yup validation fails on submit
  const onValidationError = (errors) => {
    const missing = [];
    if (errors.amount) missing.push('Amount');
    if (errors.title) missing.push('Title');
    if (errors.category) missing.push('Category');
    if (errors.date) missing.push('Date');
    setSubmitError(missing.join(' · '));
    triggerShake();
  };

  const onSubmit = async (data) => {
    const transaction = {
      id: uuidv4(),
      title: data.title.trim(),
      amount: Number(data.amount),
      category: data.category,
      type: txType,
      date: new Date(data.date).toISOString(),
      notes: data.notes?.trim() || '',
      recurring: data.recurring,
    };

    addTransaction(transaction);

    setSuccess({ type: txType, amount: data.amount, title: data.title.trim() });

    setTimeout(() => {
      navigate('/transactions');
    }, 2800);
  };

  const isIncome = txType === 'income';
  const accentColor = isIncome ? '#00ff88' : '#ff4444';
  const accentGlow = isIncome ? 'rgba(0,255,136,0.25)' : 'rgba(255,42,42,0.25)';
  const visibleCats =
    txType === 'income'
      ? CATEGORIES.filter((c) => c.id === 'Income')
      : CATEGORIES.filter((c) => c.id !== 'Income');

  return (
    <div className="adx-page">
      {/* Scanline */}
      <div className="adx-scanlines" aria-hidden />

      {/* Success overlay */}
      <AnimatePresence>
        {success && <SuccessOverlay {...success} />}
      </AnimatePresence>

      <form
        className="adx-form"
        onSubmit={handleSubmit(onSubmit, onValidationError)}
        noValidate
      >
        {/* ── Back link ─────────────────────────────── */}
        <motion.div
          className="adx-back"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/transactions" className="adx-back__link">
            <MdArrowBack size={14} /> Back to ledger
          </Link>
        </motion.div>

        {/* ── Validation toast ──────────────────────── */}
        <AnimatePresence>
          {submitError && (
            <motion.div
              className="adx-validation-toast"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="adx-toast-icon">
                <MdWarning size={14} style={{ color: '#ff4444' }} />
              </div>
              <div className="adx-toast-body">
                <p className="adx-toast-title">MISSING REQUIRED FIELDS</p>
                <p className="adx-toast-msg">Please fill in: {submitError}</p>
              </div>
              <button
                type="button"
                className="adx-toast-dismiss"
                onClick={() => setSubmitError(null)}
                aria-label="Dismiss warning"
              >
                <MdClose size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════
            HERO ZONE — type toggle + amount
        ══════════════════════════════════════════ */}
        <motion.div
          className="adx-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Ambient glow orb behind hero */}
          <div
            className="adx-hero__orb"
            style={{
              background: `radial-gradient(ellipse 70% 80% at 50% 50%, ${accentGlow} 0%, transparent 70%)`,
            }}
          />

          {/* Eyebrow */}
          <div className="adx-hero__eyebrow">
            <span
              className="adx-eyebrow-dot"
              style={{
                background: accentColor,
                boxShadow: `0 0 8px ${accentColor}`,
              }}
            />
            NEW ENTRY
          </div>

          {/* Page title */}
          <h1 className="adx-hero__title">Log Transaction</h1>

          {/* ── Type Toggle ── */}
          <div className="adx-type-toggle">
            <button
              type="button"
              className={`adx-type-btn ${txType === 'expense' ? 'active' : ''}`}
              style={
                txType === 'expense'
                  ? {
                      '--btn-color': '#ff4444',
                      '--btn-glow': 'rgba(255,68,68,0.3)',
                    }
                  : {}
              }
              onClick={() => setTxType('expense')}
            >
              <MdArrowDownward size={18} />
              <span className="adx-type-btn__label">EXPENSE</span>
              <span className="adx-type-btn__sub">Money out</span>
            </button>

            <div className="adx-type-divider">
              <span>or</span>
            </div>

            <button
              type="button"
              className={`adx-type-btn ${txType === 'income' ? 'active' : ''}`}
              style={
                txType === 'income'
                  ? {
                      '--btn-color': '#00ff88',
                      '--btn-glow': 'rgba(0,255,136,0.3)',
                    }
                  : {}
              }
              onClick={() => setTxType('income')}
            >
              <MdArrowUpward size={18} />
              <span className="adx-type-btn__label">INCOME</span>
              <span className="adx-type-btn__sub">Money in</span>
            </button>
          </div>

          {/* ── Amount field ── */}
          <div className="adx-amount-wrap">
            <span
              className="adx-amount-currency"
              style={{ color: accentColor }}
            >
              ₹
            </span>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0"
              className={`adx-amount-input ${errors.amount ? 'adx-amount-input--error' : ''}`}
              style={{
                '--amount-color': accentColor,
                '--amount-glow': accentGlow,
              }}
              {...register('amount')}
            />
          </div>
          {errors.amount && (
            <p className="adx-hero-error">{errors.amount.message}</p>
          )}
        </motion.div>

        {/* ── Glow rule ──────────────────────────────── */}
        <motion.div
          className="adx-glow-rule"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accentColor} 40%, ${accentColor} 60%, transparent 100%)`,
            boxShadow: `0 0 10px ${accentGlow}`,
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.55 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* ══════════════════════════════════════════
            DETAILS ZONE — two-column grid
        ══════════════════════════════════════════ */}
        <motion.div
          className="adx-details"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── LEFT COLUMN ── */}
          <div className="adx-col">
            {/* Title field */}
            <div className="adx-field">
              <label className="adx-label">
                Transaction title
                <span className="adx-label-req">*</span>
              </label>
              <input
                type="text"
                className={`adx-input ${errors.title ? 'adx-input--error' : ''}`}
                placeholder="e.g. Swiggy Order, Salary Credit…"
                autoComplete="off"
                {...register('title')}
              />
              {errors.title && (
                <p className="adx-error">{errors.title.message}</p>
              )}
            </div>

            {/* Category picker */}
            <div className="adx-field">
              <label className="adx-label">
                Category
                <span className="adx-label-req">*</span>
              </label>

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <div
                    className={`adx-category-grid ${errors.category ? 'adx-category-grid--error' : ''}`}
                  >
                    <AnimatePresence mode="popLayout">
                      {visibleCats.map((cat, i) => {
                        const Icon = cat.icon;
                        const isActive = field.value === cat.id;
                        return (
                          <motion.button
                            key={cat.id}
                            type="button"
                            className={`adx-cat-btn ${isActive ? 'active' : ''}`}
                            style={{
                              '--cat-color': cat.color,
                              '--cat-bg': `${cat.color}18`,
                              '--cat-glow': `${cat.color}30`,
                            }}
                            onClick={() => field.onChange(cat.id)}
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.88 }}
                            transition={{
                              delay: i * 0.03,
                              duration: 0.25,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                          >
                            <div
                              className="adx-cat-icon"
                              style={{
                                background: isActive
                                  ? `${cat.color}28`
                                  : `${cat.color}12`,
                                color: cat.color,
                                boxShadow: isActive
                                  ? `0 0 12px ${cat.color}50`
                                  : 'none',
                              }}
                            >
                              <Icon size={16} />
                            </div>
                            <span className="adx-cat-label">{cat.label}</span>
                          </motion.button>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              />
              {errors.category && (
                <p className="adx-error">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="adx-col">
            {/* Date field */}
            <div className="adx-field">
              <label className="adx-label">
                Date
                <span className="adx-label-req">*</span>
              </label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.date}
                  />
                )}
              />
              {errors.date && (
                <p className="adx-error">{errors.date.message}</p>
              )}
            </div>

            {/* Notes field */}
            <div className="adx-field">
              <label
                className="adx-label"
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <span>
                  <MdNotes size={12} style={{ marginRight: 5, opacity: 0.6 }} />
                  Notes{' '}
                  <span style={{ opacity: 0.5, fontWeight: 400 }}>
                    (optional)
                  </span>
                </span>
                <span
                  className={`adx-char-count ${charCount > 180 ? 'warn' : ''}`}
                >
                  {charCount}/200
                </span>
              </label>
              <textarea
                className="adx-textarea"
                placeholder="Add any extra context here…"
                rows={4}
                {...register('notes')}
              />
              {errors.notes && (
                <p className="adx-error">{errors.notes.message}</p>
              )}
            </div>

            {/* Recurring toggle */}
            <div className="adx-field">
              <Controller
                name="recurring"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    className={`adx-recurring-btn ${field.value ? 'active' : ''}`}
                    onClick={() => field.onChange(!field.value)}
                  >
                    <div className="adx-recurring-left">
                      <div
                        className={`adx-recurring-icon ${field.value ? 'active' : ''}`}
                      >
                        <MdRepeat size={16} />
                      </div>
                      <div className="adx-recurring-text">
                        <span className="adx-recurring-title">
                          Recurring transaction
                        </span>
                        <span className="adx-recurring-sub">
                          Repeats every month
                        </span>
                      </div>
                    </div>
                    <div
                      className={`adx-toggle-track ${field.value ? 'active' : ''}`}
                    >
                      <motion.div
                        className="adx-toggle-thumb"
                        animate={{ x: field.value ? 18 : 2 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </button>
                )}
              />
            </div>

            {/* ── Live Preview Card ── */}
            <AnimatePresence mode="wait">
              {(watchedTitle || watchedAmount) && (
                <motion.div
                  key={txType}
                  className="adx-preview"
                  style={{
                    '--preview-accent': accentColor,
                    '--preview-glow': accentGlow,
                  }}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="adx-preview__label">PREVIEW</div>
                  <div className="adx-preview__body">
                    <div className="adx-preview__left">
                      {watchedCategory &&
                        (() => {
                          const cat = CATEGORIES.find(
                            (c) => c.id === watchedCategory,
                          );
                          const Icon = cat?.icon;
                          return Icon ? (
                            <div
                              className="adx-preview__icon"
                              style={{
                                background: `${cat.color}18`,
                                color: cat.color,
                              }}
                            >
                              <Icon size={14} />
                            </div>
                          ) : null;
                        })()}
                      <div>
                        <p className="adx-preview__title">
                          {watchedTitle || '—'}
                        </p>
                        <p className="adx-preview__meta">
                          {watchedCategory || 'No category'} ·{' '}
                          {watchedRecurring ? '● REC' : 'One-time'}
                        </p>
                      </div>
                    </div>
                    <div
                      className="adx-preview__amount"
                      style={{ color: accentColor }}
                    >
                      {isIncome ? '+' : '−'}₹
                      {watchedAmount
                        ? Number(watchedAmount).toLocaleString('en-IN')
                        : '0'}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Submit row ─────────────────────────────── */}
        <motion.div
          className="adx-submit-row"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.38 }}
        >
          <Link to="/transactions" className="adx-btn-cancel">
            <MdClose size={14} /> Cancel
          </Link>

          <button
            type="submit"
            className={`adx-btn-submit ${isShaking ? 'adx-btn-shake' : ''}`}
            style={{
              '--submit-color': accentColor,
              '--submit-glow': accentGlow,
            }}
            disabled={isSubmitting || !!success}
          >
            {isSubmitting ? (
              <span className="adx-spinner" />
            ) : (
              <>
                <MdCheckCircle size={16} />
                {isIncome ? 'Record Income' : 'Log Expense'}
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
