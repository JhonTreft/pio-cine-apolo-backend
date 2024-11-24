const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const sequelize = require('./config/config');  // Importa la instancia de sequelize
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Conectar a PostgreSQL
sequelize.authenticate()
  .then(() => {
    console.log('Conectado a PostgreSQL');
    // Sincronizar los modelos con la base de datos
    sequelize.sync().then(() => {
      console.log('Tablas sincronizadas');
    }).catch((err) => console.log('Error sincronizando tablas:', err));
  })
  .catch((err) => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reservations', reservationRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
