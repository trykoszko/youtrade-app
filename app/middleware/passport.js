const passport = require('passport')
const jwt = require('jwt-simple')
const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy

const User = require('../models').User

const {
  SECRET
} = process.env

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false
 }, (username, password, done) => {
  return User.findOne({ where: { username } })
    .then(async user => {
      if (!user) {
        return done(null, {
          success: false,
          explanation: 'err_no_user',
        })
      }
      const isValid = await Promise.resolve(user.isValidPassword(password))
      if (!isValid) {
        return done(null, false, {
          success: false,
          explanation: 'err_invalid_credentials',
        })
      }
      return done(null, user)
    })
    .catch(done)
}))

passport.use(new BearerStrategy({
  session: false
}, (token, done) => {
  try {
    const decodedToken = jwt.decode(token, SECRET)
    const userId = decodedToken && decodedToken.id
    if (userId) {
      if (new Date().getTime() < decodedToken.validTo) {
        return User.findByPk(userId)
          .then(user => done(null, user))
          .catch(done)
      } else {
        return done(null, false, { error: 'err_session_ended' })
      }
    } else {
      return done()
    }
  } catch(err) {
    return done()
  }
}))

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser((id, done) => {
  return User.findByPk(id)
    .then(user => done(null, user))
    .catch(done)
})

module.exports = passport
