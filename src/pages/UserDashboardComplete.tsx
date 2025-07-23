
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { prestamosService, dashboardService } from '../services/api';
import { Libro, Prestamo } from '../types';

const UserDashboardComplete: React.FC = () => {
  const { user } = useAuth();
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [librosRecomendados, setLibrosRecomendados] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDatosDashboard();
    // eslint-disable-next-line
  }, []);

  const cargarDatosDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const [dashboardData, prestamosData] = await Promise.all([
        dashboardService.getUserDashboard(),
        prestamosService.getMisPrestamos()
      ]);
      let prestamosArray = Array.isArray(prestamosData)
        ? prestamosData
        : prestamosData?.items || prestamosData?.prestamos || [];
      if (!Array.isArray(prestamosArray)) prestamosArray = [];
      setPrestamos(prestamosArray);
      setLibrosRecomendados(dashboardData?.librosRecomendados || []);
    } catch (err: any) {
      setError('No se pudo cargar la información del usuario.');
      setPrestamos([]);
      setLibrosRecomendados([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h2>Bienvenido, {user?.nombre || user?.email || 'Usuario'} 👋</h2>
      <p style={{ color: '#666' }}>Aquí puedes consultar tus préstamos activos, libros recomendados y tu actividad reciente.</p>

      {loading ? (
        <div style={{ margin: 32 }}>Cargando datos...</div>
      ) : error ? (
        <div style={{ color: 'red', margin: 32 }}>{error}</div>
      ) : (
        <>
          <section style={{ margin: '2rem 0' }}>
            <h3>Préstamos Activos</h3>
            {prestamos.length === 0 ? (
              <div style={{ color: '#888' }}>No tienes préstamos activos.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Título</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Autor</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Fecha Préstamo</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Vencimiento</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {prestamos.map((p) => (
                    <tr key={p.id}>
                      <td style={{ padding: 8, border: '1px solid #eee' }}>{p.libro?.titulo || '-'}</td>
                      <td style={{ padding: 8, border: '1px solid #eee' }}>{p.libro?.autor || '-'}</td>
                      <td style={{ padding: 8, border: '1px solid #eee' }}>{p.fechaPrestamo?.slice(0, 10) || '-'}</td>
                      <td style={{ padding: 8, border: '1px solid #eee' }}>{p.fechaVencimiento?.slice(0, 10) || '-'}</td>
                      <td style={{ padding: 8, border: '1px solid #eee' }}>{p.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section style={{ margin: '2rem 0' }}>
            <h3>Libros Recomendados</h3>
            {librosRecomendados.length === 0 ? (
              <div style={{ color: '#888' }}>No hay recomendaciones por ahora.</div>
            ) : (
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
                {librosRecomendados.map((libro) => (
                  <div key={libro.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, minWidth: 180 }}>
                    <div style={{ fontWeight: 'bold' }}>{libro.titulo}</div>
                    <div style={{ color: '#666' }}>{libro.autor}</div>
                    <div style={{ fontSize: 13, color: '#aaa' }}>{libro.categoria}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default UserDashboardComplete;
