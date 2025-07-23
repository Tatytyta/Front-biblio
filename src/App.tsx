import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRedirect from './components/AuthRedirect';

// Pages
import LandingPage from './components/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboardComplete from './pages/UserDashboardComplete';
import AdminDashboardNew from './pages/AdminDashboardNew';
import Catalog from './pages/Catalog';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/catalog" element={<Catalog />} />

            {/* Ruta de redirección automática después del login */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <AuthRedirect />
                </ProtectedRoute>
              } 
            />

            {/* Rutas de Usuario */}
            <Route 
              path="/user-dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboardComplete />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/user" 
              element={
                <ProtectedRoute>
                  <UserDashboardComplete />
                </ProtectedRoute>
              } 
            />

            {/* Rutas de Administrador */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardNew />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardNew />
                </ProtectedRoute>
              } 
            />

            {/* Página 404 */}
            <Route path="/404" element={<NotFound />} />
            
            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
