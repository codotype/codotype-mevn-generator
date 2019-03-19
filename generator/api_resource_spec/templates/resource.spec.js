const app = require('../../app');
const request = require('supertest');
const User = require('../user/user.model')
const { JWT_HEADER } = require('../../../test/utils');
const { USER_MOCK, USER_MOCK_ALT } = require('../../../test/mocks');

const API_ROOT = '/api/<%= schema.identifier_plural %>'

describe('<%= schema.label %> API', () => {

  // Creates USER_MOCK record before running tests
  // before(() => {
  //   let user = new User(USER_MOCK)
  //   return user.save()
  // });

  // // Destroys USER_MOCK record after running tests
  // after(() => { return User.deleteOne({ email: USER_MOCK.email }) });

  // // // //

  describe('GET /api/<%= schema.identifier_plural %>', () => {
    it('authenticated request should respond with JSON object', (done) => {
      request(app)
      .get(API_ROOT)
      .set('authorization', JWT_HEADER)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        done();
      });
    });

    // it('unauthenticated request should respond with 403 forbidden', (done) => {
    //   request(app)
    //   .get(API_ROOT)
    //   .expect(401)
    //   .end((err, res) => {
    //     if (err) return done(err);
    //     res.body.should.be.instanceof(Object);
    //     done();
    //   });
    // });
  });

  // describe('POST /api/<%= schema.identifier_plural %>', () => {
  //   it('should respond with JSON object', (done) => {
  //     request(app)
  //     .post(API_ROOT)
  //     .send({
  //       <%_ schema.attributes.forEach((attr, index) => { _%>
  //       <%= attr.identifier %>: '<%= attr.default_value %>'<%= helpers.trailingComma(schema.attributes, index) %>
  //       <%_ }) _%>
  //     })
  //     .expect(401)
  //     .expect('Content-Type', /json/)
  //     .end((err, res) => {
  //       if (err) return done(err);
  //       res.body.should.be.instanceof(Object);
  //       done();
  //     });
  //   });
  // });

  // describe('GET /api/<%= schema.identifier_plural %>/:id', () => {
  //   it('should respond with JSON object', (done) => {
  //     request(app)
  //     .get(API_ROOT + '/1')
  //     .expect(401)
  //     .expect('Content-Type', /json/)
  //     .end((err, res) => {
  //       if (err) return done(err);
  //       res.body.should.be.instanceof(Object);
  //       done();
  //     });
  //   });
  // });

  // describe('PUT /api/<%= schema.identifier_plural %>/:id', () => {
  //   it('should respond with JSON object', (done) => {
  //     request(app)
  //     .put(API_ROOT + '/1')
  //     .send({
  //       <%_ schema.attributes.forEach((attr, index) => { _%>
  //       <%= attr.identifier %>: '<%= attr.default_value %>'<%= helpers.trailingComma(schema.attributes, index) %>
  //       <%_ }) _%>
  //     })
  //     .expect(401)
  //     .expect('Content-Type', /json/)
  //     .end((err, res) => {
  //       if (err) return done(err);
  //       res.body.should.be.instanceof(Object);
  //       done();
  //     });
  //   });
  // });

});
