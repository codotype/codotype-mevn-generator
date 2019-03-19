const app = require('../../app');
const request = require('supertest');
const <%= schema.class_name %> = require('./<%= schema.identifier %>.model')
const { JWT_HEADER } = require('../../../test/utils');
const { <%= mockToken %> } = require('../../../test/mocks');

const API_ROOT = '/api/<%= schema.identifier_plural %>'

describe('<%= schema.label %> API', () => {

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

    it('unauthenticated request should respond with 403 forbidden', (done) => {
      request(app)
      .get(API_ROOT)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        done();
      });
    });
  });

  // // // //
  <%_ if (schema.identifier !== 'user') { _%>
  describe('POST /api/<%= schema.identifier_plural %>', () => {
    it('authenticated request should respond with JSON object', (done) => {
      request(app)
      .post(API_ROOT)
      .send(<%= mockToken %>)
      .set('authorization', JWT_HEADER)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        done();
      });
    });

    it('unauthenticated request should respond with 403 forbidden', (done) => {
      request(app)
      .post(API_ROOT)
      .send(<%= mockToken %>)
      .expect(401)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        done();
      });
    });
  });

  // // // //

  describe('GET /api/<%= schema.identifier_plural %>/:id', () => {

    // Stores <%= schema.identifier %>_instance in outer scope
    let <%= schema.identifier %>_instance

    // Creates <%= mockToken %> record before running tests
    before(() => {
      <%= schema.identifier %>_instance = new <%= schema.class_name %>(<%= mockToken %>)
      return <%= schema.identifier %>_instance.save()
    });

    // Destroys <%= mockToken %> record after running tests
    after(() => { return <%= schema.class_name %>.deleteOne(<%= schema.identifier %>_instance) });

    it('should respond with JSON object', (done) => {
      request(app)
      .get(`${API_ROOT}/${<%= schema.identifier %>_instance._id}`)
      .set('authorization', JWT_HEADER)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        done();
      });
    });
  });

  // // // //

  describe('PUT /api/<%= schema.identifier_plural %>/:id', () => {

    // Stores <%= schema.identifier %>_instance in outer scope
    let <%= schema.identifier %>_instance

    // Creates <%= mockToken %> record before running tests
    before(() => {
      <%= schema.identifier %>_instance = new <%= schema.class_name %>(<%= mockToken %>)
      return <%= schema.identifier %>_instance.save()
    });

    // Destroys <%= mockToken %> record after running tests
    after(() => { return <%= schema.class_name %>.deleteOne(<%= schema.identifier %>_instance) });

    it('should respond with JSON object', (done) => {
      request(app)
      .put(`${API_ROOT}/${<%= schema.identifier %>_instance._id}`)
      .send(<%= mockToken %>)
      .set('authorization', JWT_HEADER)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        done();
      });
    });
  });

  // // // //

  <%_ } _%>

});
