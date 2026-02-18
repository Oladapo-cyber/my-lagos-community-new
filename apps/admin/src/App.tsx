import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdminAuth } from './context/AdminAuthContext';
import AdminLogin from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLayoutWrapper } from './components/AdminLayoutWrapper';

// Loading spinner
const LoadingScreen: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading...</p>
    </div>
  </div>
);

// Protects admin routes — redirects to login if not authenticated
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, isLoading } = useAdminAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

// Redirect /login to /dashboard if already logged in
const LoginRoute: React.FC = () => {
  const { isLoggedIn, isLoading } = useAdminAuth();

  if (isLoading) return <LoadingScreen />;
  if (isLoggedIn) return <Navigate to="/dashboard" replace />;

  return <AdminLogin />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <AdminLayoutWrapper>
            <AdminDashboard />
          </AdminLayoutWrapper>
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
