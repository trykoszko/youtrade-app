const app = require('../index')
const test = require('supertest')

/**
 * Testing get all user endpoint
 */
describe('GET /', function () {
    it('should get valid index page and return status 200', function (done) {
        test(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /html/)
            .expect(200, done)
    })
})

// describe('GET /', function () {
//     it('should get valid index page and return status 200', function (done) {
//         test(app)
//             .get('/')
//             .set('Accept', 'application/json')
//             // .expect('Content-Type', /html/)
//             .expect('Content-Type', /json/)
//             .expect(200, done)
//     })
// })

// /**
//  * Testing get a user endpoint by giving an existing user
//  */
// describe('GET /user/:id', function () {
//     it('respond with json containing a single user', function (done) {
//         test(app)
//             .get('/users/U001')
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200, done)
//     })
// })

// /**
//  * Testing get a user endpoint by giving a non-existing user
//  */
// describe('GET /user/:id', function () {
//     it('respond with json user not found', function (done) {
//         test(app)
//             .get('/users/idisnonexisting')
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(404) //expecting HTTP status code
//             .expect('"user not found"') // expecting content value
//             .end((err) => {
//                 if (err) return done(err)
//                 done()
//             })
//     })
// })

// /**
//  * Testing post user endpoint
//  */
// describe('POST /users', function () {
//     let data = {
//         "id": "1",
//         "name": "dummy",
//         "contact": "dummy",
//         "address": "dummy"
//     }
//     it('respond with 201 created', function (done) {
//         test(app)
//             .post('/users')
//             .send(data)
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(201)
//             .end((err) => {
//                 if (err) return done(err)
//                 done()
//             })
//     })
// })

// /**
//  * Testing post user endpoint
//  */
// describe('POST /users', function () {
//     let data = {
//         //no id
//         "name": "dummy",
//         "contact": "dummy",
//         "address": "dummy"
//     }
//     it('respond with 400 not created', function (done) {
//         test(app)
//             .post('/users')
//             .send(data)
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect('"user not created"')
//             .end((err) => {
//                 if (err) return done(err)
//                 done()
//             })
//     })
// })
