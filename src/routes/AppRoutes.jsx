// FILE: src/routes/AppRoutes.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

import ProtectedRoute from '../components/Auth/ProtectedRoute.jsx';
import Landing from '../pages/Landing.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Transactions from '../pages/Transactions.jsx';
import AddTransaction from '../pages/AddTransaction.jsx';
import Budget from '../pages/Budget.jsx';
import Analytics from '../pages/Analytics.jsx';
import Goals from '../pages/Goals.jsx';
import Invoices from '../pages/Invoices.jsx';
import Account from '../pages/Account.jsx';

function AppRoutes() {
  const { isSignedIn } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={isSignedIn ? <Navigate to="/dashboard" /> : <Landing />}
      />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions/new"
        element={
          <ProtectedRoute>
            <AddTransaction />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions/:id/edit"
        element={
          <ProtectedRoute>
            <AddTransaction />
          </ProtectedRoute>
        }
      />
      <Route
        path="/budget"
        element={
          <ProtectedRoute>
            <Budget />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <Goals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoices"
        element={
          <ProtectedRoute>
            <Invoices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
