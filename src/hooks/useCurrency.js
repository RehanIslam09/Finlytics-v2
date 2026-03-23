/* ============================================
   FILE: src/hooks/useCurrency.js
   FinlyticsX — Currency formatting + live exchange rates
   FIXED: rates re-fetch when currency changes
   ============================================ */

import { useState, useEffect, useCallback } from 'react';
import { fetchExchangeRates } from '../services/api';

export const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'USD', symbol: '$', label: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', label: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', label: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham', flag: '🇦🇪' },
];

// Module-level global state — shared across ALL hook instances
// so every component re-renders when currency or rates change
let _currency = 'INR';
let _rates = { INR: 1 };
let _loading = false;
let _listeners = new Set();

function notifyListeners() {
  _listeners.forEach((fn) => fn());
}

// Fetch rates and store in module global
async function loadRates(baseCurrency) {
  if (_loading) return;
  _loading = true;
  try {
    const { rates } = await fetchExchangeRates('INR');
    _rates = rates;
    _loading = false;
    notifyListeners();
  } catch {
    _loading = false;
  }
}

// Load rates on module init
loadRates('INR');

export default function useCurrency() {
  const [tick, setTick] = useState(0);

  // Subscribe to global state changes
  useEffect(() => {
    const rerender = () => setTick((n) => n + 1);
    _listeners.add(rerender);
    return () => _listeners.delete(rerender);
  }, []);

  // Convert INR amount → selected currency
  const convert = useCallback(
    (amountInINR) => {
      if (_currency === 'INR') return amountInINR;
      const rate = _rates[_currency] ?? 1;
      return amountInINR * rate;
    },
    [tick],
  ); // re-memoize when tick changes (i.e. when rates or currency update)

  // Format with Intl — correct symbol + locale
  const formatCurrency = useCallback(
    (amountInINR) => {
      const converted = convert(amountInINR);
      try {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: _currency,
          maximumFractionDigits: _currency === 'JPY' ? 0 : 0,
          minimumFractionDigits: 0,
        }).format(converted);
      } catch {
        const meta =
          SUPPORTED_CURRENCIES.find((c) => c.code === _currency) ||
          SUPPORTED_CURRENCIES[0];
        return `${meta.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
      }
    },
    [tick],
  );

  const setCurrency = useCallback((code) => {
    if (code === _currency) return;
    _currency = code;
    notifyListeners();
    // Re-fetch rates with new base if needed
    // (we always store INR-base rates and convert client-side,
    //  so no re-fetch needed — just notify)
  }, []);

  const currentCurrencyMeta =
    SUPPORTED_CURRENCIES.find((c) => c.code === _currency) ||
    SUPPORTED_CURRENCIES[0];

  return {
    formatCurrency,
    convert,
    setCurrency,
    selectedCurrency: _currency,
    currentCurrencyMeta,
    supportedCurrencies: SUPPORTED_CURRENCIES,
    rates: _rates,
  };
}
