// FILE: src/routes/AppRoutes.jsx

import { Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from '../pages/Dashboard.jsx';
import Transactions from '../pages/Transactions.jsx';
import AddTransaction from '../pages/AddTransaction.jsx';
import Budget from '../pages/Budget.jsx';
import Analytics from '../pages/Analytics.jsx';
import Goals from '../pages/Goals.jsx';
import Invoices from '../pages/Invoices.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/transactions/new" element={<AddTransaction />} />
      <Route path="/transactions/:id/edit" element={<AddTransaction />} />
      <Route path="/budget" element={<Budget />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/invoices" element={<Invoices />} />
    </Routes>
  );
}

export default AppRoutes;
