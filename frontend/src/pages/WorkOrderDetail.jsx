import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { TRANSICIONES_VALIDAS } from '../utils/estados';

function WorkOrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [orden, setOrden] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [nuevoEstado, setNuevoEstado] = useState('');
  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  const [errorEstado, setErrorEstado] = useState(null);

  const [tipo, setTipo] = useState('MANO_OBRA');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [valorUnitario, setValorUnitario] = useState('');
  const [agregandoItem, setAgregandoItem] = useState(false);
  const [errorItem, setErrorItem] = useState(null);

  const [historial, setHistorial] = useState([]);

  async function cargarOrden() {
    try {
      setCargando(true);
      const response = await api.get(`/work-orders/${id}`);
      setOrden(response.data);
    } catch (err) {
      setError('No se pudo cargar la orden');
    } finally {
      setCargando(false);
    }
  }

  async function cargarHistorial() {
    try {
      const response = await api.get(`/work-orders/${id}/history`);
      setHistorial(response.data);
    } catch (err) {
      // si falla el historial, no bloqueamos el resto de la pantalla
      console.error('No se pudo cargar el historial');
    }
  }

  useEffect(() => {
    cargarOrden();
    cargarHistorial();
  }, [id]);

  async function handleCambiarEstado(e) {
    e.preventDefault();
    if (!nuevoEstado) return;

    try {
      setCambiandoEstado(true);
      setErrorEstado(null);

      await api.patch(`/work-orders/${id}/status`, { status: nuevoEstado });

      setNuevoEstado('');
      await cargarOrden();
      await cargarHistorial();
    } catch (err) {
      const mensaje = err.response?.data?.message || 'No se pudo cambiar el estado';
      setErrorEstado(mensaje);
    } finally {
      setCambiandoEstado(false);
    }
  }

  async function handleAgregarItem(e) {
    e.preventDefault();

    try {
      setAgregandoItem(true);
      setErrorItem(null);

      await api.post(`/work-orders/${id}/items`, {
        type: tipo,
        description: descripcion,
        count: parseInt(cantidad, 10),
        unitValue: parseFloat(valorUnitario),
      });

      setDescripcion('');
      setCantidad('1');
      setValorUnitario('');
      await cargarOrden();
    } catch (err) {
      const mensaje = err.response?.data?.message || 'No se pudo agregar el ítem';
      setErrorItem(mensaje);
    } finally {
      setAgregandoItem(false);
    }
  }

  async function handleEliminarItem(itemId) {
    try {
      await api.delete(`/work-orders/items/${itemId}`);
      await cargarOrden();
    } catch (err) {
      setErrorItem('No se pudo eliminar el ítem');
    }
  }

  if (cargando) return <p className="p-6">Cargando orden...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!orden) return null;

  const opcionesValidas = TRANSICIONES_VALIDAS[orden.status] || [];

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Orden #{orden.id}</h2>

      <div className="border rounded p-4 mb-6">
        <p><span className="font-semibold">Cliente:</span> {orden.moto.cliente.name} — {orden.moto.cliente.phone}</p>
        <p><span className="font-semibold">Moto:</span> {orden.moto.brand} {orden.moto.model} ({orden.moto.plate})</p>
        <p><span className="font-semibold">Falla reportada:</span> {orden.faultDescription}</p>
        <p><span className="font-semibold">Estado actual:</span> {orden.status}</p>
        <p><span className="font-semibold">Total:</span> ${parseFloat(orden.total).toLocaleString('es-CO')}</p>
      </div>

      <div className="border rounded p-4 mb-6">
        <p className="font-semibold mb-2">Cambiar estado</p>

        {opcionesValidas.length === 0 ? (
          <p className="text-gray-500">No hay transiciones disponibles desde este estado.</p>
        ) : (
          <form onSubmit={handleCambiarEstado} className="flex gap-2">
            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              className="border rounded p-2"
            >
              <option value="">Selecciona un estado...</option>
              {opcionesValidas.map((estado) => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!nuevoEstado || cambiandoEstado}
              className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
            >
              {cambiandoEstado ? 'Cambiando...' : 'Cambiar'}
            </button>
          </form>
        )}

        {errorEstado && <p className="text-red-600 mt-2">{errorEstado}</p>}
      </div>

      <div className="border rounded p-4 mb-6">
        <p className="font-semibold mb-2">Historial de estados</p>

        {historial.length === 0 ? (
          <p className="text-gray-500">Aún no hay cambios de estado registrados.</p>
        ) : (
          <ul className="space-y-2">
            {historial.map((registro) => (
              <li key={registro.id} className="text-sm border-l-2 border-blue-400 pl-3">
                <span className="text-gray-500">
                  {new Date(registro.createdAt).toLocaleString('es-CO')}
                </span>
                {' — '}
                {registro.previousStatus ? (
                  <span>
                    <span className="font-medium">{registro.previousStatus}</span>
                    {' → '}
                    <span className="font-medium">{registro.newStatus}</span>
                  </span>
                ) : (
                  <span>
                    Orden creada en estado <span className="font-medium">{registro.newStatus}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border rounded p-4">
        <p className="font-semibold mb-2">Ítems de la orden</p>

        {orden.items.length === 0 ? (
          <p className="text-gray-500 mb-4">No hay ítems registrados.</p>
        ) : (
          <table className="w-full mb-4">
            <thead>
              <tr className="text-left text-sm text-gray-600">
                <th className="pb-2">Tipo</th>
                <th className="pb-2">Descripción</th>
                <th className="pb-2">Cant.</th>
                <th className="pb-2">Valor unit.</th>
                <th className="pb-2">Subtotal</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {orden.items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="py-2">{item.type}</td>
                  <td className="py-2">{item.description}</td>
                  <td className="py-2">{item.count}</td>
                  <td className="py-2">${parseFloat(item.unitValue).toLocaleString('es-CO')}</td>
                  <td className="py-2">
                    ${(item.count * parseFloat(item.unitValue)).toLocaleString('es-CO')}
                  </td>
                  <td className="py-2">
                    {user.role === 'ADMIN' && (
                      <button
                        onClick={() => handleEliminarItem(item.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <form onSubmit={handleAgregarItem} className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="MANO_OBRA">Mano de obra</option>
              <option value="REPUESTO">Repuesto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <input
              type="text"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cantidad</label>
            <input
              type="number"
              placeholder="Cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="border rounded p-2 w-full"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Valor unitario</label>
            <input
              type="number"
              placeholder="Valor unitario"
              value={valorUnitario}
              onChange={(e) => setValorUnitario(e.target.value)}
              className="border rounded p-2 w-full"
              min="0"
              required
            />
          </div>

          <button
            type="submit"
            disabled={agregandoItem}
            className="col-span-2 bg-green-600 text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {agregandoItem ? 'Agregando...' : 'Agregar ítem'}
          </button>
        </form>

        {errorItem && <p className="text-red-600 mt-2">{errorItem}</p>}
      </div>
    </div>
  );
}

export default WorkOrderDetail;