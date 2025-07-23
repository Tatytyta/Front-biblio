import React, { useEffect, useState } from 'react';
import { usuariosService } from '../services/api';

const UsuariosSection: React.FC = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', tipo: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // GET usuarios
  const fetchUsuarios = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await usuariosService.getUsuarios();
      let usuariosArray = [];
      if (Array.isArray(response)) {
        usuariosArray = response;
      } else if (response?.data?.items && Array.isArray(response.data.items)) {
        usuariosArray = response.data.items;
      } else if (Array.isArray(response?.data)) {
        usuariosArray = response.data;
      } else if (Array.isArray(response?.items)) {
        usuariosArray = response.items;
      } else if (Array.isArray(response?.usuarios)) {
        usuariosArray = response.usuarios;
      }
      setUsuarios(usuariosArray);
    } catch (err: any) {
      setUsuarios([]);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // POST/PUT usuario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (editId) {
        await usuariosService.updateUsuario(editId, form);
        setSuccess('Usuario actualizado con éxito');
      } else {
        await usuariosService.createUsuario(form);
        setSuccess('Usuario creado con éxito');
      }
      setForm({ nombre: '', email: '', tipo: '' });
      setEditId(null);
      fetchUsuarios();
    } catch (err: any) {
      setError('Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  // DELETE usuario
  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await usuariosService.deleteUsuario(id);
      setSuccess('Usuario eliminado con éxito');
      fetchUsuarios();
    } catch (err: any) {
      setError('Error al eliminar usuario');
    } finally {
      setLoading(false);
    }
  };

  // Editar usuario
  const handleEdit = (usuario: any) => {
    setForm({ nombre: usuario.nombre, email: usuario.email, tipo: usuario.tipo });
    setEditId(usuario.id);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>Usuarios</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
        <input placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} required />
        <input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
        <input placeholder="Tipo" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))} required />
        <button type="submit" disabled={loading}>{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nombre: '', email: '', tipo: '' }); }}>Cancelar</button>}
      </form>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f0ff' }}>
            <th>Nombre</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(usuarios) && usuarios.length > 0 ? usuarios.map((usuario: any) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.email}</td>
              <td>{usuario.tipo}</td>
              <td>
                <button onClick={() => handleEdit(usuario)} style={{ marginRight: 8, background: '#a78bfa', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Editar</button>
                <button onClick={() => handleDelete(usuario.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Eliminar</button>
              </td>
            </tr>
          )) : <tr><td colSpan={4} style={{ color: '#888', textAlign: 'center' }}>No hay usuarios para mostrar.</td></tr>}
        </tbody>
      </table>
      {loading && <div style={{ marginTop: 16 }}>Cargando...</div>}
    </div>
  );
};

export default UsuariosSection;
