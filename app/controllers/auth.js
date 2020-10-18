const jwt = require('jwt-simple')
const passport = require('passport')

const {
    SECRET,
} = process.env

module.exports = {
    async login(req, res, next) {
        passport.authenticate('local', {
            successRedirect: '/user/dashboard',
            failureRedirect: '/login'
        }, function(err, user, info) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    explanation: {
                        error: 'login_error'
                    },
                    token: null
                })
            }
            if (!user) {
                return res.status(400).json({
                    success: false,
                    explanation: {
                        error: 'invalid_username'
                    },
                    token: null
                })
            }
            req.logIn(user, err => {
                if (err) {
                    console.log('err', err)
                    return res.status(400).json({
                        success: false,
                        explanation: {
                            error: err
                        },
                        token: null
                    })
                }
                return res.status(200).json({
                    success: true,
                    explanation: {
                        success: `Welcome back, ${user.dataValues.nicename}`
                    },
                    token: jwt.encode(user.dataValues, SECRET)
                })
            })
        })(req, res, next)
    }
}
