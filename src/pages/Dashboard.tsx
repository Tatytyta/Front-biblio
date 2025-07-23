import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Libro, Prestamo } from '../types';
import { dashboardService, prestamosService } from '../services/api';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [librosRecomendados, setLibrosRecomendados] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const cargarDatosDashboard = async () => {
    setLoading(true);
    try {
      // Cargar datos del dashboard desde el backend
      const [dashboardData, prestamosData] = await Promise.all([
        dashboardService.getUserDashboard(),
        prestamosService.getMisPrestamos()
      ]);

      setPrestamos(prestamosData.prestamos || prestamosData);
      setLibrosRecomendados(dashboardData.librosRecomendados || []);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      // En caso de error, mostrar datos de ejemplo
      const prestamosData: Prestamo[] = [
        {
          id: '1',
          libroId: '1',
          usuarioId: user?.id || '',
          fechaPrestamo: '2025-01-15',
          fechaVencimiento: '2025-02-15',
          estado: 'activo',
          renovaciones: 0
        },
        {
          id: '2',
          libroId: '2',
          usuarioId: user?.id || '',
          fechaPrestamo: '2025-01-10',
          fechaDevolucion: '2025-01-20',
          fechaVencimiento: '2025-02-10',
          estado: 'devuelto',
          renovaciones: 1
        }
      ];

      const librosRecomendadosData: Libro[] = [
        {
          id: '5',
          titulo: 'El Arte de la Guerra',
          autor: 'Sun Tzu',
          isbn: '978-0-486-42557-1',
          categoria: 'Filosofía',
          ubicacion: 'F-021',
          disponible: true,
          fechaPublicacion: '500 A.C.',
          descripcion: 'Tratado militar clásico sobre estrategia.',
          stock: 3,
          stockDisponible: 2,
          rating: 4.5,
          portada: '⚔️'
        }
      ];

      setPrestamos(prestamosData);
      setLibrosRecomendados(librosRecomendadosData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-bounce">📚</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Cargando Dashboard</h2>
          <div className="flex justify-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-4">
                <div className="text-5xl">📚</div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">
                    Biblioteca Sandra
                  </h1>
                  <p className="text-sm text-gray-600">Mi Dashboard</p>
                </div>
              </Link>
            </div>

            <nav className="hidden md:flex space-x-8">
              <Link to="/catalog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Catálogo
              </Link>
              <Link to="/my-books" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Mis Libros
              </Link>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Perfil
              </Link>
              {user?.tipo === 'admin' && (
                <Link to="/admin" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                  Admin Panel
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Hola, <span className="font-medium">{user?.nombre}</span>
              </div>
              <button
                onClick={logout}
                className="btn btn-outline text-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido, {user?.nombre}! 👋
          </h2>
          <p className="text-xl text-gray-600">
            {user?.tipo === 'admin' ? 'Panel de administrador' : 'Aquí puedes gestionar tus préstamos y descubrir nuevos libros'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="text-4xl mr-4">📖</div>
              <div>
                <h3 className="text-2xl font-bold text-blue-600">{prestamos.filter(p => p.estado === 'activo').length}</h3>
                <p className="text-gray-600">Préstamos Activos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="text-4xl mr-4">✅</div>
              <div>
                <h3 className="text-2xl font-bold text-green-600">{prestamos.filter(p => p.estado === 'devuelto').length}</h3>
                <p className="text-gray-600">Libros Devueltos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="text-4xl mr-4">⭐</div>
              <div>
                <h3 className="text-2xl font-bold text-purple-600">{librosRecomendados.length}</h3>
                <p className="text-gray-600">Recomendaciones</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Préstamos Activos */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Mis Préstamos Activos</h3>
            {prestamos.filter(p => p.estado === 'activo').length > 0 ? (
              <div className="space-y-4">
                {prestamos.filter(p => p.estado === 'activo').map((prestamo) => (
                  <div key={prestamo.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">Libro ID: {prestamo.libroId}</h4>
                        <p className="text-sm text-gray-600">Prestado: {prestamo.fechaPrestamo}</p>
                        <p className="text-sm text-gray-600">Vence: {prestamo.fechaVencimiento}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn btn-outline text-xs">Renovar</button>
                        <button className="btn btn-primary text-xs">Devolver</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-gray-600">No tienes préstamos activos</p>
                <Link to="/catalog" className="btn btn-primary mt-4">
                  Explorar Catálogo
                </Link>
              </div>
            )}
          </div>

          {/* Libros Recomendados */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recomendaciones para Ti</h3>
            <div className="space-y-4">
              {librosRecomendados.map((libro) => (
                <div key={libro.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{libro.portada}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{libro.titulo}</h4>
                      <p className="text-sm text-gray-600">por {libro.autor}</p>
                      <p className="text-xs text-gray-500 mt-1">{libro.categoria}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm text-gray-600 ml-1">{libro.rating}</span>
                      </div>
                    </div>
                    <button className="btn btn-primary text-xs">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/catalog" className="btn btn-outline text-center p-4">
              <div className="text-3xl mb-2">🔍</div>
              <div>Buscar Libros</div>
            </Link>
            <Link to="/my-books" className="btn btn-outline text-center p-4">
              <div className="text-3xl mb-2">📚</div>
              <div>Mis Libros</div>
            </Link>
            <Link to="/profile" className="btn btn-outline text-center p-4">
              <div className="text-3xl mb-2">👤</div>
              <div>Mi Perfil</div>
            </Link>
            <Link to="/support" className="btn btn-outline text-center p-4">
              <div className="text-3xl mb-2">💬</div>
              <div>Soporte</div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
