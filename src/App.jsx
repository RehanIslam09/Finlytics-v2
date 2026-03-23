// ============================================================
// FILE: src/App.jsx
// FinlyticsX — Root app with Sidebar in layout
// ============================================================

import { useLocation } from 'react-router-dom';
import Navbar from './components/Layout/Navbar.jsx';
import Sidebar from './components/Layout/Sidebar.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import './App.css';

function App() {
  const { pathname } = useLocation();
  const isPublic = pathname === '/';

  return (
    <>
      {!isPublic && <Navbar />}
      <div className={isPublic ? '' : 'app-layout'}>
        {!isPublic && <Sidebar />}
        <main className={isPublic ? '' : 'app-main'}>
          <AppRoutes />
        </main>
      </div>
    </>
  );
}

export default App;
