const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/config.js');

const Movie = sequelize.define('Movie', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  releaseDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  inTheater: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Movie;
