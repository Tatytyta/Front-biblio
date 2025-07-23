import React, { useEffect, useState } from 'react';
import { generosService } from '../services/api';

const GenerosSection: React.FC = () => {
  const [generos, setGeneros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nombre: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchGeneros = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await generosService.getGeneros();
      let generosArray = [];
      if (Array.isArray(response)) {
        generosArray = response;
      } else if (response?.data?.items && Array.isArray(response.data.items)) {
        generosArray = response.data.items;
      } else if (Array.isArray(response?.data)) {
        generosArray = response.data;
      } else if (Array.isArray(response?.items)) {
        generosArray = response.items;
      } else if (Array.isArray(response?.generos)) {
        generosArray = response.generos;
      }
      setGeneros(generosArray);
    } catch {
      setGeneros([]);
      setError('Error al cargar géneros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGeneros(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (editId) {
        await generosService.updateGenero(editId, form);
        setSuccess('Género actualizado con éxito');
      } else {
        await generosService.createGenero(form);
        setSuccess('Género agregado con éxito');
      }
      setForm({ nombre: '' });
      setEditId(null);
      fetchGeneros();
    } catch {
      setError('Error al guardar género');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await generosService.deleteGenero(id);
      setSuccess('Género eliminado con éxito');
      fetchGeneros();
    } catch {
      setError('Error al eliminar género');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (g: any) => {
    setForm({ nombre: g.nombre });
    setEditId(g.id);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>Géneros</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
        <input placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} required />
        <button type="submit" disabled={loading}>{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nombre: '' }); }}>Cancelar</button>}
      </form>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f0ff' }}>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {generos.map((g: any) => (
            <tr key={g.id}>
              <td>{g.nombre}</td>
              <td>
                <button onClick={() => handleEdit(g)} style={{ marginRight: 8, background: '#a78bfa', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Editar</button>
                <button onClick={() => handleDelete(g.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div style={{ marginTop: 16 }}>Cargando...</div>}
    </div>
  );
};

export default GenerosSection;
