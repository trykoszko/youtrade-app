const bcrypt = require('bcrypt')
const hashPassword = require('../helpers/hashPassword')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    nicename: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    isAdmin: { type: DataTypes.BOOLEAN, default: false },
    password: { type: DataTypes.STRING, allowNull: false },
    acceptTerms: { type: DataTypes.BOOLEAN },
    acceptGdpr: { type: DataTypes.BOOLEAN },
    activateToken: { type: DataTypes.STRING },
    isActivated: { type: DataTypes.BOOLEAN }
  }, {
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword,
    },
    freezeTableName: true,
    tableName: 'Users'
  });

  User.prototype.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
  }

  User.associate = models => {
    User.hasMany(models.Ad)
  }

  return User;
};
