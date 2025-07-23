import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl mb-8">📚</div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-700 mb-6">Página no encontrada</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div className="space-y-4">
          <Link
            to="/"
            className="btn btn-primary text-lg px-8 py-4 inline-block"
          >
            Ir al inicio
          </Link>
          <br />
          <Link
            to="/catalog"
            className="btn btn-outline text-lg px-8 py-4 inline-block"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
