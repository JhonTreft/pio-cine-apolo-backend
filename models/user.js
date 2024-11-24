const { DataTypes } = require('sequelize');
const sequelize = require('../config/config.js');  // Asegúrate de que esté correctamente importado

const bcrypt = require('bcryptjs');

const Users = sequelize.define('Users', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
  },
});

// Método para comparar contraseñas
Users.prototype.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = Users;
