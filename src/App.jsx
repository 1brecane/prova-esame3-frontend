import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Clienti from './pages/Clienti';
import Consegne from './pages/Consegne';
import Tracking from './pages/Tracking';
import Utenti from './pages/Utenti';
import PublicLayout from './components/Layout/PublicLayout';
import AdminLayout from './components/Layout/AdminLayout';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Caricamento...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.admin) return <Navigate to="/" />;
  
  return <AdminLayout>{children}</AdminLayout>;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Caricamento...</div>;
  if (user) return <Navigate to="/clienti" />;
  
  return <PublicLayout>{children}</PublicLayout>;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/tracking" element={<PublicRoute><Tracking /></PublicRoute>} />
        
        <Route path="/clienti" element={
          <ProtectedRoute>
            <Clienti />
          </ProtectedRoute>
        } />
        
        <Route path="/consegne" element={
          <ProtectedRoute>
            <Consegne />
          </ProtectedRoute>
        } />

        <Route path="/utenti" element={
          <ProtectedRoute adminOnly={true}>
            <Utenti />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;
