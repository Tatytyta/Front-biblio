import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Páginas públicas
import LandingPage from '../components/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Catalog from '../pages/Catalog';
import NotFound from '../pages/NotFound';

const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ==================== RUTAS PÚBLICAS ==================== */}
      
      {/* Página principal */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Autenticación */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Catálogo público */}
      <Route path="/catalog" element={<Catalog />} />
      
      {/* Página no encontrada */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
