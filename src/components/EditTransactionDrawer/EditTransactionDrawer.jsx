// ============================================================
// FILE: src/components/EditTransactionDrawer/EditTransactionDrawer.jsx
// FinlyticsX — Edit Transaction Slide-in Drawer
// Cinematic right-panel, pre-filled, matches AddTransaction aesthetic
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { format, parseISO } from 'date-fns';
import {
  MdClose,
  MdCheck,
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
  MdChevronLeft,
  MdChevronRight,
  MdCalendarToday,
  MdNotes,
  MdDelete,
} from 'react-icons/md';
import { useFinance } from '../../context/FinanceContext';
import './EditTransactionDrawer.css';

// ── Validation ─────────────────────────────────────────────
const schema = yup.object({
  title: yup
    .string()
    .trim()
    .min(2, 'At least 2 characters')
    .max(60)
    .required('Title is required'),
  amount: yup
    .number()
    .typeError('Enter a valid amount')
    .positive('Must be positive')
    .required('Amount is required'),
  category: yup.string().required('Pick a category'),
  date: yup.string().required('Date is required'),
  notes: yup.string().max(200).optional(),
});

// ── Category config ────────────────────────────────────────
const CATEGORIES = [
  { id: 'Food', icon: MdRestaurant, color: '#ff6b35' },
  { id: 'Travel', icon: MdDirectionsCar, color: '#00d4ff' },
  { id: 'Rent', icon: MdHome, color: '#8877ff' },
  { id: 'Shopping', icon: MdShoppingBag, color: '#ff2a6d' },
  { id: 'Entertainment', icon: MdMovie, color: '#bf5af2' },
  { id: 'Health', icon: MdFitnessCenter, color: '#30d158' },
  { id: 'Utilities', icon: MdElectricalServices, color: '#ffd60a' },
  { id: 'Subscriptions', icon: MdSubscriptions, color: '#ff9f0a' },
  { id: 'Income', icon: MdAccountBalanceWallet, color: '#00ff88' },
];

