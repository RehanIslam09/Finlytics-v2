/* ============================================
   FILE: src/context/FinanceContext.jsx
   v2 — Supabase source of truth · Clerk user scoping · no seed data
   ============================================ */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useAuth } from '@clerk/clerk-react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';

const FinanceContext = createContext();
export const useFinance = () => useContext(FinanceContext);

// ─── Cache helpers (localStorage) ─────────────────────────────────────────────
// Lets the app feel instant on return visits — Supabase data arrives and
// replaces the cache once the fetch resolves.

const cacheGet = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const cacheSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded — silently ignore
  }
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export function FinanceProvider({ children }) {
  const { userId, isLoaded } = useAuth();

  // Per-user cache keys so two accounts on the same browser never mix data
  const txCacheKey = userId ? `fx_tx_${userId}` : null;
  const budgetCacheKey = userId ? `fx_budget_${userId}` : null;

  // Seed state from local cache immediately — UI is never blank on return visits
  const [transactions, setTransactions] = useState(() =>
    userId ? cacheGet(txCacheKey, []) : [],
  );
  const [budget, setBudgetState] = useState(() =>
    userId
      ? cacheGet(budgetCacheKey, { monthlyBudget: 0 })
      : { monthlyBudget: 0 },
  );
  const [loading, setLoading] = useState(true);
  const [financeReady, setFinanceReady] = useState(false);

  // ─── Fetch from Supabase on mount / user change ────────────────────────

  const fetchAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    // Fetch transactions
    const { data: txData, error: txErr } = await supabase
      .from('transactions')
      .select('*')
      .eq('clerk_user_id', userId)
      .order('date', { ascending: false });

    if (!txErr && txData) {
      const mapped = txData.map(mapFromDb);
      setTransactions(mapped);
      cacheSet(txCacheKey, mapped);
    }

    // Fetch budget
    const { data: budgetData, error: budgetErr } = await supabase
      .from('budgets')
      .select('*')
      .eq('clerk_user_id', userId)
      .maybeSingle();

    if (!budgetErr && budgetData) {
      const b = { monthlyBudget: budgetData.monthly_budget ?? 0 };
      setBudgetState(b);
      cacheSet(budgetCacheKey, b);
    }

    setLoading(false);
    setFinanceReady(true);
  }, [userId, txCacheKey, budgetCacheKey]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      // User signed out — wipe everything
      setTransactions([]);
      setBudgetState({ monthlyBudget: 0 });
      setLoading(false);
      setFinanceReady(false);
      return;
    }

    fetchAll();
  }, [isLoaded, userId, fetchAll]);

  // ─── Shape converters ────────────────────────────────────────────────────

  // Supabase row (snake_case) → app transaction object (camelCase)
  const mapFromDb = (row) => ({
    id: row.id,
    title: row.title,
    amount: Number(row.amount),
    category: row.category,
    type: row.type,
    date: row.date,
    notes: row.notes ?? '',
    recurring: row.recurring ?? false,
  });

  // App transaction object → Supabase insert/update shape
  const mapToDb = (tx) => ({
    id: tx.id,
    clerk_user_id: userId,
    title: tx.title,
    amount: tx.amount,
    category: tx.category,
    type: tx.type,
    date: tx.date,
    notes: tx.notes ?? '',
    recurring: tx.recurring ?? false,
  });

  // ─── CRUD — optimistic updates + Supabase sync ───────────────────────────

  const addTransaction = async (tx) => {
    const newTx = { ...tx, id: uuidv4() };

    // 1. Update UI immediately
    setTransactions((prev) => {
      const next = [newTx, ...prev];
      cacheSet(txCacheKey, next);
      return next;
    });

    // 2. Sync to Supabase
    const { error } = await supabase
      .from('transactions')
      .insert(mapToDb(newTx));

    if (error) {
      console.error('addTransaction failed:', error.message);
      // Rollback optimistic update
      setTransactions((prev) => {
        const next = prev.filter((t) => t.id !== newTx.id);
        cacheSet(txCacheKey, next);
        return next;
      });
    }
  };

  const deleteTransaction = async (id) => {
    let removed;

    // 1. Remove from UI immediately
    setTransactions((prev) => {
      removed = prev.find((t) => t.id === id);
      const next = prev.filter((t) => t.id !== id);
      cacheSet(txCacheKey, next);
      return next;
    });

    // 2. Delete from Supabase
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('clerk_user_id', userId);

    if (error) {
      console.error('deleteTransaction failed:', error.message);
      // Rollback
      if (removed) {
        setTransactions((prev) => {
          const next = [removed, ...prev].sort(
            (a, b) => new Date(b.date) - new Date(a.date),
          );
          cacheSet(txCacheKey, next);
          return next;
        });
      }
    }
  };

  const updateTransaction = async (id, updated) => {
    let previous;

    // 1. Update UI immediately
    setTransactions((prev) => {
      previous = prev.find((t) => t.id === id);
      const next = prev.map((t) => (t.id === id ? { ...t, ...updated } : t));
      cacheSet(txCacheKey, next);
      return next;
    });

    // 2. Sync to Supabase
    const merged = { ...previous, ...updated };
    const { error } = await supabase
      .from('transactions')
      .update(mapToDb(merged))
      .eq('id', id)
      .eq('clerk_user_id', userId);

    if (error) {
      console.error('updateTransaction failed:', error.message);
      // Rollback
      if (previous) {
        setTransactions((prev) => {
          const next = prev.map((t) => (t.id === id ? previous : t));
          cacheSet(txCacheKey, next);
          return next;
        });
      }
    }
  };

  // ─── Budget — upsert ─────────────────────────────────────────────────────

  const setBudget = async (value) => {
    // Accept both: setBudget(50000) and setBudget({ monthlyBudget: 50000 })
    const amount =
      typeof value === 'number' ? value : (value?.monthlyBudget ?? 0);

    const next = { monthlyBudget: amount };

    // 1. Update UI immediately
    setBudgetState(next);
    cacheSet(budgetCacheKey, next);

    // 2. Upsert in Supabase (creates row on first set, updates on subsequent)
    const { error } = await supabase.from('budgets').upsert(
      {
        clerk_user_id: userId,
        monthly_budget: amount,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'clerk_user_id' },
    );

    if (error) {
      console.error('setBudget failed:', error.message);
    }
  };

  // ─── Derived values (computed on every render from live transactions) ─────

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const monthlyBudgetAmt =
    typeof budget === 'object' ? (budget.monthlyBudget ?? 0) : (budget ?? 0);

  const budgetRemaining = monthlyBudgetAmt - totalExpenses;
  const budgetUsedPercent =
    monthlyBudgetAmt > 0 ? (totalExpenses / monthlyBudgetAmt) * 100 : 0;

  const transactionsByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const monthlyData = Array.from({ length: 6 })
    .map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const month = d.toLocaleString('default', { month: 'short' });
      const income = transactions
        .filter(
          (t) =>
            new Date(t.date).getMonth() === d.getMonth() &&
            new Date(t.date).getFullYear() === d.getFullYear() &&
            t.type === 'income',
        )
        .reduce((sum, t) => sum + t.amount, 0);
      const expenses = transactions
        .filter(
          (t) =>
            new Date(t.date).getMonth() === d.getMonth() &&
            new Date(t.date).getFullYear() === d.getFullYear() &&
            t.type === 'expense',
        )
        .reduce((sum, t) => sum + t.amount, 0);
      return { month, income, expenses };
    })
    .reverse();

  // ─── Context value ───────────────────────────────────────────────────────

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
    loading, // true while initial Supabase fetch is in flight
    financeReady, // true once first fetch has completed
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}
