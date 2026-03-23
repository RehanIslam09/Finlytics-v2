/* ============================================
   FILE: src/context/FinanceContext.jsx
   ============================================ */

import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

const seedData = () => {
  const today = new Date();

  const categories = [
    'Food',
    'Travel',
    'Rent',
    'Shopping',
    'Entertainment',
    'Health',
    'Utilities',
    'Subscriptions',
  ];

  const transactions = [];

  for (let i = 0; i < 40; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i * 3);

    const isIncome = i % 5 === 0;

    transactions.push({
      id: uuidv4(),
      title: isIncome ? 'Salary' : categories[i % categories.length],
      amount: isIncome
        ? 50000 + Math.floor(Math.random() * 10000)
        : 200 + Math.floor(Math.random() * 5000),
      category: isIncome ? 'Income' : categories[i % categories.length],
      type: isIncome ? 'income' : 'expense',
      date: date.toISOString(),
      notes: '',
      recurring: isIncome,
    });
  }

  return transactions;
};

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem('transactions');
    return stored ? JSON.parse(stored) : seedData();
  });

  const [budget, setBudget] = useState(() => {
    const stored = localStorage.getItem('budget');
    return stored ? JSON.parse(stored) : { monthlyBudget: 50000 };
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budget', JSON.stringify(budget));
  }, [budget]);

  // CRUD
  const addTransaction = (tx) => {
    setTransactions((prev) => [{ ...tx, id: uuidv4() }, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTransaction = (id, updated) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t)),
    );
  };

  // DERIVED VALUES
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const budgetRemaining = budget.monthlyBudget - totalExpenses;

  const budgetUsedPercent = (totalExpenses / budget.monthlyBudget) * 100;

  const transactionsByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  // monthly data
  const monthlyData = Array.from({ length: 6 })
    .map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);

      const month = d.toLocaleString('default', { month: 'short' });

      const income = transactions
        .filter(
          (t) =>
            new Date(t.date).getMonth() === d.getMonth() && t.type === 'income',
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = transactions
        .filter(
          (t) =>
            new Date(t.date).getMonth() === d.getMonth() &&
            t.type === 'expense',
        )
        .reduce((sum, t) => sum + t.amount, 0);

      return { month, income, expenses };
    })
    .reverse();

  const value = {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    budget,
    setBudget,
    totalIncome,
    totalExpenses,
    netBalance,
    budgetRemaining,
    budgetUsedPercent,
    transactionsByCategory,
    monthlyData,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}
