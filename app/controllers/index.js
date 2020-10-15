const path = require('path')

const {
    User,
    Ad,
    Image
} = require('../models')

module.exports = {
    async index(req, res) {
        const user = await User.findAll({ limit: 1 })
        const ads = await Ad.findAll({ limit: 1 })
        const images = await Image.findAll({ where: { 'AdId': 6 } })

        res
            .send({
                images
            })

        // res
        //     .status(200)
        //     .sendFile(path.join(__dirname, '../../public', 'index.html'))
    }
}
