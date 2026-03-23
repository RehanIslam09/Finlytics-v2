/* ============================================
   FILE: src/hooks/useBudget.js
   ============================================ */

import { useFinance } from '../context/FinanceContext';

export default function useBudget() {
  const { budget, setBudget, budgetRemaining, budgetUsedPercent } =
    useFinance();

  return {
    budget,
    setBudget,
    budgetRemaining,
    budgetUsedPercent,
    isOverBudget: budgetRemaining < 0,
  };
}
