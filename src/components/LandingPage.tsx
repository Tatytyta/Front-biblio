import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Libro, Categoria, Servicio } from '../types';

const LandingPage: React.FC = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Datos de ejemplo
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
        rating: 4.8,
        portada: '📚'
      },
      {
        id: '2',
        titulo: 'Don Quijote de la Mancha',
        autor: 'Miguel de Cervantes',
        isbn: '978-0-14-243723-0',
        categoria: 'Clásicos',
        ubicacion: 'B-015',
        disponible: true,
        fechaPublicacion: '1605',
        descripcion: 'La novela más influyente de la literatura española.',
        stock: 4,
        stockDisponible: 3,
        rating: 4.9,
        portada: '📖'
      },
      {
        id: '3',
        titulo: 'Sapiens',
        autor: 'Yuval Noah Harari',
        isbn: '978-0-06-231609-7',
        categoria: 'Historia',
        ubicacion: 'C-032',
        disponible: true,
        fechaPublicacion: '2011',
        descripcion: 'Una breve historia de la humanidad.',
        stock: 5,
        stockDisponible: 4,
        rating: 4.7,
        portada: '🧠'
      },
      {
        id: '4',
        titulo: 'Clean Code',
        autor: 'Robert C. Martin',
        isbn: '978-0-13-235088-4',
        categoria: 'Tecnología',
        ubicacion: 'D-105',
        disponible: true,
        fechaPublicacion: '2008',
        descripcion: 'Manual de buenas prácticas para escribir código limpio.',
        stock: 2,
        stockDisponible: 1,
        rating: 4.6,
        portada: '💻'
      }
    ];

    const categoriasData: Categoria[] = [
      { id: '1', nombre: 'Literatura', descripcion: 'Novelas, cuentos y poesía', icono: '📚', color: 'bg-purple-500', totalLibros: 245 },
      { id: '2', nombre: 'Ciencia', descripcion: 'Libros científicos y técnicos', icono: '🔬', color: 'bg-green-500', totalLibros: 189 },
      { id: '3', nombre: 'Historia', descripcion: 'Eventos históricos y biografías', icono: '📜', color: 'bg-yellow-500', totalLibros: 156 },
      { id: '4', nombre: 'Tecnología', descripcion: 'Programación y desarrollo', icono: '💻', color: 'bg-blue-500', totalLibros: 134 },
      { id: '5', nombre: 'Arte', descripcion: 'Pintura, escultura y diseño', icono: '🎨', color: 'bg-pink-500', totalLibros: 98 },
      { id: '6', nombre: 'Filosofía', descripcion: 'Pensamiento y reflexión', icono: '🤔', color: 'bg-indigo-500', totalLibros: 87 }
    ];

    const serviciosData: Servicio[] = [
      { id: '1', nombre: 'Préstamo de Libros', descripcion: 'Lleva tus libros favoritos a casa', icono: '📚', disponible: true, horario: '8:00 - 20:00' },
      { id: '2', nombre: 'Salas de Estudio', descripcion: 'Espacios silenciosos para concentrarte', icono: '🪑', disponible: true, horario: '6:00 - 22:00' },
      { id: '3', nombre: 'Acceso Digital', descripcion: 'Libros electrónicos y audiobooks', icono: '📱', disponible: true, horario: '24/7' },
      { id: '4', nombre: 'Talleres', descripcion: 'Eventos educativos y culturales', icono: '🎓', disponible: true, horario: 'Consultar' },
      { id: '5', nombre: 'Impresión', descripcion: 'Servicios de impresión y escaneo', icono: '🖨️', disponible: true, horario: '8:00 - 18:00' },
      { id: '6', nombre: 'Consultoría', descripcion: 'Ayuda con investigación académica', icono: '💡', disponible: true, horario: '9:00 - 17:00' }
    ];

    setLibros(librosData);
    setCategorias(categoriasData);
    setServicios(serviciosData);
    setLoading(false);
  };

  const librosFiltrados = libros.filter(libro => 
    libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    libro.autor.toLowerCase().includes(busqueda.toLowerCase()) ||
    libro.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-bounce">📚</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Biblioteca Sandra</h2>
          <p className="text-xl text-gray-600 mb-8">Cargando el mundo del conocimiento...</p>
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
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="text-5xl animate-float">📚</div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  Biblioteca Sandra
                </h1>
                <p className="text-sm text-gray-600">Centro de Conocimiento Digital</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-all duration-300">
                Inicio
              </a>
              <a href="#catalogo" className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-all duration-300">
                Catálogo
              </a>
              <a href="#servicios" className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-all duration-300">
                Servicios
              </a>
              <a href="#contacto" className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-all duration-300">
                Contacto
              </a>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Link to="/register" className="btn btn-outline text-sm">
                Registrarse
              </Link>
              <Link to="/login" className="btn btn-primary text-sm">
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 animate-fadeInUp">
              Descubre el Mundo del
              <span className="block gradient-text">
                Conocimiento
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fadeInUp">
              Explora nuestra extensa colección de libros digitales y físicos. 
              Más de 10,000 títulos esperando ser descubiertos.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12 animate-fadeInUp">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-xl">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Buscar libros, autores, géneros..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="input-field pl-12 pr-4 py-4 text-lg rounded-xl shadow-lg"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg card-hover">
                <div className="text-4xl mb-4">📚</div>
                <div className="text-3xl font-bold text-blue-600">10,247</div>
                <div className="text-gray-600">Libros Disponibles</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg card-hover">
                <div className="text-4xl mb-4">👥</div>
                <div className="text-3xl font-bold text-purple-600">2,847</div>
                <div className="text-gray-600">Usuarios Activos</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg card-hover">
                <div className="text-4xl mb-4">🌟</div>
                <div className="text-3xl font-bold text-green-600">98%</div>
                <div className="text-gray-600">Satisfacción</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/login"
                className="btn btn-primary text-lg px-8 py-4"
              >
                Explorar Catálogo
              </Link>
              <a 
                href="#servicios"
                className="btn btn-outline text-lg px-8 py-4"
              >
                Ver Servicios
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Catalogo Section */}
      <section id="catalogo" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Nuestro Catálogo
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Explora nuestra colección organizada por categorías
            </p>
          </div>

          {/* Categorías */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {categorias.map((categoria) => (
              <div key={categoria.id} className="card card-hover p-8 text-center">
                <div className="text-6xl mb-4">{categoria.icono}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{categoria.nombre}</h3>
                <p className="text-gray-600 mb-4">{categoria.descripcion}</p>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${categoria.color}`}></div>
                  <span className="text-sm text-gray-500">{categoria.totalLibros} libros</span>
                </div>
                <Link to="/login" className="btn btn-primary w-full">
                  Explorar {categoria.nombre}
                </Link>
              </div>
            ))}
          </div>

          {/* Libros Destacados */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Libros Destacados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {librosFiltrados.slice(0, 4).map((libro) => (
                <div key={libro.id} className="card card-hover overflow-hidden">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-600 p-8 text-center">
                    <div className="text-6xl mb-4">{libro.portada}</div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{libro.titulo}</h4>
                    <p className="text-gray-600 mb-2">por {libro.autor}</p>
                    <p className="text-sm text-gray-500 mb-4">{libro.categoria}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm text-gray-600">{libro.rating}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        libro.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {libro.disponible ? 'Disponible' : 'No disponible'}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link to="/login" className="btn btn-primary flex-1 text-sm">
                        Ver Detalles
                      </Link>
                      <Link to="/login" className="btn btn-outline flex-1 text-sm">
                        Reservar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Descubre todo lo que ofrecemos para tu experiencia de aprendizaje
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((servicio) => (
              <div key={servicio.id} className="card card-hover p-8">
                <div className="text-6xl mb-6">{servicio.icono}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{servicio.nombre}</h3>
                <p className="text-gray-600 mb-4">{servicio.descripcion}</p>
                <div className="flex items-center justify-between mb-6">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    servicio.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {servicio.disponible ? 'Disponible' : 'No disponible'}
                  </div>
                  <span className="text-sm text-gray-500">{servicio.horario}</span>
                </div>
                <button className="btn btn-primary w-full">
                  Más Información
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto Section */}
      <section id="contacto" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Contáctanos
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              ¿Tienes preguntas? Estamos aquí para ayudarte
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">📍</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Dirección</h4>
                    <p className="text-gray-600">Calle Principal #123, Ciudad</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">📞</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Teléfono</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">✉️</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">info@bibliotecasandra.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">🕐</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Horarios</h4>
                    <p className="text-gray-600">Lun-Vie: 8:00-20:00</p>
                    <p className="text-gray-600">Sáb-Dom: 9:00-18:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un Mensaje</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    rows={4}
                    className="input-field"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-4xl">📚</div>
                <div>
                  <h3 className="text-2xl font-bold">Biblioteca Sandra</h3>
                  <p className="text-gray-400">Centro de Conocimiento</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Conectando mentes con conocimiento desde 1985.
              </p>
              <div className="flex space-x-4">
                <button className="text-2xl hover:text-blue-400 transition-colors">📘</button>
                <button className="text-2xl hover:text-blue-400 transition-colors">🐦</button>
                <button className="text-2xl hover:text-blue-400 transition-colors">📸</button>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Préstamo de Libros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Salas de Estudio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Recursos Digitales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Eventos</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-4">Géneros</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Literatura</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ciencia</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Historia</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tecnología</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📍 Calle Principal #123</li>
                <li>📞 +1 (555) 123-4567</li>
                <li>✉️ info@bibliotecasandra.com</li>
                <li>🕐 Lun-Vie: 8:00-20:00</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Biblioteca Sandra. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
