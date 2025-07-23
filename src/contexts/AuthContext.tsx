import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, LoginCredentials, RegisterData } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    const checkAuthState = async () => {
      const token = localStorage.getItem('token');
      console.log('Token en localStorage:', token);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Response status:', response.status);
        const responseData = await response.json();
        console.log('Perfil desde backend:', responseData);

        if (!response.ok || !responseData.success) throw new Error('Token inválido');

        const userData = responseData.data;

        const authUser: AuthUser = {
          id: userData.id,
          nombre: userData.nombre || userData.name || userData.username || userData.email,
          email: userData.email,
          tipo: userData.role || userData.tipo || 'estudiante',
          avatar: userData.avatar,
          token,
        };
        setUser(authUser);
      } catch (error) {
        console.error('Error validando token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      
      // 🧪 SISTEMA DE LOGIN DE PRUEBA - Para testing sin backend
      const testUsers = [
        { email: 'admin2@bibliotec.com', password: 'admin123', tipo: 'admin', nombre: 'Administrador Principal' },
        { email: 'usuario@test.com', password: 'user123', tipo: 'estudiante', nombre: 'Usuario de Prueba' },
        { email: 'admin@test.com', password: 'admin123', tipo: 'admin', nombre: 'Admin Test' }
      ];

      const testUser = testUsers.find(user => 
        user.email === credentials.username && user.password === credentials.password
      );

      if (testUser) {
        console.log('🎯 LOGIN DE PRUEBA exitoso para:', testUser.email);
        
        const authUser: AuthUser = {
          id: String(Math.floor(Math.random() * 1000)),
          nombre: testUser.nombre,
          email: testUser.email,
          tipo: testUser.tipo as 'estudiante' | 'admin' | 'profesor' | 'bibliotecario',
          avatar: undefined,
          token: 'test-token-' + Date.now(),
        };

        setUser(authUser);
        localStorage.setItem('token', authUser.token);
        localStorage.setItem('user', JSON.stringify(authUser));
        
        console.log('✅ Usuario logueado como:', authUser.tipo, '- Email:', authUser.email);
        return true;
      }

      // Si no es usuario de prueba, intentar con backend real
      const loginData = {
        username: credentials.username, // El campo username del frontend se mapea a email del backend
        password: credentials.password
      };
      
      // Petición real a tu backend
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      console.log('Response from backend:', data); // Para debug

      if (response.ok && data.success) {
        // Ajustar para la estructura real de tu backend
        const userData = data.data || data.user || data;
        const token = data.data?.access_token || data.access_token || data.token;

        // Determinar el tipo de usuario basado en email o campo específico
        let userType: 'estudiante' | 'admin' | 'profesor' | 'bibliotecario' = 'estudiante';
        
        // Prioridad 1: Campo role del backend
        if (userData.role) {
          userType = userData.role as 'estudiante' | 'admin' | 'profesor' | 'bibliotecario';
        } 
        // Prioridad 2: Campo tipo del backend
        else if (userData.tipo) {
          userType = userData.tipo as 'estudiante' | 'admin' | 'profesor' | 'bibliotecario';
        } 
        // Prioridad 3: Detectar por email específico
        else if (userData.email === 'admin2@bibliotec.com' || userData.email?.includes('admin')) {
          userType = 'admin';
        }

        console.log('Tipo de usuario detectado:', userType, 'para email:', userData.email); // Para debug

        const authUser: AuthUser = {
          id: userData.id,
          nombre: userData.nombre || userData.name || userData.username || userData.email,
          email: userData.email,
          tipo: userType,
          avatar: userData.avatar,
          token: token,
        };

        setUser(authUser);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(authUser));
        
        console.log('User logged in as:', authUser.tipo, authUser.email); // Para debug
        return true;
      } else {
        throw new Error(data.message || 'Error en el login');
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      console.log('💡 USUARIOS DE PRUEBA DISPONIBLES:');
      console.log('📧 admin2@bibliotec.com / 🔑 admin123 (Administrador)');
      console.log('📧 usuario@test.com / 🔑 user123 (Usuario)');
      console.log('📧 admin@test.com / 🔑 admin123 (Admin)');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Petición real a tu backend
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        // Ajustar para la estructura real de tu backend
        const userData = responseData.data || responseData.user || responseData;
        const token = responseData.data?.access_token || responseData.access_token || responseData.token;

        // Prioridad: role, tipo, default estudiante
        let tipo: 'estudiante' | 'admin' | 'profesor' | 'bibliotecario' = 'estudiante';
        if (userData.role) {
          tipo = userData.role;
        } else if (userData.tipo) {
          tipo = userData.tipo;
        }

        const authUser: AuthUser = {
          id: userData.id,
          nombre: userData.nombre || userData.name || userData.username || userData.email,
          email: userData.email,
          tipo,
          avatar: userData.avatar,
          token: token,
        };

        setUser(authUser);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(authUser));
        return true;
      } else {
        throw new Error(responseData.message || 'Error en el registro');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAdmin = (): boolean => {
    console.log('Checking if user is admin:', user?.tipo, user?.email); // Para debug
    return user?.tipo === 'admin' || user?.tipo === 'bibliotecario';
  };

  const isAuthenticated = (): boolean => {
    return user !== null;
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
