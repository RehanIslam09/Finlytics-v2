/* ============================================
   FILE: src/context/FinanceContext.jsx
   v3 — infinite fetch loop fixed
   ============================================ */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { useAuth } from '@clerk/clerk-react';
import { v4 as uuidv4 } from 'uuid';
import { useSupabaseClient } from '../lib/supabase';

const FinanceContext = createContext();
export const useFinance = () => useContext(FinanceContext);

// ─── Cache helpers ─────────────────────────────────────────
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
  } catch {}
};

// ─── Provider ──────────────────────────────────────────────
export function FinanceProvider({ children }) {
  const { userId, isLoaded } = useAuth();

  // FIX 1: Store getSupabase in a ref so it never triggers re-renders
  // or causes useCallback/useEffect dependency changes.
  const getSupabaseRef = useRef(null);
  const rawGetSupabase = useSupabaseClient();
  getSupabaseRef.current = rawGetSupabase;

  const txCacheKey = userId ? `fx_tx_${userId}` : null;
  const budgetCacheKey = userId ? `fx_budget_${userId}` : null;

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

  // ─── Shape converters ────────────────────────────────────
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

  // ─── Fetch all data ───────────────────────────────────────
  // FIX 2: Only depend on userId/cache keys — access getSupabase
  // via the ref so it's never a dependency that changes.
  const fetchAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const db = await getSupabaseRef.current();

      const { data: txData, error: txErr } = await db
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (!txErr && txData) {
        const mapped = txData.map(mapFromDb);
        setTransactions(mapped);
        if (txCacheKey) cacheSet(txCacheKey, mapped);
      } else if (txErr) {
        console.error('fetchTransactions error:', txErr);
      }

      const { data: budgetData, error: budgetErr } = await db
        .from('budgets')
        .select('*')
        .maybeSingle();

      if (!budgetErr && budgetData) {
        const b = { monthlyBudget: budgetData.monthly_budget ?? 0 };
        setBudgetState(b);
        if (budgetCacheKey) cacheSet(budgetCacheKey, b);
      } else if (budgetErr) {
        console.error('fetchBudget error:', budgetErr);
      }
    } catch (err) {
      console.error('fetchAll error:', err);
    }

    setLoading(false);
    setFinanceReady(true);
  }, [userId, txCacheKey, budgetCacheKey]); // ← getSupabase intentionally excluded

  // FIX 3: Effect only re-runs when userId or isLoaded actually changes.
  // fetchAll is stable because it no longer depends on getSupabase.
  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      setTransactions([]);
      setBudgetState({ monthlyBudget: 0 });
      setLoading(false);
      setFinanceReady(false);
      return;
    }

    fetchAll();
  }, [isLoaded, userId]); // ← fetchAll intentionally excluded too

  // ─── CRUD ─────────────────────────────────────────────────

  const addTransaction = async (tx) => {
    const newTx = { ...tx, id: uuidv4() };

    setTransactions((prev) => {
      const next = [newTx, ...prev];
      if (txCacheKey) cacheSet(txCacheKey, next);
      return next;
    });

    const db = await getSupabaseRef.current();
    const { error } = await db.from('transactions').insert(mapToDb(newTx));

    if (error) {
      console.error('addTransaction failed:', error.message);
      setTransactions((prev) => {
        const next = prev.filter((t) => t.id !== newTx.id);
        if (txCacheKey) cacheSet(txCacheKey, next);
        return next;
      });
    }
  };

  const deleteTransaction = async (id) => {
    let removed;

    setTransactions((prev) => {
      removed = prev.find((t) => t.id === id);
      const next = prev.filter((t) => t.id !== id);
      if (txCacheKey) cacheSet(txCacheKey, next);
      return next;
    });

    const db = await getSupabaseRef.current();
    const { error } = await db.from('transactions').delete().eq('id', id);

    if (error) {
      console.error('deleteTransaction failed:', error.message);
      if (removed) {
        setTransactions((prev) => {
          const next = [removed, ...prev].sort(
            (a, b) => new Date(b.date) - new Date(a.date),
          );
          if (txCacheKey) cacheSet(txCacheKey, next);
          return next;
        });
      }
    }
  };

  const updateTransaction = async (id, updated) => {
    let previous;

    setTransactions((prev) => {
      previous = prev.find((t) => t.id === id);
      const next = prev.map((t) => (t.id === id ? { ...t, ...updated } : t));
      if (txCacheKey) cacheSet(txCacheKey, next);
      return next;
    });

    const merged = { ...previous, ...updated };
    const db = await getSupabaseRef.current();
    const { error } = await db
      .from('transactions')
      .update(mapToDb(merged))
      .eq('id', id);

    if (error) {
      console.error('updateTransaction failed:', error.message);
      if (previous) {
        setTransactions((prev) => {
          const next = prev.map((t) => (t.id === id ? previous : t));
          if (txCacheKey) cacheSet(txCacheKey, next);
          return next;
        });
      }
    }
  };

  // ─── Budget upsert ────────────────────────────────────────
  const setBudget = async (value) => {
    const amount =
      typeof value === 'number' ? value : (value?.monthlyBudget ?? 0);

    const next = { monthlyBudget: amount };
    setBudgetState(next);
    if (budgetCacheKey) cacheSet(budgetCacheKey, next);

    const db = await getSupabaseRef.current();
    const { error } = await db.from('budgets').upsert(
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

  // ─── Derived values ───────────────────────────────────────
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

  // ─── Context value ────────────────────────────────────────
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
    loading,
    financeReady,
    refetch: fetchAll,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}
