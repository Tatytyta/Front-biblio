export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  isbn: string;
  categoria: string;
  ubicacion: string;
  disponible: boolean;
  fechaPublicacion: string;
  descripcion: string;
  stock: number;
  stockDisponible: number;
  portada?: string;
  rating?: number;
  estanteriaId?: string;
  generoId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LibroQueryParams {
  categoria?: string;
  busqueda?: string;
  page?: number;
  limit?: number;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  fechaRegistro: string;
  activo: boolean;
  tipo: 'estudiante' | 'profesor' | 'bibliotecario' | 'admin';
  avatar?: string;
  username?: string;
  role?: string;
  tokenVersion?: number;
  createdAt?: string;
  updatedAt?: string;
  librosPrestados?: Libro[];
}

export interface Prestamo {
  id: string;
  libroId: string;
  usuarioId: string;
  fechaPrestamo: string;
  fechaDevolucion?: string;
  fechaVencimiento: string;
  estado: 'activo' | 'devuelto' | 'vencido';
  renovaciones: number;
  libro?: Libro;
  usuario?: Usuario;
  createdAt?: string;
  updatedAt?: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  totalLibros: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Genero {
  id: string;
  nombre: string;
  descripcion: string;
  icono?: string;
  color?: string;
  totalLibros?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Estanteria {
  id: string;
  codigo: string;
  ubicacion: string;
  descripcion?: string;
  capacidad: number;
  librosActuales: number;
  seccion?: string;
  piso?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Resena {
  id: string;
  libroId: string;
  usuarioId: string;
  calificacion: number; // 1-5 estrellas
  comentario: string;
  fechaResena: string;
  aprobada: boolean;
  libro?: Libro;
  usuario?: Usuario;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActividadUsuario {
  id: string;
  usuarioId: string;
  tipo: 'login' | 'logout' | 'prestamo' | 'devolucion' | 'busqueda' | 'resena' | 'registro';
  descripcion: string;
  fecha: string;
  detalles?: any;
  ipAddress?: string;
  userAgent?: string;
  usuario?: Usuario;
  createdAt?: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  disponible: boolean;
  horario?: string;
}

export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  tipo: 'estudiante' | 'profesor' | 'bibliotecario' | 'admin' | 'administrador';
  avatar?: string;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  tipo: 'estudiante' | 'profesor';
  username?: string;
}

// Interfaces para formularios y DTOs
export interface LibroFormData {
  titulo: string;
  autor: string;
  isbn: string;
  categoria: string;
  ubicacion: string;
  fechaPublicacion: string;
  descripcion: string;
  stock: number;
  estanteriaId?: string;
  generoId?: string;
  portada?: string;
  generos: string[];
}

export interface PrestamoFormData {
  libroId: string;
  usuarioId: string;
  fechaVencimiento: string;
}

export interface ResenaFormData {
  id?: string;
  libroId: string;
  calificacion: number;
  comentario: string;
}

export interface EstanteriaFormData {
  codigo: string;
  ubicacion: string;
  descripcion?: string;
  capacidad: number;
  seccion?: string;
  piso?: number;
}

export interface GeneroFormData {
  nombre: string;
  descripcion: string;
  icono?: string;
  color?: string;
  estanteriaId: string;
}

// Interfaces para responses de API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filtros y búsqueda
export interface FiltroLibros {
  busqueda?: string;
  categoria?: string;
  genero?: string;
  autor?: string;
  disponible?: boolean;
  estanteria?: string;
  ordenarPor?: 'titulo' | 'autor' | 'fechaPublicacion' | 'rating';
  orden?: 'asc' | 'desc';
}

export interface FiltroPrestamos {
  estado?: 'activo' | 'devuelto' | 'vencido';
  usuario?: string;
  libro?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  vencidos?: boolean;
}

export interface FiltroUsuarios {
  busqueda?: string;
  tipo?: 'estudiante' | 'profesor' | 'bibliotecario' | 'admin';
  activo?: boolean;
  fechaRegistroDesde?: string;
  fechaRegistroHasta?: string;
}
