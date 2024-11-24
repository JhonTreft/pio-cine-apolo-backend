// middlewares/auth.js

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Obtener el token del encabezado

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado. No se encontró token.' });
  }

  jwt.verify(token, 'mOc10FZbUDB5HP26DsH9J-eLKdgJBSrzzY24K5Cmgqq5NGSMUvOh9QDwURMRIZD44f7VoQSvu-YCmoj6_0bWqg', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    req.userId = decoded.id;  // Aquí podrías almacenar el id del usuario decodificado
    next();
  });
};

module.exports = { verifyToken };
