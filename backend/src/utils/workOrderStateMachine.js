const TRANSICIONES_VALIDAS = {
  RECIBIDA: ['DIAGNOSTICO', 'CANCELADA'],
  DIAGNOSTICO: ['EN_PROCESO', 'CANCELADA'],
  EN_PROCESO: ['LISTA', 'CANCELADA'],
  LISTA: ['ENTREGADA', 'CANCELADA'],
  ENTREGADA: [],
  CANCELADA: [],
};

function esTransicionValida(estadoActual, nuevoEstado) {
  const permitidos = TRANSICIONES_VALIDAS[estadoActual] || [];
  return permitidos.includes(nuevoEstado);
}

module.exports = { TRANSICIONES_VALIDAS, esTransicionValida };