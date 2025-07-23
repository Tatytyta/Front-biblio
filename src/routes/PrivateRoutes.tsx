import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Páginas privadas para usuarios autenticados
import UserDashboardComplete from '../pages/UserDashboardComplete';
import UserDashboard from '../pages/UserDashboard';

// Páginas privadas para administradores
import AdminDashboardNew from '../pages/AdminDashboardNew';

const PrivateRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ==================== RUTAS DE USUARIOS ==================== */}
      
      {/* Dashboard principal de usuario */}
      <Route 
        path="/user-dashboard" 
        element={
          <ProtectedRoute>
            <UserDashboardComplete />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta alternativa para usuarios */}
      <Route 
        path="/user" 
        element={
          <ProtectedRoute>
            <UserDashboardComplete />
          </ProtectedRoute>
        } 
      />
      
      {/* Mis libros */}
      <Route 
        path="/my-books" 
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Mi perfil */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <UserDashboardComplete />
          </ProtectedRoute>
        } 
      />

      {/* ==================== RUTAS DE ADMINISTRADORES ==================== */}
      
      {/* Dashboard principal de admin */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboardNew />
          </ProtectedRoute>
        } 
      />
      
      {/* Dashboard de admin (ruta alternativa) */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboardNew />
          </ProtectedRoute>
        } 
      />
      
      {/* Gestión de libros */}
      <Route 
        path="/admin/libros" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboardNew />
          </ProtectedRoute>
        } 
      />
      
      {/* Gestión de usuarios */}
      <Route 
        path="/admin/usuarios" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboardNew />
          </ProtectedRoute>
        } 
      />
      
      {/* Gestión de préstamos */}
      <Route 
        path="/admin/prestamos" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboardNew />
          </ProtectedRoute>
        } 
      />
      
      {/* Gestión de géneros */}
      <Route 
        path="/admin/generos" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboardNew />
          </ProtectedRoute>
        } 
      />
      
      {/* Gestión de estanterías */}
      <Route 
        path="/admin/estanterias" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboardNew />
          </ProtectedRoute>
        } 
      />
      
      {/* Gestión de reseñas */}
      <Route 
        path="/admin/resenas" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboardNew />
          </ProtectedRoute>
        } 
      />
      
      {/* Actividad de usuarios */}
      <Route 
        path="/admin/actividad" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboardNew />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default PrivateRoutes;
