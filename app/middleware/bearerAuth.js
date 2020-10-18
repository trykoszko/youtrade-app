const passport = require('passport')

const bearerAuth = (req, res, next) => {
    passport.authenticate('bearer', (err, user, info) => {
        if (err) {
            return res.status(400).json({
                success: false,
                explanation: 'login_error'
            })
        }
        if (!user) {
            return res.status(401).json({
                success: false,
                explanation: 'not_logged_in'
            })
        }
        req.logIn(user, err => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    explanation: err
                })
            }
            next()
        })
    })(req, res, next)
}

module.exports = bearerAuth
