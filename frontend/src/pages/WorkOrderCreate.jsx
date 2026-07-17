import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function WorkOrderCreate() {
  const navigate = useNavigate();

  // Paso 1: búsqueda de placa
  const [plate, setPlate] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [motoEncontrada, setMotoEncontrada] = useState(null);
  const [motoNoExiste, setMotoNoExiste] = useState(false);

  // Registro rápido (si la moto no existe)
  const [clienteName, setClienteName] = useState('');
  const [clientePhone, setClientePhone] = useState('');
  const [motoBrand, setMotoBrand] = useState('');
  const [motoModel, setMotoModel] = useState('');
  const [motoCylinder, setMotoCylinder] = useState('');

  // Datos de la orden
  const [faultDescription, setFaultDescription] = useState('');

  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function buscarMoto(e) {
    e.preventDefault();
    setError(null);
    setMotoEncontrada(null);
    setMotoNoExiste(false);

    if (!plate.trim()) return;

    try {
      setBuscando(true);
      const response = await api.get('/bikes', { params: { plate } });

      if (response.data.length > 0) {
        setMotoEncontrada(response.data[0]);
      } else {
        setMotoNoExiste(true);
      }
    } catch (err) {
      setError('Error al buscar la moto');
    } finally {
      setBuscando(false);
    }
  }

  async function registrarClienteYMoto() {
    // 1. Crear cliente
    const clienteResponse = await api.post('/clients', {
      name: clienteName,
      phone: clientePhone,
    });

    // 2. Crear moto asociada a ese cliente
    const motoResponse = await api.post('/bikes', {
      plate,
      brand: motoBrand,
      model: motoModel,
      cylinder: motoCylinder ? parseInt(motoCylinder, 10) : null,
      clientId: clienteResponse.data.id,
    });

    return motoResponse.data;
  }

  async function handleCrearOrden(e) {
    e.preventDefault();
    setError(null);

    try {
      setEnviando(true);

      let moto = motoEncontrada;

      if (!moto) {
        moto = await registrarClienteYMoto();
      }

      const ordenResponse = await api.post('/work-orders', {
        motoId: moto.id,
        faultDescription,
      });

      navigate(`/work-orders/${ordenResponse.data.id}`);
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Ocurrió un error al crear la orden';
      setError(mensaje);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="p-6 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Crear Orden</h2>

      <form onSubmit={buscarMoto} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Placa de la moto"
          value={plate}
          onChange={(e) => setPlate(e.target.value.toUpperCase())}
          className="border rounded p-2 flex-1"
        />
        <button
          type="submit"
          disabled={buscando}
          className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {buscando ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {motoEncontrada && (
        <div className="border rounded p-4 mb-4 bg-green-50">
          <p className="font-semibold">Moto encontrada:</p>
          <p>{motoEncontrada.brand} {motoEncontrada.model} — {motoEncontrada.plate}</p>
          <p className="text-sm text-gray-600">Cliente: {motoEncontrada.cliente.name}</p>
        </div>
      )}

      {motoNoExiste && (
        <div className="border rounded p-4 mb-4 bg-yellow-50">
          <p className="font-semibold mb-3">No se encontró la moto. Regístrala junto al cliente:</p>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Nombre del cliente"
              value={clienteName}
              onChange={(e) => setClienteName(e.target.value)}
              className="border rounded p-2"
              required
            />
            <input
              type="text"
              placeholder="Teléfono del cliente"
              value={clientePhone}
              onChange={(e) => setClientePhone(e.target.value)}
              className="border rounded p-2"
              required
            />
            <input
              type="text"
              placeholder="Marca"
              value={motoBrand}
              onChange={(e) => setMotoBrand(e.target.value)}
              className="border rounded p-2"
              required
            />
            <input
              type="text"
              placeholder="Modelo"
              value={motoModel}
              onChange={(e) => setMotoModel(e.target.value)}
              className="border rounded p-2"
              required
            />
            <input
              type="number"
              placeholder="Cilindraje (opcional)"
              value={motoCylinder}
              onChange={(e) => setMotoCylinder(e.target.value)}
              className="border rounded p-2"
            />
          </div>
        </div>
      )}

      {(motoEncontrada || motoNoExiste) && (
        <form onSubmit={handleCrearOrden}>
          <label className="block mb-1 font-medium">Descripción de la falla</label>
          <textarea
            value={faultDescription}
            onChange={(e) => setFaultDescription(e.target.value)}
            className="border rounded p-2 w-full mb-4"
            rows={3}
            required
          />

          <button
            type="submit"
            disabled={enviando}
            className="bg-green-600 text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {enviando ? 'Creando orden...' : 'Crear Orden'}
          </button>
        </form>
      )}
    </div>
  );
}

export default WorkOrderCreate;