const path = require('path')

module.exports = {
    async index(req, res) {
        res
            .status(200)
            .sendFile(path.join(__dirname, '../../public', 'index.html'))
    }
}
