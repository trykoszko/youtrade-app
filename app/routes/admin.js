const adminController = require('../controllers/admin')

module.exports = (app) => {

  app.get('/admin', adminController.index)

}
