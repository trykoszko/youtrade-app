const chalk = require('chalk')
const db = require('../models')

const testSequelize = async (req, res, next) => {
    try {
      await db.sequelize.authenticate()
      console.log(chalk.bgMagenta('💡 Sequelize connected! 💡'))
      next()
    } catch (error) {
      console.log(chalk.bgWhiteBright.red('❌ Sequelize connection error! ❌'))
      return res.status(400).send({
        error: 'Sequelize connection error',
        data: error
      })
    }
}

module.exports = testSequelize
