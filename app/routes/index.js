const passport = require('passport')

const authController = require('../controllers/auth')
const indexController = require('../controllers/index')
const adController = require('../controllers/ad')

module.exports = (app) => {

  app.post('/login', authController.login)

  app.get('/', indexController.index)

  app.get('/ads', passport.authenticate('bearer', { session: false }), adController.index)

}
