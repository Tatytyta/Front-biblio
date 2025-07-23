import React, { useEffect, useState } from 'react';
import { resenasService } from '../services/api';

interface Resena { id: string; libro: string; usuario: string; texto: string; }

const ResenasSection: React.FC = () => {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ libro: '', usuario: '', texto: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchResenas = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await resenasService.getResenas();
      let resenasArray = [];
      if (Array.isArray(response)) {
        resenasArray = response;
      } else if (response?.data?.items && Array.isArray(response.data.items)) {
        resenasArray = response.data.items;
      } else if (Array.isArray(response?.data)) {
        resenasArray = response.data;
      } else if (Array.isArray(response?.items)) {
        resenasArray = response.items;
      } else if (Array.isArray(response?.resenas)) {
        resenasArray = response.resenas;
      }
      setResenas(resenasArray);
    } catch {
      setResenas([]);
      setError('Error al cargar reseñas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResenas(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (editId) {
        await resenasService.updateResena(editId, form);
        setSuccess('Reseña actualizada con éxito');
      } else {
        await resenasService.createResena(form);
        setSuccess('Reseña agregada con éxito');
      }
      setForm({ libro: '', usuario: '', texto: '' });
      setEditId(null);
      fetchResenas();
    } catch {
      setError('Error al guardar reseña');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await resenasService.deleteResena(id);
      setSuccess('Reseña eliminada con éxito');
      fetchResenas();
    } catch {
      setError('Error al eliminar reseña');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (r: Resena) => {
    setForm({ libro: r.libro, usuario: r.usuario, texto: r.texto });
    setEditId(r.id);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>Reseñas</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
        <input placeholder="Libro" value={form.libro} onChange={ev => setForm(f => ({ ...f, libro: ev.target.value }))} required />
        <input placeholder="Usuario" value={form.usuario} onChange={ev => setForm(f => ({ ...f, usuario: ev.target.value }))} required />
        <input placeholder="Texto" value={form.texto} onChange={ev => setForm(f => ({ ...f, texto: ev.target.value }))} required />
        <button type="submit" disabled={loading}>{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ libro: '', usuario: '', texto: '' }); }}>Cancelar</button>}
      </form>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f0ff' }}>
            <th>Libro</th>
            <th>Usuario</th>
            <th>Texto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {resenas.map((r: any) => (
            <tr key={r.id}>
              <td>{r.libro}</td>
              <td>{r.usuario}</td>
              <td>{r.texto}</td>
              <td>
                <button onClick={() => handleEdit(r)} style={{ marginRight: 8, background: '#a78bfa', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Editar</button>
                <button onClick={() => handleDelete(r.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div style={{ marginTop: 16 }}>Cargando...</div>}
    </div>
  );
};

export default ResenasSection;
