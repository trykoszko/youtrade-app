const db = require('../models')

const testSequelize = async (req, res, next) => {
    try {
      await db.sequelize.authenticate()
      console.log('Sequelize connected')
      next()
    } catch (error) {
      console.log({
        error: 'Sequelize connection error',
        data: error
      })
      return res.status(400).send({
        error: 'Sequelize connection error',
        data: error
      })
    }
}

module.exports = testSequelize
