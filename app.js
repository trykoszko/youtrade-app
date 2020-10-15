const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const path = require('path')
const cors = require('cors')
const hbs = require('express-handlebars')

require('dotenv').config()
require('./app/controllers/mailer')
require('./app/models')

const forceHTTPS = require('./app/middleware/require-https')

const app = express()

app.use(cors())

app.use(helmet({
  contentSecurityPolicy: false
}))

app.use(logger('dev'))

app.use(function(err, req, res, next) {
  console.log('Error!: ', err)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// serve gatsby from static
app.use(express.static('front/public'))

app.engine('hbs', hbs({
  extname: 'hbs',
  defaultView: 'main',
  layoutsDir: __dirname + '/app/views/layouts/',
  partialsDir: __dirname + '/app/views/partials/'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app/views'))

require('./app/routes/index')(app)
require('./app/routes/admin')(app)

// if (process.env.NODE_ENV === 'development') {
//   db.sequelize.sync({ force: true }).then(async () => {
//     console.log('Drop and re-sync db.')
//   })
// }

if (process.env.NODE_ENV === 'production') {
  app.listen(80)
  app.use(forceHTTPS)
}

module.exports = app
