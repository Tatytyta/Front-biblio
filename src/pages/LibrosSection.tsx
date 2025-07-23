import React, { useEffect, useState } from 'react';
import { librosService, generosService, estanteriasService } from '../services/api';

interface Libro {
  id: string;
  titulo: string;
  autor: string;
  categoria: string; // nombre del género (para mostrar)
  isbn: string;
  generoId: number;
  estanteriaId: number;
  ejemplaresDisponibles?: number;
  fechaPublicacion?: string;
}

interface Genero {
  id: number;
  nombre: string;
}

interface Estanteria {
  id: number;
  nombre: string;
  codigo?: string;
}

const LibrosSection: React.FC = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [estanterias, setEstanterias] = useState<Estanteria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [form, setForm] = useState({
    titulo: '',
    autor: '',
    isbn: '',
    generoId: 0,
    estanteriaId: 0,
    ejemplaresDisponibles: 1,
    fechaPublicacion: '',
  });

  const [editId, setEditId] = useState<string | null>(null);

  const resetForm = () => {
    setForm({
      titulo: '',
      autor: '',
      isbn: '',
      generoId: 0,
      estanteriaId: 0,
      ejemplaresDisponibles: 1,
      fechaPublicacion: '',
    });
    setEditId(null);
    setError('');
    setSuccess('');
  };

  const fetchLibros = async () => {
    setLoading(true);
    try {
      const response = await librosService.getLibros({ busqueda, page, limit });
      setLibros(response?.data?.data?.items || []);
    } catch {
      setError('Error al cargar libros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibros();

    (async () => {
      try {
        const gen = await generosService.getGeneros();
        console.log('Respuesta completa géneros:', gen);
        setGeneros(gen); // <-- Aquí puede estar el problema, quizá gen.data no existe

        const est = await estanteriasService.getEstanterias();
        console.log('Respuesta completa estanterías:', est);
        setEstanterias(est); // <-- Igual aquí
      } catch (err) {
        console.error('Error cargando géneros o estanterías', err);
      }
    })();
  }, [busqueda, page]);




  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'generoId' || name === 'estanteriaId' || name === 'ejemplaresDisponibles'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.generoId || !form.estanteriaId) {
      setError('Debe seleccionar género y estantería');
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        await librosService.updateLibro(editId, form);
        setSuccess('Libro actualizado con éxito');
      } else {
        await librosService.createLibro(form);
        setSuccess('Libro agregado con éxito');
      }
      resetForm();
      fetchLibros();
    } catch {
      setError('Error al guardar libro');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await librosService.deleteLibro(id);
      setSuccess('Libro eliminado con éxito');
      fetchLibros();
    } catch {
      setError('Error al eliminar libro');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (libro: Libro) => {
    setForm({
      titulo: libro.titulo,
      autor: libro.autor,
      isbn: libro.isbn,
      generoId: libro.generoId || 0,
      estanteriaId: libro.estanteriaId || 0,
      ejemplaresDisponibles: libro.ejemplaresDisponibles ?? 1,
      fechaPublicacion: libro.fechaPublicacion?.substring(0, 10) || '',
    });
    setEditId(libro.id);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>Libros</h2>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por título o autor"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} required />
        <input name="autor" placeholder="Autor" value={form.autor} onChange={handleChange} required />
        <input name="isbn" placeholder="isbn" value={form.isbn} onChange={handleChange} required />

        <select name="generoId" value={form.generoId} onChange={handleChange} required>
          <option value={0}>Seleccione un género</option>
          {generos.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
          ))}
        </select>

        <select name="estanteriaId" value={form.estanteriaId} onChange={handleChange} required>
          <option value={0}>Seleccione una estantería</option>
          {estanterias.map((e) => (
            <option key={e.id} value={e.id}>
              {e.codigo}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="ejemplaresDisponibles"
          min={1}
          value={form.ejemplaresDisponibles}
          onChange={handleChange}
        />

        <input type="date" name="fechaPublicacion" value={form.fechaPublicacion} onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {editId ? 'Actualizar' : 'Agregar'}
        </button>
        {editId && <button onClick={resetForm}>Cancelar</button>}
      </form>

      {/* Mensajes */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Tabla de libros */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th>Título</th>
            <th>Autor</th>
            <th>Género</th>
            <th>ISBN</th>
            <th>Ejemplares</th>
            <th>Fecha Publicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {libros.length ? (
            libros.map((libro) => (
              <tr key={libro.id}>
                <td>{libro.titulo}</td>
                <td>{libro.autor}</td>
                <td>{generos.find((g) => g.id === libro.generoId)?.nombre || libro.categoria}</td>
                <td>{libro.isbn}</td>
                <td>{libro.ejemplaresDisponibles ?? 1}</td>
                <td>{libro.fechaPublicacion ? new Date(libro.fechaPublicacion).toLocaleDateString() : '-'}</td>
                <td>
                  <button onClick={() => handleEdit(libro)} style={{ marginRight: 8 }}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(libro.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', color: '#888' }}>
                No hay libros para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginación */}
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Anterior
        </button>
        <span>Página {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Siguiente</button>
      </div>

      {loading && <p style={{ marginTop: 12 }}>Cargando...</p>}
    </div>
  );
};

export default LibrosSection;
