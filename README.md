# Biblioteca Sandra - Frontend

Sistema de gestión de biblioteca con React, TypeScript y Tailwind CSS.

## 🚀 Estructura de Rutas

### Rutas Públicas (No requieren autenticación)
- `/` - Página de inicio (LandingPage)
- `/login` - Inicio de sesión
- `/register` - Registro de usuarios

### Rutas Protegidas (Requieren autenticación)
- `/dashboard` - Panel principal del usuario
- `/catalog` - Catálogo de libros
- `/my-books` - Mis libros prestados
- `/profile` - Perfil del usuario

### Rutas de Administrador (Requieren rol admin)
- `/admin` - Panel de administración principal
- `/admin/dashboard` - Dashboard del administrador
- `/admin/libros` - Gestión de libros
- `/admin/usuarios` - Gestión de usuarios
- `/admin/prestamos` - Gestión de préstamos

### Otras Rutas
- `/404` - Página no encontrada
- `*` - Cualquier ruta no definida redirige a 404

## 🔧 Configuración del Backend

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# URL del backend
VITE_API_URL=http://localhost:3001

# Otras variables opcionales
VITE_APP_NAME=Biblioteca Sandra
VITE_APP_VERSION=1.0.0
```

### Endpoints del Backend Requeridos

El frontend espera que tu backend tenga los siguientes endpoints:

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

#### Libros
- `GET /api/libros` - Obtener libros (con filtros opcionales)
- `GET /api/libros/:id` - Obtener libro por ID
- `POST /api/libros` - Crear libro (admin)
- `PUT /api/libros/:id` - Actualizar libro (admin)
- `DELETE /api/libros/:id` - Eliminar libro (admin)

#### Categorías
- `GET /api/categorias` - Obtener categorías
- `POST /api/categorias` - Crear categoría (admin)
- `PUT /api/categorias/:id` - Actualizar categoría (admin)
- `DELETE /api/categorias/:id` - Eliminar categoría (admin)

#### Préstamos
- `GET /api/prestamos/mis-prestamos` - Préstamos del usuario actual
- `GET /api/prestamos` - Todos los préstamos (admin)
- `POST /api/prestamos` - Crear préstamo
- `PUT /api/prestamos/:id/devolver` - Devolver libro
- `PUT /api/prestamos/:id/renovar` - Renovar préstamo

#### Usuarios (Admin)
- `GET /api/usuarios` - Obtener usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario
- `PUT /api/usuarios/:id/toggle-status` - Activar/Desactivar usuario

#### Dashboard
- `GET /api/dashboard/stats` - Estadísticas generales
- `GET /api/dashboard/user` - Dashboard del usuario
- `GET /api/dashboard/admin` - Dashboard del admin

#### Perfil
- `GET /api/perfil` - Obtener perfil del usuario
- `PUT /api/perfil` - Actualizar perfil
- `PUT /api/perfil/cambiar-password` - Cambiar contraseña

## 📝 Estructura de Datos

### Usuario
```typescript
interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  tipo: 'estudiante' | 'profesor' | 'bibliotecario' | 'admin';
  avatar?: string;
  token: string;
}
```

### Libro
```typescript
interface Libro {
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
}
```

### Préstamo
```typescript
interface Prestamo {
  id: string;
  libroId: string;
  usuarioId: string;
  fechaPrestamo: string;
  fechaDevolucion?: string;
  fechaVencimiento: string;
  estado: 'activo' | 'devuelto' | 'vencido';
  renovaciones: number;
}
```

## 🔒 Autenticación

### Headers Requeridos
Todas las rutas protegidas deben incluir el token de autenticación:

```javascript
Authorization: Bearer <token>
```

### Respuesta de Login/Register
```json
{
  "user": {
    "id": "1",
    "nombre": "Usuario",
    "email": "usuario@email.com",
    "tipo": "estudiante"
  },
  "token": "jwt-token-here"
}
```

## 🎨 Características

- ✅ Autenticación completa con JWT
- ✅ Rutas públicas y privadas
- ✅ Panel de administración
- ✅ Gestión de libros, usuarios y préstamos
- ✅ Catálogo con filtros y búsqueda
- ✅ Dashboard personalizado por rol
- ✅ Diseño responsive con Tailwind CSS
- ✅ Manejo de errores con alertas
- ✅ Hooks personalizados para API

## 🚀 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📂 Estructura del Proyecto

```
src/
├── components/         # Componentes reutilizables
│   ├── Alert.tsx
│   ├── LandingPage.tsx
│   └── ProtectedRoute.tsx
├── contexts/          # Contextos de React
│   └── AuthContext.tsx
├── hooks/             # Hooks personalizados
│   └── useApi.ts
├── pages/             # Páginas principales
│   ├── AdminDashboard.tsx
│   ├── Catalog.tsx
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── NotFound.tsx
│   └── Register.tsx
├── services/          # Servicios de API
│   ├── api.ts
│   └── mockAuth.ts
├── types/             # Definiciones de tipos
│   └── index.ts
├── App.css           # Estilos globales
├── App.tsx           # Componente principal
└── main.tsx          # Punto de entrada
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.
