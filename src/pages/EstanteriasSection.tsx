import React, { useEffect, useState } from 'react';
import { estanteriasService } from '../services/api';

interface Estanteria {
  id: number;
  codigo: string;
  ubicacion: string;
  capacidad: number;
  descripcion: string;
}

const EstanteriasSection: React.FC = () => {
  const [estanterias, setEstanterias] = useState<Estanteria[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    codigo: '',
    ubicacion: '',
    capacidad: 0,
    descripcion: ''
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchEstanterias = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await estanteriasService.getEstanterias();
      let estanteriasArray: Estanteria[] = [];
      if (Array.isArray(response)) {
        estanteriasArray = response;
      } else if (response?.data?.items && Array.isArray(response.data.items)) {
        estanteriasArray = response.data.items;
      } else if (Array.isArray(response?.data)) {
        estanteriasArray = response.data;
      } else if (Array.isArray(response?.items)) {
        estanteriasArray = response.items;
      } else if (Array.isArray(response?.estanterias)) {
        estanteriasArray = response.estanterias;
      }
      setEstanterias(estanteriasArray);
    } catch {
      setEstanterias([]);
      setError('Error al cargar estanterías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEstanterias(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (editId !== null) {
        await estanteriasService.updateEstanteria(String(editId), form);
        setSuccess('Estantería actualizada con éxito');
      } else {
        await estanteriasService.createEstanteria(form);
        setSuccess('Estantería creada con éxito');
      }
      setForm({ codigo: '', ubicacion: '', capacidad: 0, descripcion: '' });
      setEditId(null);
      fetchEstanterias();
    } catch {
      setError('Error al guardar estantería');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await estanteriasService.deleteEstanteria(String(id));
      setSuccess('Estantería eliminada con éxito');
      fetchEstanterias();
    } catch {
      setError('Error al eliminar estantería');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (e: Estanteria) => {
    setForm({
      codigo: e.codigo,
      ubicacion: e.ubicacion,
      capacidad: e.capacidad,
      descripcion: e.descripcion
    });
    setEditId(e.id); // id es number, correcto
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>Estanterías</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input placeholder="Código" value={form.codigo} onChange={ev => setForm(f => ({ ...f, codigo: ev.target.value }))} required />
        <input placeholder="Ubicación" value={form.ubicacion} onChange={ev => setForm(f => ({ ...f, ubicacion: ev.target.value }))} required />
        <input placeholder="Capacidad" type="number" value={form.capacidad} onChange={ev => setForm(f => ({ ...f, capacidad: Number(ev.target.value) }))} required />
        <input placeholder="Descripción" value={form.descripcion} onChange={ev => setForm(f => ({ ...f, descripcion: ev.target.value }))} required />
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading}>{editId !== null ? 'Actualizar' : 'Agregar'}</button>
          {editId !== null && (
            <button type="button" onClick={() => {
              setEditId(null);
              setForm({ codigo: '', ubicacion: '', capacidad: 0, descripcion: '' });
            }}>Cancelar</button>
          )}
        </div>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f0ff' }}>
            <th>Código</th>
            <th>Ubicación</th>
            <th>Capacidad</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estanterias.map((e: Estanteria) => (
            <tr key={e.id}>
              <td>{e.codigo}</td>
              <td>{e.ubicacion}</td>
              <td>{e.capacidad}</td>
              <td>{e.descripcion}</td>
              <td>
                <button onClick={() => handleEdit(e)} style={{ marginRight: 8, background: '#a78bfa', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Editar</button>
                <button onClick={() => handleDelete(e.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div style={{ marginTop: 16 }}>Cargando...</div>}
    </div>
  );
};

export default EstanteriasSection;
