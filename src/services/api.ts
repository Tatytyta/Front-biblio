import axios from 'axios';
import { LibroQueryParams } from '../types';

const API_URL = 'http://localhost:3001/auth';

export const api = {
  auth: {
    login: async (data: { email: string; password: string }) => {
      const res = await axios.post(`${API_URL}/login`, data);
      return res.data.data;
    },
    register: async (data: any) => {
      const res = await axios.post(`${API_URL}/register`, data);
      return res.data.data;
    },
    getProfile: async (token: string) => {
      const res = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    }
  }
};

const API_URL_V2 = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Función helper para manejar las peticiones (con autenticación)
export const apiRequest = async (
  endpoint: string,
  method: string = 'GET',
  data?: any
) => {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL_V2}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error de conexión' }));
    throw new Error(errorData.message || `Error: ${response.status}`);
  }

  return response.json();
};

// Función helper para peticiones públicas (sin autenticación)
const publicApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_URL_V2}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error de conexión' }));
    throw new Error(errorData.message || `Error: ${response.status}`);
  }

  return response.json();
};

// Servicios de Libros
export const librosService = {
  getLibros: async (params?: LibroQueryParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.categoria) searchParams.append('categoria', params.categoria);
      if (params.busqueda) searchParams.append('busqueda', params.busqueda);
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
    }

    const queryString = searchParams.toString();
    return apiRequest(`/libros${queryString ? `?${queryString}` : ''}`);
  },

  getLibroById: async (id: string) => {
    return apiRequest(`/libros/${id}`);
  },

  createLibro: async (libro: any) => {
    return apiRequest('/libros', 'POST', libro);
  },

  updateLibro: async (id: string, libro: any) => {
    return apiRequest(`/libros/${id}`, 'PUT', libro);
  },

  deleteLibro: async (id: string) => {
    return apiRequest(`/libros/${id}`, 'DELETE');
  },
};

// Servicios de Categorías
export const categoriasService = {
  getCategorias: async () => {
    return apiRequest('/categorias');
  },

  createCategoria: async (categoria: any) => {
    return apiRequest('/categorias', 'POST', categoria);
  },

  updateCategoria: async (id: string, categoria: any) => {
    return apiRequest(`/categorias/${id}`, 'PUT', categoria);
  },

  deleteCategoria: async (id: string) => {
    return apiRequest(`/categorias/${id}`, 'DELETE');
  },
};

// Servicios de Préstamos
export const prestamosService = {
  getMisPrestamos: async () => {
    return apiRequest('/prestamos/mis-prestamos');
  },

  getAllPrestamos: async () => {
    return apiRequest('/prestamos');
  },

  createPrestamo: async (libroId: string) => {
    return apiRequest('/prestamos', 'POST', { libroId });
  },

  devolverLibro: async (prestamoId: string, data: { fechaDevolucionReal: string, observaciones?: string }) => {
    return apiRequest(`/prestamos/${prestamoId}/devolver`, 'PATCH', data);
  },

  renovarPrestamo: async (prestamoId: string, data: { fechaDevolucionEstimada: string, observaciones?: string }) => {
    return apiRequest(`/prestamos/${prestamoId}/renovar`, 'PATCH', data);
  },
};

// Servicios de Usuarios (solo admin)
export const usuariosService = {
  getUsuarios: async () => {
    return apiRequest('/usuarios');
  },

  getUsuarioById: async (id: string) => {
    return apiRequest(`/usuarios/${id}`);
  },

  createUsuario: async (usuario: any) => {
    return apiRequest('/usuarios', 'POST', usuario);
  },

  updateUsuario: async (id: string, usuario: any) => {
    return apiRequest(`/usuarios/${id}`, 'PUT', usuario);
  },

  deleteUsuario: async (id: string) => {
    return apiRequest(`/usuarios/${id}`, 'DELETE');
  },

  toggleUsuarioStatus: async (id: string) => {
    return apiRequest(`/usuarios/${id}/toggle-status`, 'PUT');
  },
};

// Servicios de Dashboard
export const dashboardService = {
  getStats: async () => {
    return apiRequest('/dashboard/stats');
  },

  getUserDashboard: async () => {
    return apiRequest('/dashboard/user');
  },

  getAdminDashboard: async () => {
    return apiRequest('/dashboard/admin');
  },
};

