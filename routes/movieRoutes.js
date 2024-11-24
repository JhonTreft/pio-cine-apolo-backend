const express = require('express');
const Movie = require('../models/movie');
const Reservation = require('../models/reservation');  // Asegúrate de importar el modelo Reservation
const sequelize = require('sequelize');  // Asegúrate de importar Sequelize
const router = express.Router();


// Obtener todas las películas en cartelera con el número de reservas
router.get('/', async (req, res) => {
  try {
    // Obtener todas las películas en cartelera
    const movies = await Movie.findAll({
      where: { inTheater: true },
    });

    // Para cada película, contar cuántas reservas existen para ella en la tabla `reservations`
    const moviesWithReservationCount = await Promise.all(movies.map(async (movie) => {
      const reservationCount = await Reservation.count({
        where: { movie_id: movie.id }
      });

      // Devolver la película con el conteo de reservas
      return {
        ...movie.toJSON(),
        reservationCount,  // Añadir el número de reservas a cada película
      };
    }));

    // Enviar las películas con el conteo de reservas
    res.json(moviesWithReservationCount);
  } catch (error) {
    console.error('Error al obtener las películas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;


// Registrar película
router.post('/', async (req, res) => {
  const { title, genre, releaseDate } = req.body;

  try {
    const movie = await Movie.create({ title, genre, releaseDate });
    res.status(201).json({ message: 'Película registrada con éxito' });
  } catch (error) {
    console.error('Error al registrar la película', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
