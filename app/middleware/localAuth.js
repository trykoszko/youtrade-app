const jwt = require('jwt-simple')
const passport = require('passport')

const {
    SECRET,
} = process.env

const localAuth = (req, res, next) => {
    passport.authenticate('local', {}, function(err, user, info) {
        if (err) {
            return res.status(400).json({
                success: false,
                explanation: 'login_error',
                token: null
            })
        }
        if (!user) {
            return res.status(400).json({
                success: false,
                explanation: 'auth_error',
                token: null
            })
        }
        req.logIn(user, err => {
            if (err) {
                console.log('err', err)
                return res.status(400).json({
                    success: false,
                    explanation: 'username_or_password_incorrect',
                    token: null
                })
            }
            return res.status(200).json({
                success: true,
                explanation: `Welcome back, ${user.dataValues.nicename}`,
                token: jwt.encode({ ...user.dataValues, validTo: new Date().getTime() + 2 * 60 * 60 * 1000 }, SECRET)
            })
        })
    })(req, res, next)
}

module.exports = localAuth
