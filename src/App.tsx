import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { UserRole } from './types';

// Componentă pentru rutele protejate
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirecționează către dashboard-ul corect bazat pe rol
    if (user.role === UserRole.ADMIN) {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/employee" replace />;
    }
  }

  return <>{children}</>;
};

// Componentă wrapper pentru Router
const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Ruta de login */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === UserRole.ADMIN ? '/admin' : '/employee'} replace />
          ) : (
            <Login />
          )
        } 
      />

      {/* Rute pentru angajat */}
      <Route
        path="/employee/*"
        element={
          <ProtectedRoute allowedRoles={[UserRole.EMPLOYEE]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      {/* Rute pentru admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Redirecționare default */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === UserRole.ADMIN ? '/admin' : '/employee'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* 404 - Pagină negăsită */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600">Pagina nu a fost găsită</p>
            </div>
          </div>
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;