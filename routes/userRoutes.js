const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ where: { username } });
    if (userExists) return res.status(400).json({ message: 'El usuario ya existe' });
    
    const user = await User.create({ username, password });
    res.status(201).json({ message: 'Usuario creado con éxito' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: 'Credenciales incorrectas' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciales incorrectas' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, id:user.id });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Verificar si el usuario está activo
router.get('/me', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(400).json({ message: 'Credenciales incorrectas' });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar el token' });
  }
});

module.exports = router;
