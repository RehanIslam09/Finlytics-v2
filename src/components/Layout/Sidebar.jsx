/* ============================================================
   FILE: src/components/Layout/Sidebar.jsx
   UPDATED: Goals + Invoices added to nav links
   ============================================================ */

import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MdDashboard,
  MdReceipt,
  MdAddCircle,
  MdPieChart,
  MdBarChart,
  MdTrendingUp,
  MdTrendingDown,
  MdAccountBalance,
  MdRepeat,
  MdFlag,
  MdReceiptLong,
} from 'react-icons/md';
import { useFinance } from '../../context/FinanceContext';
import useCurrency from '../../hooks/useCurrency';
import './Sidebar.css';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: MdDashboard },
  { to: '/transactions', label: 'Transactions', icon: MdReceipt },
  { to: '/transactions/new', label: 'Add New', icon: MdAddCircle },
  { to: '/budget', label: 'Budget', icon: MdPieChart },
  { to: '/analytics', label: 'Analytics', icon: MdBarChart },
  { to: '/goals', label: 'Goals', icon: MdFlag },
  { to: '/invoices', label: 'Invoices', icon: MdReceiptLong },
];

export default function Sidebar() {
  const { totalIncome, totalExpenses, netBalance, transactions } = useFinance();
  const { formatCurrency } = useCurrency();

  const recurringCount = transactions.filter((t) => t.recurring).length;
  const thisMonth = new Date().toLocaleString('default', { month: 'long' });

  const stats = [
    {
      label: 'Income',
      value: formatCurrency(totalIncome),
      icon: MdTrendingUp,
      color: '#00ff88',
    },
    {
      label: 'Expenses',
      value: formatCurrency(totalExpenses),
      icon: MdTrendingDown,
      color: '#ff4444',
    },
    {
      label: 'Balance',
      value: formatCurrency(Math.abs(netBalance)),
      icon: MdAccountBalance,
      color: netBalance >= 0 ? '#00d4ff' : '#ff4444',
    },
    {
      label: 'Recurring',
      value: `${recurringCount} active`,
      icon: MdRepeat,
      color: '#ffaa00',
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <span className="sidebar__logo-dot">●</span>
        <span className="sidebar__logo-text">
          FINLYTICS<span className="sidebar__logo-accent">X</span>
        </span>
      </div>

      <nav className="sidebar__nav">
        <div className="sidebar__nav-label">NAVIGATION</div>
        {NAV_LINKS.map((link, i) => (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: i * 0.04,
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'active' : ''}`
              }
            >
              <div className="sidebar__link-icon">
                <link.icon size={16} />
              </div>
              <span className="sidebar__link-label">{link.label}</span>
              <div className="sidebar__link-bar" />
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="sidebar__divider" />

      <div className="sidebar__stats-section">
        <div className="sidebar__nav-label">
          QUICK STATS · {thisMonth.toUpperCase()}
        </div>
        <div className="sidebar__stats">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="sidebar__stat"
              style={{ '--s-color': s.color }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.3 }}
            >
              <div className="sidebar__stat-icon">
                <s.icon size={12} />
              </div>
              <div className="sidebar__stat-body">
                <span className="sidebar__stat-label">{s.label}</span>
                <span
                  className="sidebar__stat-value"
                  style={{ color: s.color }}
                >
                  {s.value}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="sidebar__spending">
        <div className="sidebar__spending-header">
          <span>Monthly Spend</span>
          <span style={{ color: '#ffaa00' }}>
            {formatCurrency(totalExpenses)}
          </span>
        </div>
        <div className="sidebar__spending-track">
          <motion.div
            className="sidebar__spending-fill"
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min((totalExpenses / (totalExpenses + totalIncome || 1)) * 100, 100)}%`,
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          />
        </div>
        <div className="sidebar__spending-sub">
          of total cash flow this period
        </div>
      </div>

      <div className="sidebar__footer">
        <span className="sidebar__footer-text">FinlyticsX v1.0</span>
        <span className="sidebar__footer-dot">●</span>
        <span className="sidebar__footer-text">All data local</span>
      </div>
    </aside>
  );
}
