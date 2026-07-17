function errorHandler(err, req, res, next) {
  console.error(err); // siempre lo vemos completo en la terminal para debug

  // Errores de validación de Sequelize (ej. campo obligatorio vacío)
  if (err.name === 'SequelizeValidationError') {
    const mensajes = err.errors.map((e) => e.message);
    return res.status(400).json({ message: mensajes.join(', ') });
  }

  // Error de restricción única (ej. placa duplicada)
  if (err.name === 'SequelizeUniqueConstraintError') {
    const mensajes = err.errors.map((e) => e.message);
    return res.status(409).json({ message: mensajes.join(', ') });
  }

  // Error de llave foránea (ej. referencia a un registro que no existe)
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ message: 'Referencia inválida a un registro relacionado' });
  }

  // Cualquier otro error no controlado
  return res.status(500).json({ message: 'Error interno del servidor' });
}

module.exports = errorHandler;