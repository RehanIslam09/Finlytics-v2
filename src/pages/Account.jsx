// ============================================================
// FILE: src/pages/Account.jsx
// FinlyticsX — Account Settings
// Clerk-powered · CIA terminal aesthetic · amber/gold identity
// ============================================================

import { useState, useRef } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdPerson,
  MdLock,
  MdLogout,
  MdDelete,
  MdEdit,
  MdCheck,
  MdClose,
  MdWarning,
  MdShield,
  MdAccountCircle,
  MdAlternateEmail,
  MdBadge,
  MdCalendarToday,
  MdFingerprint,
  MdSecurity,
  MdKey,
  MdVerified,
} from 'react-icons/md';
import { FiChevronRight } from 'react-icons/fi';
import './Account.css';

// ─── Editable field ───────────────────────────────────────────────────────────
function EditableField({
  label,
  value,
  icon: Icon,
  onSave,
  type = 'text',
  readonly = false,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const startEdit = () => {
    if (readonly) return;
    setDraft(value || '');
    setError('');
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const cancel = () => {
    setEditing(false);
    setError('');
    setDraft(value || '');
  };

  const save = async () => {
    if (draft === value) {
      cancel();
      return;
    }
    if (!draft.trim()) {
      setError('Cannot be empty');
      return;
    }
    setSaving(true);
    try {
      await onSave(draft.trim());
      setEditing(false);
      setError('');
    } catch (err) {
      setError(err.errors?.[0]?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`acc-field ${editing ? 'editing' : ''} ${readonly ? 'readonly' : ''}`}
    >
      <div className="acc-field__icon">
        <Icon size={14} />
      </div>
      <div className="acc-field__body">
        <span className="acc-field__label">{label}</span>
        {editing ? (
          <input
            ref={inputRef}
            type={type}
            className="acc-field__input"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save();
              if (e.key === 'Escape') cancel();
            }}
          />
        ) : (
          <span className="acc-field__value">{value || '—'}</span>
        )}
        {error && <span className="acc-field__error">{error}</span>}
      </div>
      <div className="acc-field__actions">
        {editing ? (
          <>
            <button
              className="acc-field__btn acc-field__btn--save"
              onClick={save}
              disabled={saving}
              title="Save"
            >
              {saving ? (
                <span className="acc-spinner" />
              ) : (
                <MdCheck size={14} />
              )}
            </button>
            <button
              className="acc-field__btn acc-field__btn--cancel"
              onClick={cancel}
              title="Cancel"
            >
              <MdClose size={14} />
            </button>
          </>
        ) : (
          !readonly && (
            <button
              className="acc-field__btn acc-field__btn--edit"
              onClick={startEdit}
              title="Edit"
            >
              <MdEdit size={13} />
            </button>
          )
        )}
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ eyebrow, title, accent = '#ffaa00', children, index = 0 }) {
  return (
    <motion.div
      className="acc-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.1 + index * 0.08,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="acc-section__header">
        <div
          className="acc-section__bar"
          style={{ background: accent, boxShadow: `0 0 8px ${accent}80` }}
        />
        <div>
          <p className="acc-section__eyebrow" style={{ color: accent }}>
            {eyebrow}
          </p>
          <h2 className="acc-section__title">{title}</h2>
        </div>
      </div>
      <div className="acc-section__body">{children}</div>
    </motion.div>
  );
}

// ─── Action row ───────────────────────────────────────────────────────────────
function ActionRow({
  icon: Icon,
  label,
  sub,
  accent,
  onClick,
  danger = false,
}) {
  return (
    <button
      className={`acc-action-row ${danger ? 'danger' : ''}`}
      style={{ '--row-accent': accent }}
      onClick={onClick}
    >
      <div
        className="acc-action-row__icon"
        style={{ background: `${accent}15`, color: accent }}
      >
        <Icon size={15} />
      </div>
      <div className="acc-action-row__body">
        <span className="acc-action-row__label">{label}</span>
        {sub && <span className="acc-action-row__sub">{sub}</span>}
      </div>
      <FiChevronRight size={14} className="acc-action-row__arrow" />
    </button>
  );
}

// ─── Confirm modal ────────────────────────────────────────────────────────────
function ConfirmModal({
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,
  danger = false,
}) {
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="acc-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="acc-modal"
        initial={{ scale: 0.88, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="acc-modal__icon-wrap">
          <MdWarning
            size={22}
            style={{ color: danger ? '#ff4444' : '#ffaa00' }}
          />
        </div>
        <h3 className="acc-modal__title">{title}</h3>
        <p className="acc-modal__message">{message}</p>
        <div className="acc-modal__actions">
          <button className="acc-modal__cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`acc-modal__confirm ${danger ? 'danger' : ''}`}
            onClick={handle}
            disabled={loading}
          >
            {loading ? <span className="acc-spinner" /> : confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Account() {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const navigate = useNavigate();

  const [showSignOut, setShowSignOut] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  if (!user) return null;

  // Derived user info
  const fullName = user.fullName || '';
  const username = user.username || '';
  const email = user.primaryEmailAddress?.emailAddress || '';
  const createdAt = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';
  const initials = (fullName || username || email || 'FX')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const isVerified =
    user.primaryEmailAddress?.verification?.status === 'verified';

  // Update handlers
  const updateFirstName = async (val) => {
    await user.update({ firstName: val });
    showToast('First name updated');
  };

  const updateLastName = async (val) => {
    await user.update({ lastName: val });
    showToast('Last name updated');
  };

  const updateUsername = async (val) => {
    await user.update({ username: val });
    showToast('Username updated');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    await user.delete();
    navigate('/');
  };

  return (
    <div className="acc-page">
      <div className="acc-scanlines" aria-hidden />
      <div className="acc-orb acc-orb--1" />
      <div className="acc-orb acc-orb--2" />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`acc-toast acc-toast--${toast.type}`}
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <MdCheck size={14} /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showSignOut && (
          <ConfirmModal
            title="Sign out"
            message="You'll be returned to the landing page and will need to sign in again to access your data."
            confirmLabel="Sign out"
            onConfirm={handleSignOut}
            onClose={() => setShowSignOut(false)}
          />
        )}
        {showDelete && (
          <ConfirmModal
            title="Delete account"
            message="This permanently deletes your account and all associated data. This action cannot be undone."
            confirmLabel="Delete permanently"
            onConfirm={handleDeleteAccount}
            onClose={() => setShowDelete(false)}
            danger
          />
        )}
      </AnimatePresence>

      <div className="acc-content">
        {/* ── Page header ─────────────────────────────────────── */}
        <motion.div
          className="acc-header"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
        >
          <div className="acc-header__left">
            <div className="acc-header__eyebrow">
              <span className="acc-eyebrow-dot" /> ACCOUNT SETTINGS
            </div>
            <h1 className="acc-header__title">Your Profile</h1>
            <p className="acc-header__sub">
              Manage identity, security, and preferences
            </p>
          </div>
        </motion.div>

        <div className="acc-glow-rule" />

        {/* ── Identity card ────────────────────────────────────── */}
        <motion.div
          className="acc-identity-card"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="acc-identity-card__corner acc-identity-card__corner--tl" />
          <div className="acc-identity-card__corner acc-identity-card__corner--tr" />
          <div className="acc-identity-card__corner acc-identity-card__corner--bl" />
          <div className="acc-identity-card__corner acc-identity-card__corner--br" />

          <div className="acc-avatar-wrap">
            <div className="acc-avatar">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={fullName || username}
                  className="acc-avatar__img"
                />
              ) : (
                <span className="acc-avatar__initials">{initials}</span>
              )}
              <div className="acc-avatar__ring" />
            </div>
            <div className="acc-avatar__status">
              <span className="acc-status-dot" />
              ACTIVE SESSION
            </div>
          </div>

          <div className="acc-identity-card__info">
            <h2 className="acc-identity-card__name">
              {fullName || username || 'User'}
            </h2>
            <p className="acc-identity-card__email">
              {email}
              {isVerified && (
                <span className="acc-verified-badge">
                  <MdVerified size={12} /> Verified
                </span>
              )}
            </p>
            <div className="acc-identity-card__meta">
              <span className="acc-meta-chip">
                <MdCalendarToday size={10} /> Joined {createdAt}
              </span>
              <span className="acc-meta-chip">
                <MdFingerprint size={10} /> {user.id?.slice(0, 16)}…
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Profile section ──────────────────────────────────── */}
        <Section
          eyebrow="01 — IDENTITY"
          title="Profile Information"
          accent="#ffaa00"
          index={0}
        >
          <div className="acc-fields">
            <EditableField
              label="First Name"
              value={user.firstName || ''}
              icon={MdPerson}
              onSave={updateFirstName}
            />
            <EditableField
              label="Last Name"
              value={user.lastName || ''}
              icon={MdPerson}
              onSave={updateLastName}
            />
            <EditableField
              label="Username"
              value={username}
              icon={MdBadge}
              onSave={updateUsername}
            />
            <EditableField
              label="Email Address"
              value={email}
              icon={MdAlternateEmail}
              onSave={() => {}}
              readonly
            />
          </div>
          <p className="acc-section__note">
            Email changes and advanced profile settings are managed via the full
            profile portal.
          </p>
        </Section>

        {/* ── Security section ─────────────────────────────────── */}
        <Section
          eyebrow="02 — SECURITY"
          title="Authentication & Access"
          accent="#00f5ff"
          index={1}
        >
          <div className="acc-action-list">
            <ActionRow
              icon={MdKey}
              label="Change Password"
              sub="Update your login credentials"
              accent="#00f5ff"
              onClick={() => openUserProfile({ routing: 'hash' })}
            />
            <ActionRow
              icon={MdSecurity}
              label="Two-Factor Authentication"
              sub="Add an extra layer of security"
              accent="#00d4aa"
              onClick={() => openUserProfile({ routing: 'hash' })}
            />
            <ActionRow
              icon={MdShield}
              label="Connected Accounts"
              sub="Manage OAuth providers (Google, etc.)"
              accent="#8877ff"
              onClick={() => openUserProfile({ routing: 'hash' })}
            />
            <ActionRow
              icon={MdAccountCircle}
              label="Full Profile Portal"
              sub="All Clerk account settings in one place"
              accent="#ffaa00"
              onClick={() => openUserProfile({ routing: 'hash' })}
            />
          </div>
        </Section>

        {/* ── Session section ──────────────────────────────────── */}
        <Section
          eyebrow="03 — SESSION"
          title="Active Session"
          accent="#30d158"
          index={2}
        >
          <div className="acc-session-card">
            <div className="acc-session-card__dot" />
            <div className="acc-session-card__body">
              <span className="acc-session-card__title">Current session</span>
              <span className="acc-session-card__sub">
                Signed in as <strong>{email}</strong> · Session active
              </span>
            </div>
            <button
              className="acc-session-card__signout"
              onClick={() => setShowSignOut(true)}
            >
              <MdLogout size={13} /> Sign out
            </button>
          </div>
        </Section>

        {/* ── Danger zone ──────────────────────────────────────── */}
        <Section
          eyebrow="04 — DANGER ZONE"
          title="Destructive Actions"
          accent="#ff4444"
          index={3}
        >
          <div className="acc-danger-zone">
            <div className="acc-danger-zone__warning">
              <MdWarning
                size={14}
                style={{ color: '#ff4444', flexShrink: 0 }}
              />
              <p>
                Actions in this section are permanent and cannot be reversed.
              </p>
            </div>
            <ActionRow
              icon={MdDelete}
              label="Delete Account"
              sub="Permanently remove your account and all data"
              accent="#ff4444"
              onClick={() => setShowDelete(true)}
              danger
            />
          </div>
        </Section>
      </div>
    </div>
  );
}
