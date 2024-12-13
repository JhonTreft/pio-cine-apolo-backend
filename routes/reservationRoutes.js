// routes/reservations.js

const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');
const { verifyToken } = require('../middlewares/auth');  // Middleware para verificar el token de autenticación
const User = require('../models/user');
const Movie = require('../models/movie');

router.get('/index', async (req, res) => {
  try {
    const reservations = await Reservation.findAll();

  // Obtener el nombre de usuario, la fecha de la reserva y la película para cada reserva manualmente
  const reservationsWithDetails = await Promise.all(reservations.map(async (reservation) => {
    // Buscar el usuario por el ID
    const user = await User.findByPk(reservation.user_id); 
    // Buscar la película por el ID de la película
    const movie = await Movie.findByPk(reservation.movie_id); 

    return {
      id: reservation.id,
      userName: user ? user.username : 'Usuario no encontrado',
      reservationDate: reservation.reservation_date, // Fecha de la reserva
      movieTitle: movie ? movie.title : 'Película no encontrada', // Título de la película
    };
  }));
    
    // Enviar la respuesta con las reservas y los nombres de usuario
    res.status(200).json(reservationsWithDetails);
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener las reservas.' });
  }
});


// Endpoint para crear una nueva reserva
router.post('/', verifyToken, async (req, res) => {
  const { user_id, movie_id, reservation_date } = req.body;
  console.log(reservation_date)

  try {
    // Validación de los campos requeridos
    if (!user_id || !movie_id || !reservation_date ) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    
    console.log(user_id, movie_id, reservation_date)
    // Crear la nueva reserva
    const reservation = await Reservation.create({
      user_id,
      movie_id,
      reservation_date,
    });  

    res.status(201).json({ message: 'Reserva realizada con éxito', reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Endpoint para verificar si el usuario ya tiene una reserva en la misma fecha
router.get('/check', async (req, res) => {
  try {
    // Extraemos los parámetros de la URL
    const { user_id, movie_id, reservation_date } = req.query;

    if (!user_id || !movie_id || !reservation_date) {
      return res.status(400).json({ message: 'Todos los parámetros son requeridos' });
    }

    // Buscar si ya existe una reserva para el mismo usuario, película y fecha
    const existingReservation = await Reservation.findOne({
      where: {
        user_id: user_id,
        movie_id: movie_id,
        reservation_date: reservation_date
      }
    });

    if (existingReservation) {
      return res.status(200).json({
        message: 'Ya tienes una reserva para esta película en esta fecha.',
        status:'full'
      });
    }

    // Si no hay ninguna reserva existente, respondemos que está disponible
    return res.status(200).json({
      message: 'La reserva está disponible.'
    });

  } catch (error) {
    console.error('Error en la verificación de la reserva:', error);
    return res.status(500).json({ message: 'Error al verificar la reserva' });
  }
});


// Endpoint para obtener todas las reservas de una película específica por su movie_id
router.get('/reservations/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;

    // Buscar las reservas en la base de datos por movie_id
    const reservations = await Reservation.findAll({
      where: {
        movie_id: movieId
      }
    });

    if (reservations.length === 0) {
      return res.status(404).json({ message: 'No se encontraron reservas para esta película.' });
    }

    // Responder con las reservas encontradas
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener las reservas.' });
  }
});

module.exports = router;