// ── Mini Date Picker ───────────────────────────────────────
function MiniDatePicker({ value, onChange, error }) {
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
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selected = value ? new Date(value) : null;
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
  const selectDay = (day) => {
    if (!day) return;
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(iso);
    setOpen(false);
  };

  return (
    <div className="edt-datepicker" ref={ref}>
      <button
        type="button"
        className={`edt-datepicker__trigger ${error ? 'edt-input--error' : ''} ${value ? 'has-value' : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        <MdCalendarToday size={13} />
        <span>
          {value ? format(new Date(value), 'dd MMM yyyy') : 'Select date'}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="edt-calendar"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="edt-calendar__header">
              <button
                type="button"
                className="edt-cal-nav"
                onClick={() => setViewDate(new Date(year, month - 1, 1))}
              >
                <MdChevronLeft size={15} />
              </button>
              <span className="edt-calendar__month">
                {MONTHS[month]} {year}
              </span>
              <button
                type="button"
                className="edt-cal-nav"
                onClick={() => setViewDate(new Date(year, month + 1, 1))}
              >
                <MdChevronRight size={15} />
              </button>
            </div>
            <div className="edt-calendar__days-header">
              {DAYS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="edt-calendar__grid">
              {cells.map((day, i) => (
                <button
                  key={i}
                  type="button"
                  className={`edt-cal-day ${!day ? 'empty' : ''} ${isSelected(day) ? 'selected' : ''} ${isToday(day) && !isSelected(day) ? 'today' : ''}`}
                  onClick={() => selectDay(day)}
                  disabled={!day}
                >
                  {day || ''}
                </button>
              ))}
            </div>
            <div className="edt-calendar__footer">
              <button
                type="button"
                className="edt-cal-today-btn"
                onClick={() => {
                  const t = new Date();
                  setViewDate(t);
                  onChange(format(t, 'yyyy-MM-dd'));
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

// ── Main Drawer ────────────────────────────────────────────
export default function EditTransactionDrawer({
  transaction,
  onClose,
  onDeleted,
}) {
  const { updateTransaction, deleteTransaction } = useFinance();
  const [txType, setTxType] = useState(transaction?.type || 'expense');
  const [charCount, setCharCount] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

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
      title: transaction?.title || '',
      amount: transaction?.amount || '',
      category: transaction?.category || '',
      date: transaction?.date
        ? format(parseISO(transaction.date), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
      notes: transaction?.notes || '',
      recurring: transaction?.recurring || false,
    },
  });

  const watchedNotes = watch('notes');
  const watchedAmount = watch('amount');
  const watchedCategory = watch('category');

  useEffect(() => {
    setCharCount((watchedNotes || '').length);
  }, [watchedNotes]);

  // Sync type → category for income
  useEffect(() => {
    if (txType === 'income') setValue('category', 'Income');
    else if (watchedCategory === 'Income') setValue('category', '');
  }, [txType]);

  const onSubmit = async (data) => {
    const updated = {
      ...transaction,
      title: data.title.trim(),
      amount: Number(data.amount),
      category: data.category,
      type: txType,
      date: new Date(data.date).toISOString(),
      notes: data.notes?.trim() || '',
      recurring: data.recurring,
    };
    updateTransaction(transaction.id, updated);
    setSaved(true);
    setTimeout(() => {
      onSaved?.();
      onClose();
    }, 900);
  };

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    onDeleted?.();
    onClose();
  };

  const isIncome = txType === 'income';
  const accentColor = isIncome ? '#00ff88' : '#ff2a2a';
  const accentGlow = isIncome ? 'rgba(0,255,136,0.2)' : 'rgba(255,42,42,0.2)';
  const visibleCats =
    txType === 'income'
      ? CATEGORIES.filter((c) => c.id === 'Income')
      : CATEGORIES.filter((c) => c.id !== 'Income');

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="edt-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <motion.div
        className="edt-drawer"
        initial={{ x: '100%', opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Glow edge */}
        <div
          className="edt-drawer__edge"
          style={{
            background: accentColor,
            boxShadow: `0 0 20px ${accentGlow}`,
          }}
        />

        {/* Header */}
        <div className="edt-drawer__header">
          <div className="edt-drawer__header-left">
            <div className="edt-header-eyebrow">
              <span
                className="edt-eyebrow-dot"
                style={{ background: accentColor }}
              />
              EDIT ENTRY
            </div>
            <h2 className="edt-drawer__title">
              {transaction?.title || 'Transaction'}
            </h2>
          </div>
          <div className="edt-drawer__header-right">
            <button
              className="edt-delete-btn"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete transaction"
            >
              <MdDelete size={15} />
            </button>
            <button className="edt-close-btn" onClick={onClose}>
              <MdClose size={16} />
            </button>
          </div>
        </div>

        {/* Glow divider */}
        <div
          className="edt-glow-rule"
          style={{
            background: `linear-gradient(90deg, ${accentColor}, transparent)`,
            boxShadow: `0 0 8px ${accentGlow}`,
          }}
        />

        {/* Form */}
        <form className="edt-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Type toggle */}
          <div className="edt-type-toggle">
            <button
              type="button"
              className={`edt-type-btn ${txType === 'expense' ? 'active' : ''}`}
              style={
                txType === 'expense'
                  ? {
                      '--btn-color': '#ff2a2a',
                      '--btn-glow': 'rgba(255,42,42,0.25)',
                    }
                  : {}
              }
              onClick={() => setTxType('expense')}
            >
              <MdArrowDownward size={14} />
              <span>EXPENSE</span>
            </button>
            <button
              type="button"
              className={`edt-type-btn ${txType === 'income' ? 'active' : ''}`}
              style={
                txType === 'income'
                  ? {
                      '--btn-color': '#00ff88',
                      '--btn-glow': 'rgba(0,255,136,0.25)',
                    }
                  : {}
              }
              onClick={() => setTxType('income')}
            >
              <MdArrowUpward size={14} />
              <span>INCOME</span>
            </button>
          </div>

          {/* Amount */}
          <div className="edt-amount-wrap">
            <span
              className="edt-amount-currency"
              style={{ color: accentColor }}
            >
              ₹
            </span>
            <input
              type="number"
              inputMode="decimal"
              className={`edt-amount-input ${errors.amount ? 'error' : ''}`}
              style={{ '--amount-color': accentColor }}
              placeholder="0"
              {...register('amount')}
            />
          </div>
          {errors.amount && (
            <p className="edt-error-msg">{errors.amount.message}</p>
          )}

          {/* Title */}
          <div className="edt-field">
            <label className="edt-label">
              Title <span className="edt-req">*</span>
            </label>
            <input
              type="text"
              className={`edt-input ${errors.title ? 'error' : ''}`}
              placeholder="Transaction title"
              autoComplete="off"
              {...register('title')}
            />
            {errors.title && (
              <p className="edt-error-msg">{errors.title.message}</p>
            )}
          </div>

          {/* Category grid */}
          <div className="edt-field">
            <label className="edt-label">
              Category <span className="edt-req">*</span>
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <div className="edt-cat-grid">
                  {visibleCats.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = field.value === cat.id;
                    return (
                      <motion.button
                        key={cat.id}
                        type="button"
                        className={`edt-cat-btn ${isActive ? 'active' : ''}`}
                        style={{
                          '--cat-color': cat.color,
                          '--cat-bg': `${cat.color}18`,
                          '--cat-glow': `${cat.color}30`,
                        }}
                        onClick={() => field.onChange(cat.id)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <div
                          className="edt-cat-icon"
                          style={{
                            background: isActive
                              ? `${cat.color}28`
                              : `${cat.color}12`,
                            color: cat.color,
                            boxShadow: isActive
                              ? `0 0 10px ${cat.color}50`
                              : 'none',
                          }}
                        >
                          <Icon size={14} />
                        </div>
                        <span className="edt-cat-label">{cat.id}</span>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            />
            {errors.category && (
              <p className="edt-error-msg">{errors.category.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="edt-field">
            <label className="edt-label">
              Date <span className="edt-req">*</span>
            </label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <MiniDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.date}
                />
              )}
            />
            {errors.date && (
              <p className="edt-error-msg">{errors.date.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="edt-field">
            <label
              className="edt-label"
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <span>
                <MdNotes size={11} style={{ marginRight: 4, opacity: 0.5 }} />
                Notes
              </span>
              <span
                className={`edt-char-count ${charCount > 180 ? 'warn' : ''}`}
              >
                {charCount}/200
              </span>
            </label>
            <textarea
              className="edt-textarea"
              placeholder="Optional context…"
              rows={3}
              {...register('notes')}
            />
          </div>

          {/* Recurring */}
          <div className="edt-field">
            <Controller
              name="recurring"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  className={`edt-recurring-btn ${field.value ? 'active' : ''}`}
                  onClick={() => field.onChange(!field.value)}
                >
                  <div className="edt-recurring-left">
                    <div
                      className={`edt-recurring-icon ${field.value ? 'active' : ''}`}
                    >
                      <MdRepeat size={14} />
                    </div>
                    <div className="edt-recurring-text">
                      <span className="edt-recurring-title">
                        Recurring transaction
                      </span>
                      <span className="edt-recurring-sub">
                        Repeats every month
                      </span>
                    </div>
                  </div>
                  <div
                    className={`edt-toggle-track ${field.value ? 'active' : ''}`}
                  >
                    <motion.div
                      className="edt-toggle-thumb"
                      animate={{ x: field.value ? 18 : 2 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </button>
              )}
            />
          </div>

          {/* Submit */}
          <div className="edt-submit-row">
            <button
              type="submit"
              className="edt-save-btn"
              style={{ '--save-color': accentColor, '--save-glow': accentGlow }}
              disabled={isSubmitting || saved}
            >
              {saved ? (
                <>
                  <MdCheck size={16} /> Saved!
                </>
              ) : isSubmitting ? (
                <span className="edt-spinner" />
              ) : (
                <>
                  <MdCheck size={16} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {/* Delete confirm */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              className="edt-delete-confirm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="edt-delete-confirm__title">
                Delete this transaction?
              </p>
              <p className="edt-delete-confirm__sub">
                This action cannot be undone.
              </p>
              <div className="edt-delete-confirm__actions">
                <button
                  className="edt-delete-confirm__cancel"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="edt-delete-confirm__confirm"
                  onClick={handleDelete}
                >
                  <MdDelete size={13} /> Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
