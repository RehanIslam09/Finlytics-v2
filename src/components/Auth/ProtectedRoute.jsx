import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded)
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#09090f',
          fontFamily: 'JetBrains Mono, monospace',
          color: 'rgba(232,232,240,0.4)',
          fontSize: '11px',
          letterSpacing: '2px',
        }}
      >
        INITIALISING...
      </div>
    );

  if (!isSignedIn) return <Navigate to="/" replace />;

  return children;
}
