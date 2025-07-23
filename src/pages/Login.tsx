import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.auth.login({ username, password });
      console.log('🟢 Login response:', res);

      if (res && res.access_token) {
        localStorage.setItem('token', res.access_token);

        const profile = await api.auth.getProfile(res.access_token);
        console.log('🟢 Profile response:', profile);

        if (profile.role === 'administrador' || profile.role === 'admin' || profile.role === 'bibliotecario') {
          console.log('🔁 Redirigiendo a /admin/dashboard');
          navigate('/admin/dashboard');
        } else {
          console.log('🔁 Redirigiendo a /dashboard');
          navigate('/dashboard');
        }
      } else {
        setError('Credenciales inválidas.');
      }
    } catch (err: any) {
      console.error('🔴 Error en el login:', err);
      setError(err?.message || 'Error en el login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center' }}>
      <h2>Iniciar Sesión</h2>
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        style={{ marginBottom: 10, width: '100%', padding: 8 }}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{ marginBottom: 10, width: '100%', padding: 8 }}
      />
      <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </form>
  );
};

export default Login;
