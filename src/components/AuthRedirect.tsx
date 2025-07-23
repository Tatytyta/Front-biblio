import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      console.log('🔄 AuthRedirect - Usuario detectado:', {
        tipo: user.tipo,
        email: user.email,
        esAdmin: user.tipo === 'admin' || user.tipo === 'bibliotecario'
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-bounce">📚</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Biblioteca Sandra</h2>
          <p className="text-xl text-gray-600 mb-8">Redirigiendo...</p>
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
    console.log('❌ No hay usuario autenticado, redirigiendo a login');
    return <Navigate to="/login" replace />;
  }

  // 🎯 LÓGICA DE REDIRECCIÓN BASADA EN TIPO DE USUARIO
  // Nueva lógica: admin2@bibliotec.com, tipo admin o bibliotecario => /admin
  const isAdmin = user.tipo === 'admin' || user.tipo === 'bibliotecario' || user.email === 'admin2@bibliotec.com';
  
  if (isAdmin) {
    console.log('👨‍💼 Usuario ADMIN detectado, redirigiendo a /admin:', {
      tipo: user.tipo,
      email: user.email
    });
    return <Navigate to="/admin" replace />;
  } else {
    console.log('👤 Usuario NORMAL detectado, redirigiendo a /user-dashboard:', {
      tipo: user.tipo,
      email: user.email
    });
    return <Navigate to="/user-dashboard" replace />;
  }
};

export default AuthRedirect;
