import React, { useEffect, useState } from 'react';
import { resenasService } from '../services/api';

interface Resena {
  id: string;
  idLibro: number;
  idUsuario: number;
  comentario: string;
  calificacion?: number;
}

const ResenasSection: React.FC = () => {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    idLibro: '',
    idUsuario: '',
    comentario: '',
    calificacion: '5',
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchResenas = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await resenasService.getResenas();
      const items = response?.data?.items || [];
      setResenas(items);
    } catch (e) {
      console.error(e);
      setResenas([]);
      setError('Error al cargar reseñas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResenas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const resenaData = {
        idLibro: parseInt(form.idLibro),
        idUsuario: parseInt(form.idUsuario),
        comentario: form.comentario,
        calificacion: parseInt(form.calificacion),
      };

      if (editId) {
        await resenasService.updateResena(editId, resenaData);
        setSuccess('Reseña actualizada con éxito');
      } else {
        await resenasService.createResena(resenaData);
        setSuccess('Reseña agregada con éxito');
      }

      setForm({ idLibro: '', idUsuario: '', comentario: '', calificacion: '5' });
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
    setForm({
      idLibro: r.idLibro.toString(),
      idUsuario: r.idUsuario.toString(),
      comentario: r.comentario,
      calificacion: r.calificacion?.toString() || '5',
    });
    setEditId(r.id);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>Reseñas</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
        <input placeholder="ID Libro" value={form.idLibro} onChange={ev => setForm(f => ({ ...f, idLibro: ev.target.value }))} required />
        <input placeholder="ID Usuario" value={form.idUsuario} onChange={ev => setForm(f => ({ ...f, idUsuario: ev.target.value }))} required />
        <input placeholder="Comentario" value={form.comentario} onChange={ev => setForm(f => ({ ...f, comentario: ev.target.value }))} required />
        <input type="number" min={1} max={5} placeholder="Calificación" value={form.calificacion} onChange={ev => setForm(f => ({ ...f, calificacion: ev.target.value }))} required />
        <button type="submit" disabled={loading}>{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && (
          <button type="button" onClick={() => {
            setEditId(null);
            setForm({ idLibro: '', idUsuario: '', comentario: '', calificacion: '5' });
          }}>
            Cancelar
          </button>
        )}
      </form>

      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f0ff' }}>
            <th>ID Libro</th>
            <th>ID Usuario</th>
            <th>Comentario</th>
            <th>Calificación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {resenas.map((r) => (
            <tr key={r.id}>
              <td>{r.idLibro}</td>
              <td>{r.idUsuario}</td>
              <td>{r.comentario}</td>
              <td>{r.calificacion}</td>
              <td>
                <button onClick={() => handleEdit(r)} style={{ marginRight: 8 }}>Editar</button>
                <button onClick={() => handleDelete(r.id)}>Eliminar</button>
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
