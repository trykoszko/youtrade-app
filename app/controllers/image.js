const path = require('path')

module.exports = {

    async read(req, res) {
        res
            .status(200)
            .sendFile()
    }

}
