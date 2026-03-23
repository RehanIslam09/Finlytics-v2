/* ============================================
   FILE: src/components/TransactionCard/TransactionCard.jsx
   ============================================ */

import { format, parseISO } from 'date-fns';
import {
  MdFastfood,
  MdFlight,
  MdHome,
  MdShoppingCart,
  MdMovie,
  MdHealthAndSafety,
  MdBolt,
  MdSubscriptions,
} from 'react-icons/md';
import './TransactionCard.css';

const iconMap = {
  Food: MdFastfood,
  Travel: MdFlight,
  Rent: MdHome,
  Shopping: MdShoppingCart,
  Entertainment: MdMovie,
  Health: MdHealthAndSafety,
  Utilities: MdBolt,
  Subscriptions: MdSubscriptions,
};

const categoryColor = {
  Food: '#00f5ff',
  Travel: '#ffaa00',
  Rent: '#8877ff',
  Shopping: '#ff66cc',
  Entertainment: '#ff8844',
  Health: '#00ff88',
  Utilities: '#44ffcc',
  Subscriptions: '#ff4444',
};

function TransactionCard({ tx }) {
  const Icon = iconMap[tx.category] || MdFastfood;
  const color = categoryColor[tx.category] || '#00f5ff';

  let formattedDate = '';
  try {
    formattedDate = format(parseISO(tx.date), 'd MMM yyyy');
  } catch {
    formattedDate = tx.date;
  }

  return (
    <div className="tx-card">
      <div className="tx-left">
        <div
          className="tx-icon-wrap"
          style={{ background: `${color}15`, color }}
        >
          <Icon style={{ fontSize: 15 }} />
        </div>

        <div className="tx-info">
          <div className="tx-title-row">
            <span className="tx-title">{tx.title}</span>
            {tx.recurring && <span className="rec-badge">● REC</span>}
          </div>
          <div className="tx-meta-row">
            <span className="tx-date">{formattedDate}</span>
            <span
              className="tx-category-badge"
              style={{
                background: `${color}15`,
                color,
                borderColor: `${color}30`,
              }}
            >
              {tx.category}
            </span>
          </div>
        </div>
      </div>

      <span className={`tx-amount ${tx.type}`}>
        {tx.type === 'expense' ? '−' : '+'}₹
        {Number(tx.amount).toLocaleString('en-IN')}
      </span>
    </div>
  );
}

export default TransactionCard;
