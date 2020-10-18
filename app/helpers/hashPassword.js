const bcrypt = require('bcrypt')

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)

function hashPassword(user) {
  if (user.changed('password')) {
    return bcrypt.hash(user.password, SALT_ROUNDS)
      .then((hashedPass) => { user.password = hashedPass })
  }
}

module.exports = hashPassword
