require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const clienteRoutes = require('./routes/clienteRoutes');
const motoRoutes = require('./routes/motoRoutes');
const workOrderRoutes = require('./routes/workOrderRoutes');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/clients', clienteRoutes);
app.use('/api/bikes', motoRoutes);
app.use('/api/work-orders', workOrderRoutes);
app.use('/api/auth',authRoutes)

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a bd OK');

    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
  }
}

start();