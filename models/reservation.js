// models/Reservation.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/config.js');  // Asegúrate de que esté correctamente importado

const bcrypt = require('bcryptjs');

const Reservation  = sequelize.define('reservas', {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  movie_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reservation_date: {
    type: DataTypes.DATE,
    allowNull: false,
  }
},
{
  timestamps: false
}
);

module.exports = Reservation;
