require('dotenv').config();
const { Sequelize } = require('sequelize');

// Crear y exportar la instancia de Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false, // Puedes activar logging si deseas ver las consultas SQL
  }
);

module.exports = sequelize;
