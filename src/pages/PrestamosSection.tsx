import React, { useEffect, useState } from 'react';
import { prestamosService } from '../services/api';

// Tipo actualizado para un préstamo
type Prestamo = {
  id: string;
  estado: string;
  libro: {
    titulo: string;
  };
  usuario: {
    username: string;
  };
};

const PrestamosSection: React.FC = () => {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ libroId: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // GET préstamos
  const fetchPrestamos = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await prestamosService.getAllPrestamos();
      console.log('Respuesta completa prestamos:', response);
      const prestamosArray = response?.data?.data?.items ?? [];
      setPrestamos(prestamosArray);
    } catch (err) {
      setPrestamos([]);
      setError('Error al cargar préstamos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestamos();
  }, []);

  // POST préstamo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await prestamosService.createPrestamo(form.libroId);
      setForm({ libroId: '' });
      setSuccess('Préstamo creado con éxito');
      fetchPrestamos();
    } catch (err: any) {
      setError('Error al crear préstamo');
    } finally {
      setLoading(false);
    }
  };

  // PUT devolver préstamo
  const handleDevolver = async (id: string) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await prestamosService.devolverLibro(id, {
        fechaDevolucionReal: new Date().toISOString().split('T')[0]
      });
      setSuccess('Préstamo devuelto con éxito');
      fetchPrestamos();
    } catch (err: any) {
      setError('Error al devolver préstamo');
    } finally {
      setLoading(false);
    }
  };

  // PUT renovar préstamo
  const handleRenovar = async (id: string) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const nuevaFecha = new Date();
      nuevaFecha.setDate(nuevaFecha.getDate() + 15);
      const fechaFormateada = nuevaFecha.toISOString().split('T')[0];

      await prestamosService.renovarPrestamo(id, {
        fechaDevolucionEstimada: fechaFormateada
      });
      setSuccess('Préstamo renovado con éxito');
      fetchPrestamos();
    } catch (err: any) {
      setError('Error al renovar préstamo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>Préstamos</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
        <input
          placeholder="ID del Libro"
          value={form.libroId}
          onChange={e => setForm(f => ({ ...f, libroId: e.target.value }))}
          required
        />
        <button type="submit" disabled={loading}>
          Crear Préstamo
        </button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f0ff' }}>
            <th>ID</th>
            <th>Libro</th>
            <th>Usuario</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.libro?.titulo ?? '—'}</td>
              <td>{p.usuario?.username ?? '—'}</td>
              <td>{p.estado}</td>
              <td>
                <button
                  onClick={() => handleDevolver(p.id)}
                  style={{
                    marginRight: 8,
                    background: '#a78bfa',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '4px 10px',
                    cursor: 'pointer'
                  }}
                >
                  Devolver
                </button>
                <button
                  onClick={() => handleRenovar(p.id)}
                  style={{
                    background: '#6366f1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '4px 10px',
                    cursor: 'pointer'
                  }}
                >
                  Renovar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div style={{ marginTop: 16 }}>Cargando...</div>}
    </div>
  );
};

export default PrestamosSection;
