const { sequelize } = require('../models')

module.exports = {
    async index(req, res) {

        res
            .status(200)
            .render('main', {
                title: 'YouTrade - Trade anything',
            })
    }
}
