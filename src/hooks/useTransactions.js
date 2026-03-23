/* ============================================
   FILE: src/hooks/useTransactions.js
   ============================================ */

import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

export default function useTransactions() {
  const { transactions, addTransaction, deleteTransaction, updateTransaction } =
    useFinance();

  const [filter, setFilter] = useState('all');

  const filteredTransactions =
    filter === 'all'
      ? transactions
      : transactions.filter((t) => t.type === filter);

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    filteredTransactions,
    setFilter,
  };
}
