const app = require('../index')
const test = require('supertest')

describe('GET /ads', function () {
    it('should get a json with ads', function (done) {
        test(app)
            .get('/ads')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })
})

