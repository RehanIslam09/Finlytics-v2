/* ============================================================
   FILE: src/components/Layout/Navbar.jsx
   UPDATED: Avatar wired to /account + Clerk user initials/photo
   ============================================================ */

import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiBell, FiMenu, FiX, FiGlobe, FiChevronDown } from 'react-icons/fi';
import { MdAccountCircle } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import useCurrency from '../../hooks/useCurrency';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [fxOpen, setFxOpen] = useState(false);
  const fxRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useUser();

  const { setCurrency, selectedCurrency, supportedCurrencies } = useCurrency();

  useEffect(() => {
    const handler = (e) => {
      if (fxRef.current && !fxRef.current.contains(e.target)) setFxOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/transactions', label: 'Transactions' },
    { to: '/budget', label: 'Budget' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/goals', label: 'Goals' },
    { to: '/invoices', label: 'Invoices' },
  ];

  // Derive avatar display from Clerk user
  const avatarInitials = user
    ? (
        user.fullName ||
        user.username ||
        user.primaryEmailAddress?.emailAddress ||
        'FX'
      )
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'FX';

  return (
    <header className="navbar">
      <div className="navbar__container">
        <div className="navbar__logo">
          <span className="logo-icon">●</span>
          <span className="logo-text">
            FINLYTICS<span className="logo-accent">X</span>
          </span>
        </div>

        <nav className="navbar__links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <button className="icon-btn" title="Notifications">
            <FiBell />
          </button>

          {/* Currency switcher */}
          <div className="fx-wrap" ref={fxRef}>
            <button
              className={`icon-btn fx-btn ${fxOpen ? 'active' : ''}`}
              onClick={() => setFxOpen((v) => !v)}
              title="Switch currency"
            >
              <FiGlobe />
              <span className="fx-btn__label">{selectedCurrency}</span>
              <FiChevronDown
                size={10}
                className={`fx-chevron ${fxOpen ? 'open' : ''}`}
              />
            </button>
            <AnimatePresence>
              {fxOpen && (
                <motion.div
                  className="fx-dropdown"
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="fx-dropdown__header">
                    <FiGlobe size={11} /> CURRENCY
                  </div>
                  {supportedCurrencies.map((c) => (
                    <button
                      key={c.code}
                      className={`fx-option ${selectedCurrency === c.code ? 'active' : ''}`}
                      onClick={() => {
                        setCurrency(c.code);
                        setFxOpen(false);
                      }}
                    >
                      <span className="fx-option__flag">{c.flag}</span>
                      <span className="fx-option__code">{c.code}</span>
                      <span className="fx-option__label">{c.label}</span>
                      {selectedCurrency === c.code && (
                        <span className="fx-option__active-dot" />
                      )}
                    </button>
                  ))}
                  <div className="fx-dropdown__footer">
                    Rates via exchangerate-api.com
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/transactions/new" className="cta-btn">
            + ADD
          </NavLink>

          {/* Avatar — clicks through to /account */}
          <button
            className="avatar"
            onClick={() => navigate('/account')}
            title="Account settings"
          >
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName || 'Avatar'}
                className="avatar__photo"
              />
            ) : (
              avatarInitials
            )}
            <span className="avatar__dot" />
          </button>

          <button
            className="icon-btn mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="mobile-link"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mobile-fx">
              <span className="mobile-fx__label">Currency:</span>
              {supportedCurrencies.map((c) => (
                <button
                  key={c.code}
                  className={`mobile-fx__btn ${selectedCurrency === c.code ? 'active' : ''}`}
                  onClick={() => setCurrency(c.code)}
                >
                  {c.flag} {c.code}
                </button>
              ))}
            </div>
            <NavLink
              to="/transactions/new"
              className="mobile-cta"
              onClick={() => setIsOpen(false)}
            >
              + ADD TRANSACTION
            </NavLink>
            {/* Account link in mobile menu */}
            <NavLink
              to="/account"
              className="mobile-link"
              onClick={() => setIsOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 4,
              }}
            >
              <MdAccountCircle size={14} /> Account Settings
            </NavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
