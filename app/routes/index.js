const indexController = require('../controllers/index')
const adController = require('../controllers/ad')

const localAuth = require('../middleware/localAuth')
const bearerAuth = require('../middleware/bearerAuth')

module.exports = (app) => {

  app.post('/login', localAuth)

  app.get('/', indexController.index)

  app.get('/ads', bearerAuth, adController.index)
  app.get('/ads/my', bearerAuth, adController.my)
  app.post('/ads', bearerAuth, adController.add)
  app.delete('/ads/:id', bearerAuth, adController.delete)
  app.get('/ads/:slug', bearerAuth, adController.get)

}
