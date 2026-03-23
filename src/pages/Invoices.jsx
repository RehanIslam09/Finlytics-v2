// ============================================================
// FILE: src/pages/Invoices.jsx
// FinlyticsX — Invoice Tracker (Freelancer Page)
// FIXED: context menus no longer clipped — overflow: visible on cards/cols
// ADDED: animated delete toast with undo support
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, differenceInDays, isPast } from 'date-fns';
import {
  MdAdd,
  MdClose,
  MdCheck,
  MdEdit,
  MdDelete,
  MdDownload,
  MdSend,
  MdWarning,
  MdCheckCircle,
  MdReceiptLong,
  MdBusiness,
  MdCalendarToday,
  MdNotes,
  MdSort,
  MdMoreVert,
  MdPendingActions,
  MdMoneyOff,
  MdDone,
  MdKeyboardArrowDown,
  MdUndo,
} from 'react-icons/md';
import useCurrency from '../hooks/useCurrency';
import './Invoices.css';

// ── Constants ──────────────────────────────────────────────
const CYAN = '#00f5ff';
const AMBER = '#ffaa00';
const ROSE = '#ff4466';
const EMERALD = '#00ff88';

const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    color: '#888899',
    icon: MdNotes,
    bg: 'rgba(136,136,153,0.12)',
    border: 'rgba(136,136,153,0.25)',
  },
  sent: {
    label: 'Sent',
    color: CYAN,
    icon: MdSend,
    bg: 'rgba(0,245,255,0.10)',
    border: 'rgba(0,245,255,0.28)',
  },
  overdue: {
    label: 'Overdue',
    color: ROSE,
    icon: MdWarning,
    bg: 'rgba(255,68,102,0.10)',
    border: 'rgba(255,68,102,0.28)',
  },
  paid: {
    label: 'Paid',
    color: EMERALD,
    icon: MdCheckCircle,
    bg: 'rgba(0,255,136,0.10)',
    border: 'rgba(0,255,136,0.28)',
  },
};

const PIPELINE_STAGES = ['draft', 'sent', 'overdue', 'paid'];
const STORAGE_KEY = 'finlyticsx_invoices';
const TOAST_DURATION = 3200; // ms before toast auto-dismisses

function loadInvoices() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}
function saveInvoices(invoices) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
}

function genInvoiceNumber(invoices) {
  const max = invoices.reduce((m, inv) => {
    const n = parseInt(inv.number?.replace(/\D/g, '') || '0');
    return n > m ? n : m;
  }, 0);
  return `INV-${String(max + 1).padStart(4, '0')}`;
}

// ── Delete Toast ───────────────────────────────────────────
// Renders into document.body via portal so it's never clipped
function DeleteToast({ toast, onUndo, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), TOAST_DURATION);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return createPortal(
    <div className="inv-toast-portal">
      <AnimatePresence>
        <motion.div
          key={toast.id}
          className="inv-toast"
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Countdown progress bar */}
          <div className="inv-toast__progress" key={toast.id + '-bar'} />

          {/* Icon */}
          <div className="inv-toast__icon-wrap">
            <MdDelete size={15} style={{ color: ROSE }} />
          </div>

          {/* Text */}
          <div className="inv-toast__body">
            <span className="inv-toast__title">Invoice deleted</span>
            <span className="inv-toast__sub">
              {toast.number} · {toast.client}
            </span>
          </div>

          {/* Undo */}
          <button className="inv-toast__undo" onClick={() => onUndo(toast.id)}>
            <MdUndo size={12} /> Undo
          </button>

          {/* Close */}
          <button
            className="inv-toast__close"
            onClick={() => onDismiss(toast.id)}
          >
            <MdClose size={13} />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body,
  );
}

// ── Status Badge ───────────────────────────────────────────
function StatusBadge({ status, size = 'md' }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const Icon = cfg.icon;
  return (
    <span
      className={`inv-badge inv-badge--${size}`}
      style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}
    >
      <Icon size={size === 'sm' ? 9 : 11} />
      {cfg.label}
    </span>
  );
}

