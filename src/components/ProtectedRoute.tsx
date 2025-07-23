import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-bounce">📚</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Biblioteca Sandra</h2>
          <p className="text-xl text-gray-600 mb-8">Verificando acceso...</p>
          <div className="flex justify-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirigir a login manteniendo la ruta que intentaba acceder
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.tipo !== 'admin' && user.tipo !== 'administrador' && user.tipo !== 'bibliotecario') {
    // Redirigir a dashboard de usuario si no es admin
    console.log('Usuario sin permisos de admin, redirigiendo a user-dashboard');
    return <Navigate to="/user-dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
