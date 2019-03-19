const request = require('supertest');
const app = require('../../app');
const User = require('../user/user.model');
const { JWT_PAYLOAD, JWT_HEADER } = require('../../../test/utils');
const { USER_MOCK } = require('../../../test/mocks');

// // // //

const API_ROOT = '/api/auth'

describe('Auth API', () => {
  describe('POST /api/auth/login', () => {

    // Creates USER_MOCK record before running tests
    // before(() => { return User.create(USER_MOCK) });

    // Destroys USER_MOCK after running tests
    // after(() => { return User.destroy({ where: { email: USER_MOCK.email } }) });

    it('should authenticate user', (done) => {
      // Pulls email & password from USER_MOCK
      const { email, password } = USER_MOCK;

      request(app)
      .post(API_ROOT + '/login')
      .send({ email, password })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        done();
      });
    });

    it('should NOT authenticate user', (done) => {
      // Pulls email & password from USER_MOCK
      const { email } = USER_MOCK;
      const password = 'not MY password';

      request(app)
      .post(API_ROOT + '/login')
      .send({ email, password })
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        done();
      });
    });
  });

  // NOTE - we don't create a database level user for this test
  // We skip this step because in order to possess a valid token,
  // the user must exist in the database. Here we simply pass a valid
  // token in and receive a subset of its verified return value
  // describe('GET /api/auth/profile', () => {
  //   it('should respond with current user', (done) => {
  //     request(app)
  //     .get(API_ROOT + '/profile')
  //     .set('authorization', JWT_HEADER)
  //     .expect(200, JWT_PAYLOAD)
  //     .end((err, res) => {
  //       if (err) return done(err);
  //       res.body.should.be.instanceof(Object);
  //       done();
  //     });
  //   });

  //   it('should NOT respond with current user', (done) => {
  //     const token = "not even close to a valid token are you joking";

  //     request(app)
  //     .get(API_ROOT + '/profile')
  //     .set('authorization', token)
  //     .expect(403)
  //     .end((err, res) => {
  //       if (err) return done(err);
  //       res.body.should.be.instanceof(Object);
  //       done();
  //     });
  //   });
  // });

});
