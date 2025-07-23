import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Libro, Prestamo } from '../types';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    librosLeidos: 0,
    prestamosActivos: 0,
    prestamosVencidos: 0,
    librosFavoritos: 0
  });
  const [recentBooks, setRecentBooks] = useState<Libro[]>([]);
  const [activePrestamos, setActivePrestamos] = useState<Prestamo[]>([]);

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      // Simular datos del usuario por ahora
      setStats({
        librosLeidos: 12,
        prestamosActivos: 3,
        prestamosVencidos: 1,
        librosFavoritos: 8
      });

      // Simular libros recientes
      setRecentBooks([
        {
          id: '1',
          titulo: 'El Quijote',
          autor: 'Miguel de Cervantes',
          isbn: '978-84-376-0494-7',
          categoria: 'Literatura',
          ubicacion: 'A-001',
          disponible: false,
          fechaPublicacion: '1605-01-16',
          descripcion: 'La obra maestra de la literatura española',
          stock: 5,
          stockDisponible: 4,
          portada: '/api/placeholder/200/300',
          rating: 4.8
        },
        {
          id: '2',
          titulo: 'Cien años de soledad',
          autor: 'Gabriel García Márquez',
          isbn: '978-84-376-0495-8',
          categoria: 'Literatura',
          ubicacion: 'A-002',
          disponible: true,
          fechaPublicacion: '1967-05-30',
          descripcion: 'Una obra maestra del realismo mágico',
          stock: 3,
          stockDisponible: 3,
          portada: '/api/placeholder/200/300',
          rating: 4.9
        }
      ]);

      // Simular préstamos activos
      setActivePrestamos([
        {
          id: '1',
          libroId: '1',
          usuarioId: user?.id || '',
          fechaPrestamo: '2025-07-15',
          fechaVencimiento: '2025-07-29',
          estado: 'activo',
          renovaciones: 0
        }
      ]);
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    }
  };

  const StatCard = ({ icon, title, value, color, subtitle }: {
    icon: string;
    title: string;
    value: number;
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 text-2xl">{icon}</div>
        </div>
        <div className="ml-4">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const BookCard = ({ libro }: { libro: Libro }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="w-16 h-24 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-2xl">📚</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">{libro.titulo}</h3>
          <p className="text-gray-600 text-xs">{libro.autor}</p>
          <div className="flex items-center mt-1">
            <span className="text-yellow-400">⭐</span>
            <span className="text-xs text-gray-500 ml-1">{libro.rating}</span>
          </div>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
            libro.disponible
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {libro.disponible ? 'Disponible' : 'Prestado'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Hola, {user?.nombre}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenido a tu espacio personal en la Biblioteca Sandra
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="📚"
            title="Libros Leídos"
            value={stats.librosLeidos}
            color="#3B82F6"
            subtitle="Este año"
          />
          <StatCard
            icon="🕒"
            title="Préstamos Activos"
            value={stats.prestamosActivos}
            color="#10B981"
          />
          <StatCard
            icon="⚠️"
            title="Por Devolver"
            value={stats.prestamosVencidos}
            color="#F59E0B"
            subtitle="¡Urgente!"
          />
          <StatCard
            icon="❤️"
            title="Favoritos"
            value={stats.librosFavoritos}
            color="#EF4444"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Libros Recientes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <span className="mr-2">📖</span>
                  Libros Recomendados
                </h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Ver todos
                </button>
              </div>
              <div className="space-y-4">
                {recentBooks.map((libro) => (
                  <BookCard key={libro.id} libro={libro} />
                ))}
              </div>
            </div>
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Perfil Rápido */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">👤</span>
                Tu Perfil
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tipo de Usuario:</span>
                  <span className="font-medium capitalize">{user?.tipo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-sm">{user?.email}</span>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Editar Perfil
                </button>
              </div>
            </div>

            {/* Préstamos Activos */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Mis Préstamos 📋
              </h3>
              {activePrestamos.length > 0 ? (
                <div className="space-y-3">
                  {activePrestamos.map((prestamo) => (
                    <div key={prestamo.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">Libro #{prestamo.libroId}</p>
                          <p className="text-xs text-gray-500">
                            Vence: {prestamo.fechaVencimiento}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          {prestamo.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                  <button className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Ver todos mis préstamos
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No tienes préstamos activos</p>
              )}
            </div>

            {/* Acciones Rápidas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Acciones Rápidas ⚡
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  📚 Buscar Libros
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  📖 Mis Reservas
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  ⭐ Mis Favoritos
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  📝 Historial de Lectura
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
