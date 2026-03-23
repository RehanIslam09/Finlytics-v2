// ============================================================
// FILE: src/components/ToastNotification/ToastNotification.jsx
// FinlyticsX — Centered overlay notification
// Replaces react-toastify entirely — no z-index issues ever
// ============================================================

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCheckCircle, MdDelete, MdDownload, MdClose } from 'react-icons/md';
import './ToastNotification.css';

export default function ToastNotification({
  message,
  type = 'success',
  visible,
  onHide,
}) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onHide, 2200);
    return () => clearTimeout(timer);
  }, [visible, onHide]);

  const config = {
    success: {
      icon: MdCheckCircle,
      color: '#00ff88',
      glow: 'rgba(0,255,136,0.25)',
    },
    error: { icon: MdDelete, color: '#ff4444', glow: 'rgba(255,68,68,0.25)' },
    export: {
      icon: MdDownload,
      color: '#00f5ff',
      glow: 'rgba(0,245,255,0.25)',
    },
  };

  const { icon: Icon, color, glow } = config[type] || config.success;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Invisible click-away backdrop */}
          <motion.div
            className="tn-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onHide}
          />

          {/* Centered notification card */}
          <motion.div
            className="tn-card"
            style={{ '--tn-color': color, '--tn-glow': glow }}
            initial={{ opacity: 0, scale: 0.82, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: -12 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Scan line */}
            <motion.div
              className="tn-scan"
              style={{ background: color }}
              initial={{ left: '-10%' }}
              animate={{ left: '110%' }}
              transition={{ duration: 1, ease: 'linear', delay: 0.1 }}
            />

            {/* Icon */}
            <div
              className="tn-icon"
              style={{ color, boxShadow: `0 0 20px ${glow}` }}
            >
              <Icon size={22} />
            </div>

            {/* Message */}
            <p className="tn-message">{message}</p>

            {/* Close */}
            <button className="tn-close" onClick={onHide}>
              <MdClose size={14} />
            </button>

            {/* Progress bar */}
            <motion.div
              className="tn-progress"
              style={{ background: color }}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 2.2, ease: 'linear' }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
