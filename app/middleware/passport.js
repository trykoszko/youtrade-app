const passport = require('passport')
const jwt = require('jwt-simple')
const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

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
        return done(null, false, {
          message: 'Please provide a valid username',
          invalidField: 'username'
        })
      }
      const isValid = await Promise.resolve(user.isValidPassword(password))
      if (!isValid) {
        return done(null, false, {
          message: 'Please provide a valid password for given username',
          invalidField: 'password'
        })
      }
      if (!user.isActivated) {
        return done(null, false, {
          message: 'Your account isn\'t activated yet. Please click on a confirmation link on your e-mail to confirm your account',
          invalidField: 'default'
        })
      }
      return done(null, user)
    })
    .catch(done)
}))

passport.use(new BearerStrategy({ session: false }, (token, done) => {
  try {
    const decodedToken = jwt.decode(token, SECRET)
    const userId = decodedToken && decodedToken.id
    if (userId) {
      return User.findByPk(userId)
        .then(user => done(null, user))
        .catch(done)
    } else {
      return done()
    }
  } catch(err) {
    done()
  }
}))

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser((id, done) => {
  return User.findByPk(id)
    .then(user => done(null, user))
    .catch(done)
})

module.exports = passport
