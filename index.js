const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const path = require('path')
const cors = require('cors')
const hbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')

const testSequelize = require('./app/middleware/sequelize-test')

require('dotenv').config()
require('./app/helpers/mailer')
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

app.use(cookieParser(process.env.SECRET))
app.set('trust proxy', 1)
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 2 * 60 * 60 * 1000 }
}))

require('./app/middleware/passport')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('front/public/'))

app.engine('hbs', hbs({
  extname: 'hbs',
  defaultView: 'main',
  layoutsDir: __dirname + '/app/views/layouts/',
  partialsDir: __dirname + '/app/views/partials/'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app/views'))

app.use(testSequelize)

require('./app/routes/index')(app)

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
