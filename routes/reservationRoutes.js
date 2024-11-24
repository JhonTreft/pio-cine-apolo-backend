// routes/reservations.js

const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');
const { verifyToken } = require('../middlewares/auth');  // Middleware para verificar el token de autenticación

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

module.exports = router;
