import React, { useState } from 'react';
import LibrosSection from './LibrosSection';
import UsuariosSection from './UsuariosSection';
import PrestamosSection from './PrestamosSection';
import GenerosSection from './GenerosSection';
import EstanteriasSection from './EstanteriasSection';
import ResenasSection from './ResenasSection';
import ActividadSection from './ActividadSection';

const TABS = [
  { id: 'libros', label: 'Libros', icon: '📚' },
  { id: 'usuarios', label: 'Usuarios', icon: '👥' },
  { id: 'prestamos', label: 'Préstamos', icon: '📋' },
  { id: 'generos', label: 'Géneros', icon: '🎭' },
  { id: 'estanterias', label: 'Estanterías', icon: '🗄️' },
  { id: 'resenas', label: 'Reseñas', icon: '⭐' },
  { id: 'actividad', label: 'Actividad Usuario', icon: '📈' },
];

const AdminDashboardNew: React.FC = () => {
  const [activeTab, setActiveTab] = useState('libros');

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 24, textAlign: 'center' }}>Panel de Administración</h1>
      <nav style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              border: activeTab === tab.id ? '2px solid #a78bfa' : '1px solid #eee',
              background: activeTab === tab.id ? '#f3f0ff' : '#fafafa',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              fontSize: 18,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ marginRight: 8 }}>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </nav>
      <div style={{ minHeight: 400 }}>
        {activeTab === 'libros' && <LibrosSection />}
        {activeTab === 'usuarios' && <UsuariosSection />}
        {activeTab === 'prestamos' && <PrestamosSection />}
        {activeTab === 'generos' && <GenerosSection />}
        {activeTab === 'estanterias' && <EstanteriasSection />}
        {activeTab === 'resenas' && <ResenasSection />}
        {activeTab === 'actividad' && <ActividadSection />}
      </div>
    </div>
  );
};

export default AdminDashboardNew;
