/* ============================================================
FILE: src/main.jsx
============================================================ */

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from './App.jsx';
import { FinanceProvider } from './context/FinanceContext.jsx';

import './styles/global.css';
import './styles/theme.css';

createRoot(document.getElementById('root')).render(
  <>
    {' '}
    <BrowserRouter>
      {' '}
      <FinanceProvider>
        {' '}
        <App />{' '}
      </FinanceProvider>{' '}
    </BrowserRouter>
    ```
    {/* Still outside providers — good */}
    <ToastContainer
      position="top-right"
      autoClose={2800}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="dark"
      style={{ top: '72px' }}
      toastStyle={{
        background: '#0f0f18',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#e8e8f0',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '12px',
        borderRadius: '10px',
      }}
    />
    ```
  </>,
);
