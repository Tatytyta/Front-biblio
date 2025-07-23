import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Libro, Categoria } from '../types';
import { librosService, categoriasService } from '../services/api';

const Catalog: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [libros, setLibros] = useState<Libro[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  // Recargar datos cuando cambian los filtros
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      cargarDatos();
    }, 500); // Debounce de 500ms para la búsqueda

    return () => clearTimeout(timeoutId);
  }, [busqueda, categoriaSeleccionada]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      if (isAuthenticated()) {
        // Usuario autenticado: cargar datos reales del backend
        const [librosResponse, categoriasResponse] = await Promise.all([
          librosService.getLibros({
            busqueda: busqueda || undefined,
            categoria: categoriaSeleccionada !== 'todas' ? categoriaSeleccionada : undefined
          }),
          categoriasService.getCategorias()
        ]);

        setLibros(librosResponse.libros || librosResponse);
        setCategorias(categoriasResponse.categorias || categoriasResponse);
      } else {
        // Usuario no autenticado: mostrar datos de ejemplo
        cargarDatosMock();
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      // En caso de error, mostrar datos de ejemplo
      cargarDatosMock();
    } finally {
      setLoading(false);
    }
  };

  const cargarDatosMock = () => {
    // Datos de ejemplo para usuarios no autenticados
    const librosData: Libro[] = [
      {
        id: '1',
        titulo: 'Cien años de soledad',
        autor: 'Gabriel García Márquez',
        isbn: '978-0-06-088328-7',
        categoria: 'Literatura',
        ubicacion: 'A-001',
        disponible: true,
        fechaPublicacion: '1967',
        descripcion: 'Una obra maestra del realismo mágico latinoamericano.',
        stock: 3,
        stockDisponible: 2,
        portada: 'https://via.placeholder.com/300x400?text=Cien+años+de+soledad',
        rating: 4.8
      },
      {
        id: '2',
        titulo: 'Don Quijote de la Mancha',
        autor: 'Miguel de Cervantes',
        isbn: '978-0-14-243723-0',
        categoria: 'Clásicos',
        ubicacion: 'B-002',
        disponible: true,
        fechaPublicacion: '1605',
        descripcion: 'La obra cumbre de la literatura española.',
        stock: 2,
        stockDisponible: 1,
        portada: 'https://via.placeholder.com/300x400?text=Don+Quijote',
        rating: 4.9
      },
      {
        id: '3',
        titulo: 'El amor en los tiempos del cólera',
        autor: 'Gabriel García Márquez',
        isbn: '978-0-307-38973-7',
        categoria: 'Romance',
        ubicacion: 'A-003',
        disponible: false,
        fechaPublicacion: '1985',
        descripcion: 'Una historia de amor que trasciende el tiempo.',
        stock: 1,
        stockDisponible: 0,
        portada: 'https://via.placeholder.com/300x400?text=El+amor+en+los+tiempos',
        rating: 4.7
      },
      {
        id: '4',
        titulo: 'La Casa de los Espíritus',
        autor: 'Isabel Allende',
        isbn: '978-0-553-38368-7',
        categoria: 'Literatura',
        ubicacion: 'C-001',
        disponible: true,
        fechaPublicacion: '1982',
        descripcion: 'Una saga familiar llena de magia y realismo.',
        stock: 4,
        stockDisponible: 3,
        portada: 'https://via.placeholder.com/300x400?text=La+Casa+de+los+Espíritus',
        rating: 4.6
      },
      {
        id: '5',
        titulo: 'El Principito',
        autor: 'Antoine de Saint-Exupéry',
        isbn: '978-0-15-601219-2',
        categoria: 'Infantil',
        ubicacion: 'D-001',
        disponible: true,
        fechaPublicacion: '1943',
        descripcion: 'Un cuento filosófico para todas las edades.',
        stock: 5,
        stockDisponible: 4,
        portada: 'https://via.placeholder.com/300x400?text=El+Principito',
        rating: 4.9
      }
    ];

    const categoriasData: Categoria[] = [
      { 
        id: '1', 
        nombre: 'Literatura', 
        descripcion: 'Obras literarias clásicas y contemporáneas',
        icono: '📚',
        color: '#3B82F6',
        totalLibros: 15
      },
      { 
        id: '2', 
        nombre: 'Clásicos', 
        descripcion: 'Grandes obras de la literatura universal',
        icono: '📖',
        color: '#10B981',
        totalLibros: 8
      },
      { 
        id: '3', 
        nombre: 'Romance', 
        descripcion: 'Novelas románticas',
        icono: '💕',
        color: '#F59E0B',
        totalLibros: 12
      },
      { 
        id: '4', 
        nombre: 'Infantil', 
        descripcion: 'Libros para niños y jóvenes',
        icono: '🧸',
        color: '#EF4444',
        totalLibros: 20
      },
      { 
        id: '5', 
        nombre: 'Ciencia', 
        descripcion: 'Libros científicos y técnicos',
        icono: '🔬',
        color: '#8B5CF6',
        totalLibros: 10
      }
    ];

    setLibros(librosData);
    setCategorias(categoriasData);
  };

  // Filtrar libros basado en búsqueda y categoría
  const librosFiltrados = libros.filter(libro => {
    const coincideBusqueda = libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                            libro.autor.toLowerCase().includes(busqueda.toLowerCase()) ||
                            libro.categoria.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideCategoria = categoriaSeleccionada === 'todas' ||
                              libro.categoria === categoriaSeleccionada;
    
    return coincideBusqueda && coincideCategoria;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header con navegación */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                📚 Biblioteca Sandra
              </Link>
            </div>
            <nav className="flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Inicio
              </Link>
              <Link to="/catalog" className="text-blue-600 font-medium">
                Catálogo
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Mi Dashboard
                  </Link>
                  {user.tipo === 'admin' && (
                    <Link to="/admin" className="text-purple-600 hover:text-purple-700 transition-colors font-medium">
                      Panel Admin
                    </Link>
                  )}
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-700">Hola, {user.nombre}</span>
                    <button
                      onClick={logout}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensaje para usuarios no autenticados */}
        {!isAuthenticated() && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>¡Regístrate para acceder a todas las funciones!</strong> 
                  Solo los usuarios registrados pueden solicitar préstamos y acceder a su dashboard personal.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Buscar Libros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por título, autor
              </label>
              <input
                type="text"
                id="busqueda"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Escribe para buscar..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por categoría
              </label>
              <select
                id="categoria"
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todas">Todas las categorías</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.nombre}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            {librosFiltrados.length} libro{librosFiltrados.length !== 1 ? 's' : ''} encontrado{librosFiltrados.length !== 1 ? 's' : ''}
          </h3>
        </div>

        {/* Grid de libros */}
        {librosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron libros</h3>
            <p className="text-gray-500">Intenta con otros términos de búsqueda o categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {librosFiltrados.map(libro => (
              <div key={libro.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-3 aspect-h-4 bg-gray-100">
                  <img
                    src={libro.portada || 'https://via.placeholder.com/300x400?text=Sin+Imagen'}
                    alt={libro.titulo}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-800 mb-2 line-clamp-2">{libro.titulo}</h4>
                  <p className="text-gray-600 mb-1">por {libro.autor}</p>
                  <p className="text-sm text-gray-500 mb-2">{libro.categoria}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      libro.disponible 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {libro.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                    <span className="text-xs text-gray-500">{libro.fechaPublicacion}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{libro.descripcion}</p>
                  
                  {isAuthenticated() ? (
                    <button
                      disabled={!libro.disponible}
                      className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                        libro.disponible
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {libro.disponible ? 'Solicitar Préstamo' : 'No Disponible'}
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Inicia sesión para solicitar
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Catalog;
