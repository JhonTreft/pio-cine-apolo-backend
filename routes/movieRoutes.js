const express = require('express');
const Movie = require('../models/movie');
const Reservation = require('../models/reservation');  // Asegúrate de importar el modelo Reservation
const sequelize = require('sequelize');  // Asegúrate de importar Sequelize
const router = express.Router();
const User = require('../models/user');

// Obtener todas las películas en cartelera con el número de reservas
router.get('/', async (req, res) => {
  try {
    // Obtener todas las películas en cartelera
    const movies = await Movie.findAll({
      where: { inTheater: true },
    });

    // Para cada película, obtener las reservas y el nombre del usuario
    const moviesWithReservations = await Promise.all(movies.map(async (movie) => {
      // Obtener las reservas para la película actual
      const reservations = await Reservation.findAll({
        where: { movie_id: movie.id },
      });

      const reservationCount = await Reservation.count({
        where: { movie_id: movie.id }
      });
      
      // Obtener el nombre de usuario y la fecha de la reserva para cada reserva manualmente
      const reservationsWithUsernames = await Promise.all(reservations.map(async (reservation) => {
        const user = await User.findByPk(reservation.user_id); // Buscar el usuario por el ID
        return {
          id: reservation.id,
          userName: user ? user.username : 'Usuario no encontrado',
          reservationDate: reservation.reservation_date, // Incluir la fecha de la reserva
        };
      }));

      // Devolver la película con los detalles de las reservas
      return {
        ...movie.toJSON(),
        reservations: reservationsWithUsernames,
        reservationCount,  // Añadir el número de reservas a cada película
      };
    }));

    // Enviar las películas con las reservas
    res.json(moviesWithReservations);
  } catch (error) {
    console.error('Error al obtener las películas y las reservas:', error);
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
