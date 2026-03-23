// ============================================================
// FILE: src/App.jsx
// FinlyticsX — Root app with Sidebar in layout
// ============================================================

import Navbar from './components/Layout/Navbar.jsx';
import Sidebar from './components/Layout/Sidebar.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <AppRoutes />
        </main>
      </div>
    </>
  );
}

export default App;
