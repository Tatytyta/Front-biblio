import React, { useEffect, useState } from 'react';
import { actividadService } from '../services/api';

interface Actividad { id: string; usuario: string; accion: string; fecha: string; }

const ActividadSection: React.FC = () => {
  const [actividad, setActividad] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ usuario: '', accion: '', fecha: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchActividad = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await actividadService.getActividades();
      let actividadArray = [];
      if (Array.isArray(response)) {
        actividadArray = response;
      } else if (response?.data?.items && Array.isArray(response.data.items)) {
        actividadArray = response.data.items;
      } else if (Array.isArray(response?.data)) {
        actividadArray = response.data;
      } else if (Array.isArray(response?.items)) {
        actividadArray = response.items;
      } else if (Array.isArray(response?.actividades)) {
        actividadArray = response.actividades;
      }
      setActividad(actividadArray);
    } catch {
      setActividad([]);
      setError('Error al cargar actividad');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchActividad(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (editId) {
        // Para actualizar, se requiere el idUsuario y el id del evento
        await actividadService.actualizarEventoUsuario(form.usuario, editId, form);
        setSuccess('Actividad actualizada con éxito');
      } else {
        // Para crear, se requiere el idUsuario
        await actividadService.registrarActividad(form.usuario, form);
        setSuccess('Actividad agregada con éxito');
      }
      setForm({ usuario: '', accion: '', fecha: '' });
      setEditId(null);
      fetchActividad();
    } catch {
      setError('Error al guardar actividad');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await actividadService.eliminarActividad(id);
      setSuccess('Actividad eliminada con éxito');
      fetchActividad();
    } catch {
      setError('Error al eliminar actividad');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (a: Actividad) => {
    setForm({ usuario: a.usuario, accion: a.accion, fecha: a.fecha });
    setEditId(a.id);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>Actividad Usuario</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
        <input placeholder="Usuario" value={form.usuario} onChange={ev => setForm(f => ({ ...f, usuario: ev.target.value }))} required />
        <input placeholder="Acción" value={form.accion} onChange={ev => setForm(f => ({ ...f, accion: ev.target.value }))} required />
        <input placeholder="Fecha" value={form.fecha} onChange={ev => setForm(f => ({ ...f, fecha: ev.target.value }))} required />
        <button type="submit" disabled={loading}>{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ usuario: '', accion: '', fecha: '' }); }}>Cancelar</button>}
      </form>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f0ff' }}>
            <th>Usuario</th>
            <th>Acción</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {actividad.map((a: any) => (
            <tr key={a.id}>
              <td>{a.usuario}</td>
              <td>{a.accion}</td>
              <td>{a.fecha}</td>
              <td>
                <button onClick={() => handleEdit(a)} style={{ marginRight: 8, background: '#a78bfa', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Editar</button>
                <button onClick={() => handleDelete(a.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div style={{ marginTop: 16 }}>Cargando...</div>}
    </div>
  );
};

export default ActividadSection;