// ── Summary Strip ──────────────────────────────────────────
function SummaryStrip({ invoices }) {
  const { formatCurrency } = useCurrency();

  const total = invoices.length;
  const totalAmt = invoices.reduce((s, i) => s + i.amount, 0);
  const paid = invoices.filter((i) => i.status === 'paid');
  const paidAmt = paid.reduce((s, i) => s + i.amount, 0);
  const pending = invoices.filter((i) => i.status === 'sent');
  const pendingAmt = pending.reduce((s, i) => s + i.amount, 0);
  const overdue = invoices.filter((i) => i.status === 'overdue');
  const overdueAmt = overdue.reduce((s, i) => s + i.amount, 0);

  const stats = [
    {
      label: 'Total Invoiced',
      value: formatCurrency(totalAmt),
      accent: CYAN,
      icon: MdReceiptLong,
      sub: `${total} invoices`,
    },
    {
      label: 'Collected',
      value: formatCurrency(paidAmt),
      accent: EMERALD,
      icon: MdCheckCircle,
      sub: `${paid.length} paid`,
    },
    {
      label: 'Pending',
      value: formatCurrency(pendingAmt),
      accent: AMBER,
      icon: MdPendingActions,
      sub: `${pending.length} awaiting`,
    },
    {
      label: 'Overdue',
      value: formatCurrency(overdueAmt),
      accent: ROSE,
      icon: MdMoneyOff,
      sub: `${overdue.length} overdue`,
    },
  ];

  return (
    <div className="inv-summary-strip">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          className="inv-stat-card"
          style={{ '--sc-accent': s.accent }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.07,
            duration: 0.38,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="inv-stat-icon">
            <s.icon size={15} />
          </div>
          <div className="inv-stat-body">
            <span className="inv-stat-label">{s.label}</span>
            <span className="inv-stat-value" style={{ color: s.accent }}>
              {s.value}
            </span>
            <span className="inv-stat-sub">{s.sub}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Pipeline View ──────────────────────────────────────────
function PipelineView({ invoices, onEdit, onDelete, onStatusChange }) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="inv-pipeline">
      {PIPELINE_STAGES.map((stage) => {
        const cfg = STATUS_CONFIG[stage];
        const Icon = cfg.icon;
        const items = invoices.filter((i) => i.status === stage);
        const total = items.reduce((s, i) => s + i.amount, 0);
        return (
          <div
            key={stage}
            className="inv-pipeline-col"
            style={{ '--col-accent': cfg.color }}
          >
            <div className="inv-pipeline-col__header">
              <div
                className="inv-pipeline-col__icon-wrap"
                style={{ background: cfg.bg, borderColor: cfg.border }}
              >
                <Icon size={14} style={{ color: cfg.color }} />
              </div>
              <div className="inv-pipeline-col__title-block">
                <span
                  className="inv-pipeline-col__title"
                  style={{ color: cfg.color }}
                >
                  {cfg.label}
                </span>
                <span className="inv-pipeline-col__count">{items.length}</span>
              </div>
              {total > 0 && (
                <span className="inv-pipeline-col__total">
                  {formatCurrency(total)}
                </span>
              )}
            </div>
            <div
              className="inv-pipeline-col__bar"
              style={{
                background: `linear-gradient(90deg,${cfg.color},${cfg.color}60)`,
              }}
            />
            <div className="inv-pipeline-col__cards">
              <AnimatePresence mode="popLayout">
                {items.length === 0 && (
                  <motion.div
                    className="inv-pipeline-col__empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No {cfg.label.toLowerCase()} invoices
                  </motion.div>
                )}
                {items.map((inv, i) => (
                  <PipelineCard
                    key={inv.id}
                    invoice={inv}
                    index={i}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Pipeline Card ──────────────────────────────────────────
function PipelineCard({ invoice, index, onEdit, onDelete, onStatusChange }) {
  const { formatCurrency } = useCurrency();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const cfg = STATUS_CONFIG[invoice.status];
  const daysLeft = invoice.dueDate
    ? differenceInDays(parseISO(invoice.dueDate), new Date())
    : null;
  const isOverdue = invoice.status === 'overdue';
  const isPaid = invoice.status === 'paid';

  useEffect(() => {
    const h = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const nextStatuses = PIPELINE_STAGES.filter((s) => s !== invoice.status);

  return (
    <motion.div
      className={`inv-pipeline-card ${isPaid ? 'paid' : ''} ${isOverdue ? 'overdue' : ''}`}
      style={{ '--card-accent': cfg.color }}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        delay: index * 0.05,
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      layout
    >
      <div
        className="inv-pipeline-card__accent-bar"
        style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}60` }}
      />

      <div className="inv-pipeline-card__header">
        <span className="inv-pipeline-card__number">{invoice.number}</span>

        {/* FIXED: menu wrap is position:relative z-index:100, so menu always shows above sibling cards */}
        <div className="inv-pipeline-card__menu-wrap" ref={menuRef}>
          <button
            className="inv-pipeline-card__menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MdMoreVert size={14} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="inv-context-menu"
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.18 }}
              >
                <button
                  className="inv-context-item"
                  onClick={() => {
                    onEdit(invoice);
                    setMenuOpen(false);
                  }}
                >
                  <MdEdit size={12} /> Edit
                </button>

                {nextStatuses.map((s) => {
                  const sc = STATUS_CONFIG[s];
                  return (
                    <button
                      key={s}
                      className="inv-context-item"
                      style={{ color: sc.color }}
                      onClick={() => {
                        onStatusChange(invoice.id, s);
                        setMenuOpen(false);
                      }}
                    >
                      <sc.icon size={12} /> Mark as {sc.label}
                    </button>
                  );
                })}

                <div className="inv-context-divider" />

                <button
                  className="inv-context-item inv-context-item--danger"
                  onClick={() => {
                    onDelete(invoice);
                    setMenuOpen(false);
                  }}
                >
                  <MdDelete size={12} /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="inv-pipeline-card__client">{invoice.client}</div>

      <div
        className="inv-pipeline-card__amount"
        style={{ color: isPaid ? EMERALD : cfg.color }}
      >
        {formatCurrency(invoice.amount)}
      </div>

      {invoice.description && (
        <div className="inv-pipeline-card__desc">{invoice.description}</div>
      )}

      <div className="inv-pipeline-card__footer">
        {invoice.dueDate && (
          <span
            className={`inv-pipeline-card__due ${isOverdue ? 'overdue' : ''}`}
          >
            <MdCalendarToday size={9} />
            {isPaid
              ? 'Paid'
              : isOverdue
                ? `${Math.abs(daysLeft)}d overdue`
                : daysLeft === 0
                  ? 'Due today'
                  : `${daysLeft}d left`}
          </span>
        )}
        {invoice.issueDate && (
          <span className="inv-pipeline-card__issued">
            {format(parseISO(invoice.issueDate), 'dd MMM')}
          </span>
        )}
      </div>

      {invoice.status === 'sent' && (
        <button
          className="inv-pipeline-card__quick-paid"
          onClick={() => onStatusChange(invoice.id, 'paid')}
        >
          <MdDone size={11} /> Mark Paid
        </button>
      )}
    </motion.div>
  );
}

// ── List View ──────────────────────────────────────────────
function ListView({ invoices, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="inv-list">
      <div className="inv-list__header-row">
        <span>Invoice</span>
        <span>Client</span>
        <span>Amount</span>
        <span>Issue Date</span>
        <span>Due Date</span>
        <span>Status</span>
        <span></span>
      </div>
      <AnimatePresence mode="popLayout">
        {invoices.map((inv, i) => (
          <ListRow
            key={inv.id}
            invoice={inv}
            index={i}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ListRow({ invoice, index, onEdit, onDelete, onStatusChange }) {
  const { formatCurrency } = useCurrency();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const cfg = STATUS_CONFIG[invoice.status];
  const isOverdue = invoice.status === 'overdue';
  const isPaid = invoice.status === 'paid';

  useEffect(() => {
    const h = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <motion.div
      className={`inv-list-row ${isPaid ? 'paid' : ''} ${isOverdue ? 'overdue' : ''}`}
      style={{ '--row-accent': cfg.color }}
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{
        delay: index * 0.04,
        duration: 0.32,
        ease: [0.16, 1, 0.3, 1],
      }}
      layout
    >
      <div className="inv-list-row__accent" />
      <span className="inv-list-row__number">{invoice.number}</span>
      <span className="inv-list-row__client">{invoice.client}</span>
      <span
        className="inv-list-row__amount"
        style={{ color: isPaid ? EMERALD : cfg.color }}
      >
        {formatCurrency(invoice.amount)}
      </span>
      <span className="inv-list-row__date">
        {invoice.issueDate
          ? format(parseISO(invoice.issueDate), 'dd MMM yyyy')
          : '—'}
      </span>
      <span className={`inv-list-row__date ${isOverdue ? 'overdue' : ''}`}>
        {invoice.dueDate
          ? format(parseISO(invoice.dueDate), 'dd MMM yyyy')
          : '—'}
      </span>
      <StatusBadge status={invoice.status} size="sm" />

      <div className="inv-list-row__actions" ref={menuRef}>
        <button
          className="inv-list-row__menu-btn"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <MdMoreVert size={15} />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="inv-context-menu inv-context-menu--right"
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
            >
              <button
                className="inv-context-item"
                onClick={() => {
                  onEdit(invoice);
                  setMenuOpen(false);
                }}
              >
                <MdEdit size={12} /> Edit
              </button>

              {PIPELINE_STAGES.filter((s) => s !== invoice.status).map((s) => {
                const sc = STATUS_CONFIG[s];
                return (
                  <button
                    key={s}
                    className="inv-context-item"
                    style={{ color: sc.color }}
                    onClick={() => {
                      onStatusChange(invoice.id, s);
                      setMenuOpen(false);
                    }}
                  >
                    <sc.icon size={12} /> Mark as {sc.label}
                  </button>
                );
              })}

              <div className="inv-context-divider" />

              <button
                className="inv-context-item inv-context-item--danger"
                onClick={() => {
                  onDelete(invoice);
                  setMenuOpen(false);
                }}
              >
                <MdDelete size={12} /> Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Invoice Modal ──────────────────────────────────────────
function InvoiceModal({ invoice, invoices, onSave, onClose }) {
  const isEdit = !!invoice?.id;
  const [form, setForm] = useState({
    client: invoice?.client || '',
    amount: invoice?.amount || '',
    description: invoice?.description || '',
    issueDate: invoice?.issueDate || format(new Date(), 'yyyy-MM-dd'),
    dueDate: invoice?.dueDate || '',
    status: invoice?.status || 'draft',
    notes: invoice?.notes || '',
  });
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.client.trim()) e.client = 'Client name required';
    if (!form.amount || Number(form.amount) <= 0)
      e.amount = 'Enter a valid amount';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave({
      ...invoice,
      id: invoice?.id || crypto.randomUUID(),
      number: invoice?.number || genInvoiceNumber(invoices),
      client: form.client.trim(),
      amount: Number(form.amount),
      description: form.description.trim(),
      issueDate: form.issueDate || null,
      dueDate: form.dueDate || null,
      status: form.status,
      notes: form.notes.trim(),
      createdAt: invoice?.createdAt || new Date().toISOString(),
    });
    onClose();
  };

  const selectedStatus = STATUS_CONFIG[form.status];

  return (
    <motion.div
      className="inv-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="inv-modal"
        style={{ '--modal-accent': selectedStatus.color }}
        initial={{ scale: 0.88, y: 32, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="inv-modal__glow-top"
          style={{
            background: `linear-gradient(90deg,transparent,${selectedStatus.color}40,transparent)`,
          }}
        />

        <div className="inv-modal__header">
          <div className="inv-modal__title-wrap">
            <div
              className="inv-modal__title-icon"
              style={{
                background: selectedStatus.bg,
                borderColor: selectedStatus.border,
              }}
            >
              <MdReceiptLong
                size={16}
                style={{ color: selectedStatus.color }}
              />
            </div>
            <div>
              <span className="inv-modal__title">
                {isEdit ? 'Edit Invoice' : 'New Invoice'}
              </span>
              {isEdit && (
                <span className="inv-modal__subtitle">{invoice.number}</span>
              )}
            </div>
          </div>
          <button className="inv-modal__close" onClick={onClose}>
            <MdClose size={16} />
          </button>
        </div>

        <div className="inv-modal__body">
          <div className="inv-modal__field">
            <label className="inv-modal__label">
              Client / Company <span className="inv-req">*</span>
            </label>
            <div className="inv-modal__input-wrap">
              <MdBusiness size={14} className="inv-modal__field-icon" />
              <input
                ref={inputRef}
                type="text"
                className={`inv-modal__input inv-modal__input--icon ${errors.client ? 'error' : ''}`}
                placeholder="e.g. Acme Corp, Raj Freelance..."
                value={form.client}
                onChange={(e) => {
                  setForm((f) => ({ ...f, client: e.target.value }));
                  setErrors((er) => ({ ...er, client: '' }));
                }}
              />
            </div>
            {errors.client && (
              <p className="inv-modal__error">{errors.client}</p>
            )}
          </div>

          <div className="inv-modal__field">
            <label className="inv-modal__label">
              Invoice Amount <span className="inv-req">*</span>
            </label>
            <div className="inv-modal__input-wrap">
              <span
                className="inv-modal__prefix"
                style={{ color: selectedStatus.color }}
              >
                ₹
              </span>
              <input
                type="number"
                className={`inv-modal__input inv-modal__input--prefixed ${errors.amount ? 'error' : ''}`}
                placeholder="25000"
                value={form.amount}
                onChange={(e) => {
                  setForm((f) => ({ ...f, amount: e.target.value }));
                  setErrors((er) => ({ ...er, amount: '' }));
                }}
              />
            </div>
            {errors.amount && (
              <p className="inv-modal__error">{errors.amount}</p>
            )}
          </div>

          <div className="inv-modal__field">
            <label className="inv-modal__label">Description</label>
            <input
              type="text"
              className="inv-modal__input"
              placeholder="e.g. Website redesign, 3 months retainer..."
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          <div className="inv-modal__row">
            <div className="inv-modal__field">
              <label className="inv-modal__label">Issue Date</label>
              <input
                type="date"
                className="inv-modal__input"
                value={form.issueDate}
                style={{ colorScheme: 'dark' }}
                onChange={(e) =>
                  setForm((f) => ({ ...f, issueDate: e.target.value }))
                }
              />
            </div>
            <div className="inv-modal__field">
              <label className="inv-modal__label">Due Date</label>
              <input
                type="date"
                className="inv-modal__input"
                value={form.dueDate}
                style={{ colorScheme: 'dark' }}
                min={form.issueDate || undefined}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueDate: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="inv-modal__field">
            <label className="inv-modal__label">Status</label>
            <div className="inv-status-picker">
              {PIPELINE_STAGES.map((s) => {
                const sc = STATUS_CONFIG[s];
                const SIcon = sc.icon;
                const active = form.status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    className={`inv-status-btn ${active ? 'active' : ''}`}
                    style={{
                      '--sb-color': sc.color,
                      '--sb-bg': sc.bg,
                      '--sb-border': sc.border,
                    }}
                    onClick={() => setForm((f) => ({ ...f, status: s }))}
                  >
                    <SIcon size={12} />
                    {sc.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="inv-modal__field">
            <label className="inv-modal__label">
              Notes{' '}
              <span style={{ opacity: 0.4, fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              className="inv-modal__input inv-modal__textarea"
              placeholder="Payment terms, bank details, special instructions..."
              rows={3}
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="inv-modal__footer">
          <button className="inv-modal__btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="inv-modal__btn-save"
            style={{
              background: selectedStatus.color,
              borderColor: selectedStatus.color,
            }}
            onClick={handleSave}
          >
            <MdCheck size={14} /> {isEdit ? 'Save Changes' : 'Create Invoice'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Empty State ────────────────────────────────────────────
function EmptyState({ onAdd }) {
  return (
    <motion.div
      className="inv-empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="inv-empty__icon">
        <MdReceiptLong size={40} style={{ color: CYAN, opacity: 0.6 }} />
      </div>
      <h2 className="inv-empty__title">No invoices yet</h2>
      <p className="inv-empty__sub">
        Track every invoice you send — from draft to paid. Never lose track of
        outstanding payments again.
      </p>
      <button className="inv-empty__cta" onClick={onAdd}>
        <MdAdd size={14} /> Create First Invoice
      </button>
    </motion.div>
  );
}

// ── Export CSV ─────────────────────────────────────────────
function exportCSV(invoices) {
  const rows = [
    [
      'Invoice#',
      'Client',
      'Amount',
      'Status',
      'Issue Date',
      'Due Date',
      'Description',
    ],
    ...invoices.map((inv) => [
      inv.number,
      `"${inv.client}"`,
      inv.amount,
      inv.status,
      inv.issueDate || '',
      inv.dueDate || '',
      `"${inv.description || ''}"`,
    ]),
  ];
  const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], {
    type: 'text/csv',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoices-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main Page ──────────────────────────────────────────────
export default function Invoices() {
  const [invoices, setInvoices] = useState(loadInvoices);
  const [showModal, setShowModal] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);
  const [viewMode, setViewMode] = useState('pipeline');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [sortOpen, setSortOpen] = useState(false);

  // Toast state: { id, invoiceId, number, client, snapshot: Invoice[] }
  const [toast, setToast] = useState(null);

  const sortRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target))
        setSortOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Auto-mark overdue on mount
  useEffect(() => {
    setInvoices((prev) => {
      const updated = prev.map((inv) =>
        inv.status === 'sent' && inv.dueDate && isPast(parseISO(inv.dueDate))
          ? { ...inv, status: 'overdue' }
          : inv,
      );
      saveInvoices(updated);
      return updated;
    });
  }, []);

  const persist = useCallback((updated) => {
    setInvoices(updated);
    saveInvoices(updated);
  }, []);

  const handleSave = (inv) => {
    const existing = invoices.find((i) => i.id === inv.id);
    persist(
      existing
        ? invoices.map((i) => (i.id === inv.id ? inv : i))
        : [inv, ...invoices],
    );
  };

  // Delete: remove + show toast with snapshot for undo
  const handleDelete = useCallback(
    (invoice) => {
      const snapshot = invoices; // capture current list before removal
      const next = invoices.filter((i) => i.id !== invoice.id);
      persist(next);

      // Replace any existing toast (one at a time)
      setToast({
        id: crypto.randomUUID(),
        invoiceId: invoice.id,
        number: invoice.number,
        client: invoice.client,
        snapshot,
      });
    },
    [invoices, persist],
  );

  // Undo: restore the pre-delete snapshot
  const handleUndo = useCallback(
    (toastId) => {
      if (toast?.id !== toastId) return;
      persist(toast.snapshot);
      setToast(null);
    },
    [toast, persist],
  );

  const handleDismissToast = useCallback(
    (toastId) => {
      if (toast?.id === toastId) setToast(null);
    },
    [toast],
  );

  const handleStatusChange = (id, status) =>
    persist(invoices.map((i) => (i.id === id ? { ...i, status } : i)));

  const displayed = invoices
    .filter((i) => filterStatus === 'all' || i.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'date-desc')
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'date-asc')
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

  const SORT_OPTIONS = [
    { value: 'date-desc', label: 'Newest first' },
    { value: 'date-asc', label: 'Oldest first' },
    { value: 'amount-desc', label: 'Highest amount' },
    { value: 'amount-asc', label: 'Lowest amount' },
  ];

  return (
    <div className="inv-page">
      <div className="inv-scanlines" aria-hidden />
      <div className="inv-orb inv-orb--1" />
      <div className="inv-orb inv-orb--2" />

      {/* Delete toast — rendered via portal into document.body */}
      <AnimatePresence>
        {toast && (
          <DeleteToast
            key={toast.id}
            toast={toast}
            onUndo={handleUndo}
            onDismiss={handleDismissToast}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(showModal || editInvoice) && (
          <InvoiceModal
            invoice={editInvoice}
            invoices={invoices}
            onSave={handleSave}
            onClose={() => {
              setShowModal(false);
              setEditInvoice(null);
            }}
          />
        )}
      </AnimatePresence>

      <div className="inv-content">
        <motion.div
          className="inv-header"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
        >
          <div className="inv-header__left">
            <div className="inv-header__eyebrow">
              <span className="inv-eyebrow-dot" /> FREELANCER INTELLIGENCE
            </div>
            <h1 className="inv-header__title">Invoice Tracker</h1>
            <p className="inv-header__sub">
              Every invoice tracked. Every payment chased. Zero revenue lost.
            </p>
          </div>
          <div className="inv-header__actions">
            {invoices.length > 0 && (
              <button
                className="inv-btn-export"
                onClick={() => exportCSV(invoices)}
              >
                <MdDownload size={14} /> Export CSV
              </button>
            )}
            <motion.button
              className="inv-btn-new"
              onClick={() => setShowModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <MdAdd size={16} /> New Invoice
            </motion.button>
          </div>
        </motion.div>

        <div className="inv-glow-rule" />

        {invoices.length === 0 ? (
          <EmptyState onAdd={() => setShowModal(true)} />
        ) : (
          <>
            <SummaryStrip invoices={invoices} />

            <div className="inv-toolbar">
              <div className="inv-toolbar__filters">
                <button
                  className={`inv-filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('all')}
                >
                  All{' '}
                  <span className="inv-filter-count">{invoices.length}</span>
                </button>
                {PIPELINE_STAGES.map((s) => {
                  const cnt = invoices.filter((i) => i.status === s).length;
                  const sc = STATUS_CONFIG[s];
                  return (
                    <button
                      key={s}
                      className={`inv-filter-btn ${filterStatus === s ? 'active' : ''}`}
                      style={{ '--fb-color': sc.color }}
                      onClick={() => setFilterStatus(s)}
                    >
                      {sc.label}
                      {cnt > 0 && (
                        <span className="inv-filter-count">{cnt}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="inv-toolbar__right">
                <div className="inv-sort-wrap" ref={sortRef}>
                  <button
                    className="inv-sort-btn"
                    onClick={() => setSortOpen((v) => !v)}
                  >
                    <MdSort size={13} />
                    {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                    <MdKeyboardArrowDown
                      size={13}
                      className={`inv-chevron ${sortOpen ? 'open' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {sortOpen && (
                      <motion.div
                        className="inv-sort-panel"
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                      >
                        {SORT_OPTIONS.map((o) => (
                          <button
                            key={o.value}
                            className={`inv-sort-item ${sortBy === o.value ? 'active' : ''}`}
                            onClick={() => {
                              setSortBy(o.value);
                              setSortOpen(false);
                            }}
                          >
                            {o.label}
                            {sortBy === o.value && <MdCheck size={11} />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="inv-view-toggle">
                  <button
                    className={`inv-view-btn ${viewMode === 'pipeline' ? 'active' : ''}`}
                    onClick={() => setViewMode('pipeline')}
                    title="Pipeline view"
                  >
                    ⠿
                  </button>
                  <button
                    className={`inv-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List view"
                  >
                    ☰
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {viewMode === 'pipeline' ? (
                <motion.div
                  key="pipeline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <PipelineView
                    invoices={displayed}
                    onEdit={setEditInvoice}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ListView
                    invoices={displayed}
                    onEdit={setEditInvoice}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
