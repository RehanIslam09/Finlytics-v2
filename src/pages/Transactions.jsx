// ============================================================
// FILE: src/pages/Transactions.jsx
// FinlyticsX — Transactions Intelligence Page
// UPDATED: date range filter added (PRD Feature 4)
// ============================================================

import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdSort,
  MdGridView,
  MdViewList,
  MdDelete,
  MdEdit,
  MdArrowUpward,
  MdArrowDownward,
  MdRepeat,
  MdRestaurant,
  MdDirectionsCar,
  MdHome,
  MdShoppingBag,
  MdMovie,
  MdFitnessCenter,
  MdElectricalServices,
  MdSubscriptions,
  MdAccountBalanceWallet,
  MdKeyboardArrowDown,
  MdClose,
  MdDownload,
  MdCalendarToday,
  MdTrendingUp,
  MdTrendingDown,
  MdMoreVert,
  MdCheckCircle,
  MdSwapVert,
  MdDateRange,
} from 'react-icons/md';
import {
  format,
  parseISO,
  isThisMonth,
  isThisWeek,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { useFinance } from '../context/FinanceContext';
import useDebounce from '../hooks/useDebounce';
import useToast from '../hooks/useToast';
import EditTransactionDrawer from '../components/EditTransactionDrawer/EditTransactionDrawer';
import ToastNotification from '../components/ToastNotification/ToastNotification';
import './Transactions.css';

const CATEGORY_CONFIG = {
  Food: { icon: MdRestaurant, color: '#ff6b35', glow: 'rgba(255,107,53,0.3)' },
  Travel: {
    icon: MdDirectionsCar,
    color: '#00d4ff',
    glow: 'rgba(0,212,255,0.3)',
  },
  Rent: { icon: MdHome, color: '#8877ff', glow: 'rgba(136,119,255,0.3)' },
  Shopping: {
    icon: MdShoppingBag,
    color: '#ff2a6d',
    glow: 'rgba(255,42,109,0.3)',
  },
  Entertainment: {
    icon: MdMovie,
    color: '#bf5af2',
    glow: 'rgba(191,90,242,0.3)',
  },
  Health: {
    icon: MdFitnessCenter,
    color: '#30d158',
    glow: 'rgba(48,209,88,0.3)',
  },
  Utilities: {
    icon: MdElectricalServices,
    color: '#ffd60a',
    glow: 'rgba(255,214,10,0.3)',
  },
  Subscriptions: {
    icon: MdSubscriptions,
    color: '#ff9f0a',
    glow: 'rgba(255,159,10,0.3)',
  },
  Income: {
    icon: MdAccountBalanceWallet,
    color: '#00ff88',
    glow: 'rgba(0,255,136,0.3)',
  },
};

const CATEGORIES = [
  'All',
  ...Object.keys(CATEGORY_CONFIG).filter((c) => c !== 'Income'),
];
const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest first' },
  { value: 'date-asc', label: 'Oldest first' },
  { value: 'amount-desc', label: 'Highest amount' },
  { value: 'amount-asc', label: 'Lowest amount' },
  { value: 'title-asc', label: 'A → Z' },
];

// Quick date range presets
const DATE_PRESETS = [
  {
    label: 'This week',
    getDates: () => {
      const now = new Date();
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      return {
        from: format(start, 'yyyy-MM-dd'),
        to: format(now, 'yyyy-MM-dd'),
      };
    },
  },
  {
    label: 'This month',
    getDates: () => {
      const now = new Date();
      return {
        from: format(
          new Date(now.getFullYear(), now.getMonth(), 1),
          'yyyy-MM-dd',
        ),
        to: format(now, 'yyyy-MM-dd'),
      };
    },
  },
  {
    label: 'Last month',
    getDates: () => {
      const now = new Date();
      const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const last = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        from: format(first, 'yyyy-MM-dd'),
        to: format(last, 'yyyy-MM-dd'),
      };
    },
  },
  {
    label: 'Last 3 months',
    getDates: () => {
      const now = new Date();
      const start = new Date(now);
      start.setMonth(now.getMonth() - 3);
      return {
        from: format(start, 'yyyy-MM-dd'),
        to: format(now, 'yyyy-MM-dd'),
      };
    },
  },
];

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.035, duration: 0.32, ease: [0.16, 1, 0.3, 1] },
  }),
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

const panelVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.16 } },
};

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

// ── Summary Strip ──────────────────────────────────────────
function SummaryStrip({ transactions }) {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);
  const netFlow = totalIncome - totalExpenses;
  const thisMonth = transactions.filter((t) => isThisMonth(parseISO(t.date)));
  const thisWeek = transactions.filter((t) => isThisWeek(parseISO(t.date)));
  const animIncome = useCountUp(Math.round(totalIncome));
  const animExpenses = useCountUp(Math.round(totalExpenses));
  const animCount = useCountUp(transactions.length);

  const stats = [
    {
      label: 'Total inflow',
      value: `₹${animIncome.toLocaleString('en-IN')}`,
      accent: 'var(--accent-green)',
      icon: MdTrendingUp,
      sub: `${thisMonth.filter((t) => t.type === 'income').length} this month`,
    },
    {
      label: 'Total outflow',
      value: `₹${animExpenses.toLocaleString('en-IN')}`,
      accent: 'var(--accent-red)',
      icon: MdTrendingDown,
      sub: `${thisMonth.filter((t) => t.type === 'expense').length} this month`,
    },
    {
      label: 'Net flow',
      value: `₹${Math.abs(netFlow).toLocaleString('en-IN')}`,
      accent: netFlow >= 0 ? 'var(--accent-cyan)' : 'var(--accent-red)',
      icon: MdSwapVert,
      sub: netFlow >= 0 ? 'surplus' : 'deficit',
    },
    {
      label: 'Records',
      value: animCount,
      accent: 'var(--accent-purple)',
      icon: MdGridView,
      sub: `${thisWeek.length} this week`,
    },
  ];

  return (
    <div className="tx-summary-strip">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          className="tx-stat-card"
          style={{ '--card-accent': s.accent }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.07,
            duration: 0.38,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="tx-stat-icon-wrap">
            <s.icon size={15} />
          </div>
          <div className="tx-stat-body">
            <span className="tx-stat-label">{s.label}</span>
            <span className="tx-stat-value" style={{ color: s.accent }}>
              {s.value}
            </span>
            <span className="tx-stat-sub">{s.sub}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================
// REPLACE the DateRangePicker component in Transactions.jsx
// Full custom calendar — no native browser input at all
// ============================================================

function DateRangePicker({ dateFrom, dateTo, setDateFrom, setDateTo }) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [hovering, setHovering] = useState(null); // iso string being hovered
  const ref = useRef(null);
  const hasRange = dateFrom || dateTo;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const clearRange = (e) => {
    e.stopPropagation();
    setDateFrom('');
    setDateTo('');
  };

  const applyPreset = (preset) => {
    const { from, to } = preset.getDates();
    setDateFrom(from);
    setDateTo(to);
    setOpen(false);
  };

  // Calendar grid helpers
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

  const toISO = (d) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const isSelected = (d) => {
    if (!d) return false;
    const iso = toISO(d);
    return iso === dateFrom || iso === dateTo;
  };

  const isInRange = (d) => {
    if (!d || !dateFrom) return false;
    const iso = toISO(d);
    const end = dateTo || hovering;
    if (!end) return false;
    const from = dateFrom < end ? dateFrom : end;
    const to = dateFrom < end ? end : dateFrom;
    return iso > from && iso < to;
  };

  const isToday = (d) => {
    if (!d) return false;
    const t = new Date();
    return (
      t.getFullYear() === year && t.getMonth() === month && t.getDate() === d
    );
  };

  const handleDayClick = (d) => {
    if (!d) return;
    const iso = toISO(d);
    if (!dateFrom || (dateFrom && dateTo)) {
      // Start fresh selection
      setDateFrom(iso);
      setDateTo('');
    } else {
      // Second click — set end date
      if (iso < dateFrom) {
        setDateTo(dateFrom);
        setDateFrom(iso);
      } else {
        setDateTo(iso);
      }
    }
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const selectionComplete = dateFrom && dateTo;

  return (
    <div
      className="tx-daterange-wrap"
      ref={ref}
      style={{ position: 'relative', isolation: 'isolate', zIndex: 48 }}
    >
      {/* Trigger button */}
      <button
        className={`tx-dropdown-btn tx-daterange-btn ${hasRange ? 'active' : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        <MdDateRange size={14} />
        <span>
          {dateFrom && dateTo
            ? `${format(new Date(dateFrom), 'dd MMM')} – ${format(new Date(dateTo), 'dd MMM')}`
            : dateFrom
              ? `From ${format(new Date(dateFrom), 'dd MMM')}`
              : 'Date range'}
        </span>
        {hasRange ? (
          <button className="tx-daterange-clear" onClick={clearRange}>
            <MdClose size={11} />
          </button>
        ) : (
          <MdKeyboardArrowDown
            size={14}
            className={`tx-chevron ${open ? 'open' : ''}`}
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="tx-daterange-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Preset buttons */}
            <div className="tx-daterange-presets">
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  className="tx-daterange-preset"
                  onClick={() => applyPreset(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="tx-daterange-divider">or pick custom range</div>

            {/* Calendar */}
            <div className="tx-cal">
              {/* Month nav */}
              <div className="tx-cal__header">
                <button className="tx-cal__nav" onClick={prevMonth}>
                  ‹
                </button>
                <span className="tx-cal__month">
                  {MONTHS[month]} {year}
                </span>
                <button className="tx-cal__nav" onClick={nextMonth}>
                  ›
                </button>
              </div>

              {/* Day headers */}
              <div className="tx-cal__days-header">
                {DAYS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>

              {/* Day grid */}
              <div className="tx-cal__grid">
                {cells.map((d, i) => {
                  const selected = isSelected(d);
                  const inRange = isInRange(d);
                  const today = isToday(d);
                  const isFrom = d && toISO(d) === dateFrom;
                  const isTo = d && toISO(d) === dateTo;
                  return (
                    <button
                      key={i}
                      disabled={!d}
                      className={[
                        'tx-cal__day',
                        !d ? 'empty' : '',
                        selected ? 'selected' : '',
                        inRange ? 'in-range' : '',
                        today && !selected ? 'today' : '',
                        isFrom ? 'range-start' : '',
                        isTo ? 'range-end' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => handleDayClick(d)}
                      onMouseEnter={() => d && setHovering(toISO(d))}
                      onMouseLeave={() => setHovering(null)}
                    >
                      {d || ''}
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="tx-cal__footer">
                {!dateFrom && !dateTo && (
                  <span className="tx-cal__hint">
                    Click to select start date
                  </span>
                )}
                {dateFrom && !dateTo && (
                  <span className="tx-cal__hint tx-cal__hint--active">
                    Now pick end date
                  </span>
                )}
                {selectionComplete && (
                  <span className="tx-cal__hint tx-cal__hint--done">
                    {format(new Date(dateFrom), 'dd MMM')} →{' '}
                    {format(new Date(dateTo), 'dd MMM')}
                  </span>
                )}
                <button
                  className="tx-cal__today-btn"
                  onClick={() => setViewDate(new Date())}
                >
                  Today
                </button>
              </div>
            </div>

            {/* Apply / Clear */}
            <div className="tx-daterange-actions">
              {hasRange && (
                <button
                  className="tx-daterange-clear-btn"
                  onClick={() => {
                    setDateFrom('');
                    setDateTo('');
                  }}
                >
                  Clear
                </button>
              )}
              <button
                className="tx-daterange-apply"
                style={{ flex: 1 }}
                onClick={() => setOpen(false)}
              >
                {selectionComplete ? 'Apply range' : 'Close'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Filter Bar ─────────────────────────────────────────────
function FilterBar({
  search,
  setSearch,
  category,
  setCategory,
  type,
  setType,
  sort,
  setSort,
  viewMode,
  setViewMode,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  totalShown,
  totalAll,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const sortRef = useRef(null);
  const categoryRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target))
        setSortOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target))
        setCategoryOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeFilters = [
    category !== 'All' && {
      label: category,
      onRemove: () => setCategory('All'),
    },
    type !== 'all' && { label: type, onRemove: () => setType('all') },
    (dateFrom || dateTo) && {
      label:
        dateFrom && dateTo
          ? `${format(new Date(dateFrom), 'dd MMM')}–${format(new Date(dateTo), 'dd MMM')}`
          : dateFrom
            ? `From ${format(new Date(dateFrom), 'dd MMM')}`
            : `Until ${format(new Date(dateTo), 'dd MMM')}`,
      onRemove: () => {
        setDateFrom('');
        setDateTo('');
      },
    },
  ].filter(Boolean);

  return (
    <div className="tx-filter-bar">
      {/* Search */}
      <div className="tx-search-wrap">
        <MdSearch className="tx-search-icon" size={16} />
        <input
          type="text"
          className="tx-search-input"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="tx-search-clear" onClick={() => setSearch('')}>
            <MdClose size={13} />
          </button>
        )}
      </div>

      {/* Type toggle */}
      <div className="tx-type-toggle">
        {['all', 'income', 'expense'].map((t) => (
          <button
            key={t}
            className={`tx-type-btn ${type === t ? 'active' : ''}`}
            onClick={() => setType(t)}
          >
            {t === 'all' ? 'All' : t === 'income' ? '↑ Income' : '↓ Expense'}
          </button>
        ))}
      </div>

      {/* Category dropdown */}
      <div
        className="tx-dropdown-wrap"
        style={{ isolation: 'isolate', position: 'relative', zIndex: 50 }}
        ref={categoryRef}
      >
        <button
          className="tx-dropdown-btn"
          onClick={() => {
            setCategoryOpen((v) => !v);
            setSortOpen(false);
          }}
        >
          <MdFilterList size={14} />
          <span>{category === 'All' ? 'Category' : category}</span>
          <MdKeyboardArrowDown
            size={14}
            className={`tx-chevron ${categoryOpen ? 'open' : ''}`}
          />
        </button>
        <AnimatePresence>
          {categoryOpen && (
            <motion.div
              className="tx-dropdown-panel"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`tx-dropdown-item ${category === c ? 'active' : ''}`}
                  onClick={() => {
                    setCategory(c);
                    setCategoryOpen(false);
                  }}
                >
                  {c !== 'All' &&
                    (() => {
                      const cfg = CATEGORY_CONFIG[c];
                      const Icon = cfg.icon;
                      return (
                        <span
                          className="tx-dropdown-dot"
                          style={{ color: cfg.color }}
                        >
                          <Icon size={12} />
                        </span>
                      );
                    })()}
                  {c}
                  {category === c && (
                    <MdCheckCircle size={12} className="tx-dropdown-check" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Date range picker — NEW */}
      <DateRangePicker
        dateFrom={dateFrom}
        dateTo={dateTo}
        setDateFrom={setDateFrom}
        setDateTo={setDateTo}
      />

      {/* Sort dropdown */}
      <div
        className="tx-dropdown-wrap"
        style={{ isolation: 'isolate', position: 'relative', zIndex: 49 }}
        ref={sortRef}
      >
        <button
          className="tx-dropdown-btn"
          onClick={() => {
            setSortOpen((v) => !v);
            setCategoryOpen(false);
          }}
        >
          <MdSort size={14} />
          <span>
            {SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Sort'}
          </span>
          <MdKeyboardArrowDown
            size={14}
            className={`tx-chevron ${sortOpen ? 'open' : ''}`}
          />
        </button>
        <AnimatePresence>
          {sortOpen && (
            <motion.div
              className="tx-dropdown-panel tx-dropdown-panel--right"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  className={`tx-dropdown-item ${sort === o.value ? 'active' : ''}`}
                  onClick={() => {
                    setSort(o.value);
                    setSortOpen(false);
                  }}
                >
                  {o.label}
                  {sort === o.value && (
                    <MdCheckCircle size={12} className="tx-dropdown-check" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* View toggle */}
      <div className="tx-view-toggle">
        <button
          className={`tx-view-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
        >
          <MdViewList size={16} />
        </button>
        <button
          className={`tx-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => setViewMode('grid')}
        >
          <MdGridView size={16} />
        </button>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="tx-active-filters">
          {activeFilters.map((f) => (
            <span key={f.label} className="tx-filter-chip">
              {f.label}
              <button onClick={f.onRemove}>
                <MdClose size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      <span className="tx-results-count">
        {totalShown} <span>/ {totalAll}</span>
      </span>
    </div>
  );
}

// ── Transaction Row (unchanged) ────────────────────────────
function TransactionRow({ transaction, index, onDelete, onEdit, viewMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const cfg = CATEGORY_CONFIG[transaction.category] || CATEGORY_CONFIG['Food'];
  const Icon = cfg.icon;
  const isIncome = transaction.type === 'income';

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (viewMode === 'grid') {
    return (
      <motion.div
        className="tx-grid-card"
        style={{ '--row-accent': cfg.color, '--row-glow': cfg.glow }}
        variants={rowVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        custom={index}
        layout
      >
        <div className="tx-grid-card__top">
          <div
            className="tx-grid-card__icon"
            style={{ background: `${cfg.color}18`, color: cfg.color }}
          >
            <Icon size={18} />
          </div>
          <div
            className="tx-grid-card__amount"
            style={{
              color: isIncome ? 'var(--accent-green)' : 'var(--accent-red)',
            }}
          >
            {isIncome ? '+' : '−'}₹{transaction.amount.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="tx-grid-card__title">{transaction.title}</div>
        <div className="tx-grid-card__meta">
          <span
            className="tx-cat-badge"
            style={{ '--b-color': cfg.color, '--b-bg': `${cfg.color}18` }}
          >
            {transaction.category}
          </span>
          {transaction.recurring && (
            <span className="tx-rec-badge">
              <MdRepeat size={9} /> REC
            </span>
          )}
        </div>
        <div className="tx-grid-card__footer">
          <span className="tx-date">
            {format(parseISO(transaction.date), 'dd MMM yyyy')}
          </span>
          <div className="tx-row-actions">
            <button
              className="tx-action-btn tx-action-btn--edit"
              onClick={() => onEdit(transaction)}
            >
              <MdEdit size={13} />
            </button>
            <button
              className="tx-action-btn tx-action-btn--delete"
              onClick={() => onDelete(transaction)}
            >
              <MdDelete size={13} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`tx-row ${isIncome ? 'tx-row--income' : 'tx-row--expense'}`}
      style={{ '--row-accent': cfg.color, '--row-glow': cfg.glow }}
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      layout
    >
      <div
        className="tx-row__icon"
        style={{
          background: `${cfg.color}15`,
          color: cfg.color,
          boxShadow: `0 0 12px ${cfg.glow}`,
        }}
      >
        <Icon size={16} />
      </div>
      <div className="tx-row__body">
        <span className="tx-row__title">{transaction.title}</span>
        {transaction.notes && (
          <span className="tx-row__notes">{transaction.notes}</span>
        )}
      </div>
      <div className="tx-row__category">
        <span
          className="tx-cat-badge"
          style={{ '--b-color': cfg.color, '--b-bg': `${cfg.color}15` }}
        >
          {transaction.category}
        </span>
        {transaction.recurring && (
          <span className="tx-rec-badge">
            <MdRepeat size={9} /> REC
          </span>
        )}
      </div>
      <div className="tx-row__date">
        <MdCalendarToday size={10} style={{ opacity: 0.4 }} />
        <span>{format(parseISO(transaction.date), 'dd MMM yyyy')}</span>
      </div>
      <div
        className="tx-row__amount"
        style={{
          color: isIncome ? 'var(--accent-green)' : 'var(--accent-red)',
        }}
      >
        <span className="tx-amount-sign">
          {isIncome ? (
            <MdArrowUpward size={12} />
          ) : (
            <MdArrowDownward size={12} />
          )}
        </span>
        <span className="tx-amount-value">
          ₹{transaction.amount.toLocaleString('en-IN')}
        </span>
      </div>
      <div className="tx-row__actions" ref={menuRef}>
        <button className="tx-menu-btn" onClick={() => setMenuOpen((v) => !v)}>
          <MdMoreVert size={16} />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="tx-context-menu"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button
                className="tx-context-item"
                onClick={() => {
                  onEdit(transaction);
                  setMenuOpen(false);
                }}
              >
                <MdEdit size={13} /> Edit
              </button>
              <button
                className="tx-context-item tx-context-item--danger"
                onClick={() => {
                  onDelete(transaction);
                  setMenuOpen(false);
                }}
              >
                <MdDelete size={13} /> Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============================================================
// REPLACE GroupedTransactions in Transactions.jsx
// ============================================================

function GroupedTransactions({ grouped, onDelete, onEdit, viewMode }) {
  return (
    <div className="tx-groups">
      <AnimatePresence mode="popLayout">
        {Object.entries(grouped).map(([monthKey, items]) => {
          const inc = items
            .filter((t) => t.type === 'income')
            .reduce((s, t) => s + t.amount, 0);
          const exp = items
            .filter((t) => t.type === 'expense')
            .reduce((s, t) => s + t.amount, 0);
          const net = inc - exp;
          return (
            <motion.div
              key={monthKey}
              className="tx-group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* ── Month header ── */}
              <div className="tx-group-header">
                {/* Left accent bar */}
                <div className="tx-group-bar" />

                {/* Center block */}
                <div className="tx-group-header__center">
                  <span className="tx-group-title">{monthKey}</span>
                  <div className="tx-group-totals">
                    <span className="tx-group-income">
                      +₹{inc.toLocaleString('en-IN')}
                    </span>
                    <span className="tx-group-sep">·</span>
                    <span className="tx-group-expense">
                      −₹{exp.toLocaleString('en-IN')}
                    </span>
                    <span className="tx-group-sep">·</span>
                    <span
                      className="tx-group-net"
                      style={{
                        color:
                          net >= 0
                            ? 'var(--accent-green)'
                            : 'var(--accent-red)',
                      }}
                    >
                      {net >= 0 ? '+' : ''}₹
                      {Math.abs(net).toLocaleString('en-IN')} net
                    </span>
                  </div>
                </div>

                {/* Right: count badge */}
                <span className="tx-group-count">{items.length}</span>
              </div>

              <div
                className={
                  viewMode === 'grid' ? 'tx-grid-layout' : 'tx-list-layout'
                }
              >
                <AnimatePresence mode="popLayout">
                  {items.map((t, i) => (
                    <TransactionRow
                      key={t.id}
                      transaction={t}
                      index={i}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      viewMode={viewMode}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ hasFilters }) {
  return (
    <motion.div
      className="tx-empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="tx-empty__glyph">◈</div>
      <p className="tx-empty__title">
        {hasFilters ? 'No results found' : 'No transactions yet'}
      </p>
      <p className="tx-empty__sub">
        {hasFilters
          ? 'Try adjusting your search or filter criteria'
          : 'Start recording your income and expenses'}
      </p>
      {!hasFilters && (
        <Link to="/transactions/new" className="tx-empty__cta">
          <MdAdd size={14} /> Add first transaction
        </Link>
      )}
    </motion.div>
  );
}

// ── MAIN ───────────────────────────────────────────────────
export default function Transactions() {
  const { transactions, deleteTransaction } = useFinance();
  const { toast, showToast, hideToast } = useToast();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('all');
  const [sort, setSort] = useState('date-desc');
  const [viewMode, setViewMode] = useState('list');
  const [dateFrom, setDateFrom] = useState(''); // NEW — date range from
  const [dateTo, setDateTo] = useState(''); // NEW — date range to
  const [editingTransaction, setEditingTransaction] = useState(null);

  const debouncedSearch = useDebounce(search, 260);

  const filtered = useMemo(() => {
    let list = [...transactions];

    // Search
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.notes && t.notes.toLowerCase().includes(q)),
      );
    }

    // Category
    if (category !== 'All') list = list.filter((t) => t.category === category);

    // Type
    if (type !== 'all') list = list.filter((t) => t.type === type);

    // Date range — NEW
    if (dateFrom) {
      const from = startOfDay(new Date(dateFrom));
      list = list.filter((t) => new Date(t.date) >= from);
    }
    if (dateTo) {
      const to = endOfDay(new Date(dateTo));
      list = list.filter((t) => new Date(t.date) <= to);
    }

    // Sort
    list.sort((a, b) => {
      switch (sort) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    return list;
  }, [transactions, debouncedSearch, category, type, sort, dateFrom, dateTo]);

  const grouped = useMemo(() => {
    return filtered.reduce((acc, t) => {
      const key = format(new Date(t.date), 'MMMM yyyy');
      if (!acc[key]) acc[key] = [];
      acc[key].push(t);
      return acc;
    }, {});
  }, [filtered]);

  const hasFilters =
    debouncedSearch.trim() ||
    category !== 'All' ||
    type !== 'all' ||
    dateFrom ||
    dateTo;

  const handleDelete = (transaction) => {
    deleteTransaction(transaction.id);
    showToast(`"${transaction.title}" deleted`, 'error');
  };

  const handleExport = () => {
    const rows = [
      ['Date', 'Title', 'Category', 'Type', 'Amount', 'Recurring', 'Notes'],
      ...filtered.map((t) => [
        format(parseISO(t.date), 'dd/MM/yyyy'),
        `"${t.title}"`,
        t.category,
        t.type,
        t.amount,
        t.recurring ? 'Yes' : 'No',
        `"${t.notes || ''}"`,
      ]),
    ];
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], {
      type: 'text/csv',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finlyticsx-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${filtered.length} transactions`, 'export');
  };

  return (
    <>
      <div className="tx-page">
        <div className="tx-page__scanlines" aria-hidden />

        <div className="tx-header">
          <div className="tx-header__left">
            <motion.div
              className="tx-header__eyebrow"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="tx-eyebrow-dot" /> INTELLIGENCE LEDGER
            </motion.div>
            <motion.h1
              className="tx-header__title"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.06,
                duration: 0.38,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              Transactions
            </motion.h1>
            <motion.p
              className="tx-header__subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.4 }}
            >
              Every rupee, tracked. Every pattern, surfaced.
            </motion.p>
          </div>
          <motion.div
            className="tx-header__actions"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
          >
            <button className="tx-btn-export" onClick={handleExport}>
              <MdDownload size={14} /> Export
            </button>
            <Link to="/transactions/new" className="tx-btn-add">
              <MdAdd size={16} /> Add Transaction
            </Link>
          </motion.div>
        </div>

        <div className="tx-glow-rule" />
        <SummaryStrip transactions={transactions} />
        <FilterBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          type={type}
          setType={setType}
          sort={sort}
          setSort={setSort}
          viewMode={viewMode}
          setViewMode={setViewMode}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          totalShown={filtered.length}
          totalAll={transactions.length}
        />

        <div className="tx-content">
          {filtered.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <GroupedTransactions
              grouped={grouped}
              onDelete={handleDelete}
              onEdit={setEditingTransaction}
              viewMode={viewMode}
            />
          )}
        </div>
      </div>

      <AnimatePresence>
        {editingTransaction && (
          <EditTransactionDrawer
            transaction={editingTransaction}
            onClose={() => setEditingTransaction(null)}
            onDeleted={() => showToast('Transaction deleted', 'error')}
            onSaved={() => showToast('Changes saved', 'success')}
          />
        )}
      </AnimatePresence>

      <ToastNotification
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
    </>
  );
}