// Servicios de Perfil
export const perfilService = {
  getPerfil: async () => {
    return apiRequest('/perfil');
  },

  updatePerfil: async (perfil: any) => {
    return apiRequest('/perfil', 'PUT', perfil);
  },

  cambiarPassword: async (passwordData: {
    passwordActual: string;
    passwordNuevo: string;
  }) => {
    return apiRequest('/perfil/cambiar-password', 'PUT', passwordData);
  },
};

// Servicios Públicos (sin autenticación)
export const publicLibrosService = {
  getLibrosPublicos: async (params?: {
    categoria?: string;
    busqueda?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.categoria) searchParams.append('categoria', params.categoria);
      if (params.busqueda) searchParams.append('busqueda', params.busqueda);
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
    }

    const queryString = searchParams.toString();
    return publicApiRequest(`/libros/publicos${queryString ? `?${queryString}` : ''}`);
  },

  getLibroPublicoById: async (id: string) => {
    return publicApiRequest(`/libros/publicos/${id}`);
  },
};

export const publicCategoriasService = {
  getCategoriasPublicas: async () => {
    return publicApiRequest('/categorias/publicas');
  },
};

export const actividadService = {
  getActividades: async (params?: any) => {
    const searchParams = new URLSearchParams(params || {}).toString();
    return apiRequest(`/actividad-usuarios${searchParams ? `?${searchParams}` : ''}`);
  },

  getActividadUsuario: async (idUsuario: string, params?: any) => {
    const searchParams = new URLSearchParams(params || {}).toString();
    return apiRequest(`/actividad-usuarios/usuario/${idUsuario}${searchParams ? `?${searchParams}` : ''}`);
  },

  registrarActividad: async (idUsuario: string, data: any) => {
    return apiRequest(`/actividad-usuarios/${idUsuario}`, 'POST', data);
  },

  actualizarEventoUsuario: async (idUsuario: string, eventoId: string, data: any) => {
    return apiRequest(`/actividad-usuarios/usuario/${idUsuario}/evento/${eventoId}`, 'PUT', data);
  },

  eliminarActividad: async (id: string) => {
    return apiRequest(`/actividad-usuarios/${id}`, 'DELETE');
  },

  eliminarEventoUsuario: async (idUsuario: string, eventoId: string) => {
    return apiRequest(`/actividad-usuarios/usuario/${idUsuario}/evento/${eventoId}`, 'DELETE');
  },

  getEstadisticasGlobales: async (params?: any) => {
    const searchParams = new URLSearchParams(params || {}).toString();
    return apiRequest(`/actividad-usuarios/estadisticas${searchParams ? `?${searchParams}` : ''}`);
  },

  limpiarAntiguas: async (diasAntiguedad?: number) => {
    return apiRequest(`/actividad-usuarios/limpiar-antiguas`, 'POST', { diasAntiguedad });
  },
};

export const generosService = {
  getGeneros: async () => {
    const res = await apiRequest('/generos');
    // La estructura que recibes es:
    // { success: true, message: "Operación exitosa", data: { message: "...", data: [...] } }
    // Queremos devolver solo el array de géneros:
    return res?.data?.data || [];
  },

  createGenero: async (genero: any) => apiRequest('/generos', 'POST', genero),

  updateGenero: async (id: string, genero: any) => apiRequest(`/generos/${id}`, 'PUT', genero),

  deleteGenero: async (id: string) => apiRequest(`/generos/${id}`, 'DELETE'),
};

export const estanteriasService = {
  getEstanterias: async () => {
    const res = await apiRequest('/estanterias');
    // Extraemos el array dentro de data.items para devolver solo el array de estanterías
    return res?.data?.items || [];
  },

  createEstanteria: async (estanteria: any) =>
    apiRequest('/estanterias', 'POST', estanteria),

  updateEstanteria: async (id: string, estanteria: any) =>
    apiRequest(`/estanterias/${id}`, 'PUT', estanteria),

  deleteEstanteria: async (id: string) =>
    apiRequest(`/estanterias/${id}`, 'DELETE'),
};

export const resenasService = {
  getResenas: async () => apiRequest('/resenas'),

  createResena: async (resena: any) =>
    apiRequest('/resenas', 'POST', resena),

  updateResena: async (id: string, resena: any) =>
    apiRequest(`/resenas/${id}`, 'PUT', resena),

  deleteResena: async (id: string) =>
    apiRequest(`/resenas/${id}`, 'DELETE'),
};
