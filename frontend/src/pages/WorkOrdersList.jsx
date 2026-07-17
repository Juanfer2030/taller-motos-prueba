import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ESTADOS = ['RECIBIDA', 'DIAGNOSTICO', 'EN_PROCESO', 'LISTA', 'ENTREGADA', 'CANCELADA'];

function WorkOrdersList() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [statusFiltro, setStatusFiltro] = useState('');
  const [plateFiltro, setPlateFiltro] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    async function cargarOrdenes() {
      try {
        setCargando(true);
        setError(null);

        const params = { page: pagina, pageSize: 5 };
        if (statusFiltro) params.status = statusFiltro;
        if (plateFiltro) params.plate = plateFiltro;

        const response = await api.get('/work-orders', { params });

        setOrdenes(response.data.data);
        setTotalPaginas(response.data.pagination.totalPages);
      } catch (err) {
        setError('No se pudieron cargar las órdenes');
      } finally {
        setCargando(false);
      }
    }

    cargarOrdenes();
  }, [statusFiltro, plateFiltro, pagina]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Listado de Órdenes</h2>

      <div className="flex gap-4 mb-4">
        <select
          value={statusFiltro}
          onChange={(e) => {
            setStatusFiltro(e.target.value);
            setPagina(1);
          }}
          className="border rounded p-2"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((estado) => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar por placa..."
          value={plateFiltro}
          onChange={(e) => {
            setPlateFiltro(e.target.value);
            setPagina(1);
          }}
          className="border rounded p-2"
        />
      </div>

      {cargando && <p>Cargando órdenes...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!cargando && !error && (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">Placa</th>
                <th className="p-3 border-b">Cliente</th>
                <th className="p-3 border-b">Estado</th>
                <th className="p-3 border-b">Fecha</th>
                <th className="p-3 border-b">Total</th>
                <th className="p-3 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{orden.moto.plate}</td>
                  <td className="p-3 border-b">{orden.moto.cliente.name}</td>
                  <td className="p-3 border-b">{orden.status}</td>
                  <td className="p-3 border-b">
                    {new Date(orden.entryDate).toLocaleDateString('es-CO')}
                  </td>
                  <td className="p-3 border-b">
                    ${parseFloat(orden.total).toLocaleString('es-CO')}
                  </td>
                  <td className="p-3 border-b">
                    <Link to={`/work-orders/${orden.id}`} className="text-blue-600 hover:underline">
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {ordenes.length === 0 && (
            <p className="text-gray-500 mt-4">No hay órdenes que coincidan con los filtros.</p>
          )}

          <div className="flex gap-2 mt-4 items-center">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="border rounded px-3 py-1 disabled:opacity-50"
            >
              Anterior
            </button>
            <span>Página {pagina} de {totalPaginas}</span>
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={pagina >= totalPaginas}
              className="border rounded px-3 py-1 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default WorkOrdersList;