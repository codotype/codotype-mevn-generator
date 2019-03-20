<%_ schema.relations.forEach((rel) => { _%>
<%_ if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
describe('GET /api/<%= schema.identifier_plural %>/:id/<%= rel.alias.identifier %>', () => {

  // Stores <%= schema.identifier %>_instance in outer scope
  let <%= schema.identifier %>_instance

  // Creates <%= mockToken %> record before running tests
  before(() => {
    <%= schema.identifier %>_instance = new <%= schema.class_name %>(<%= mockToken %>)
    return <%= schema.identifier %>_instance.save()
  });

  // Destroys <%= mockToken %> record after running tests
  after(() => { return <%= schema.class_name %>.deleteOne(<%= schema.identifier %>_instance) });

  it('authenticated request should respond with JSON object', (done) => {
    request(app)
    .get(`${API_ROOT}/${<%= schema.identifier %>_instance._id}/<%= rel.alias.identifier %>`)
    .set('authorization', JWT_HEADER)
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      res.body.should.be.instanceof(Object);
      done();
    });
  });
});

// // // //
<% } else if (['HAS_MANY', 'REF_BELONGS_TO'].includes(rel.type)) { %>
// GET /api/<%= schema.identifier_plural %>/:id/<%= rel.schema.identifier_plural %> show<%= rel.schema.class_name_plural %>

describe('GET /api/<%= schema.identifier_plural %>/:id/<%= rel.alias.identifier_plural %>', () => {

  // Stores <%= schema.identifier %>_instance in outer scope
  let <%= schema.identifier %>_instance

  // Creates <%= mockToken %> record before running tests
  before(() => {
    <%= schema.identifier %>_instance = new <%= schema.class_name %>(<%= mockToken %>)
    return <%= schema.identifier %>_instance.save()
  });

  // Destroys <%= mockToken %> record after running tests
  after(() => { return <%= schema.class_name %>.deleteOne(<%= schema.identifier %>_instance) });

  it('authenticated request should respond with JSON object', (done) => {
    request(app)
    .get(`${API_ROOT}/${<%= schema.identifier %>_instance._id}/<%= rel.alias.identifier_plural %>`)
    .set('authorization', JWT_HEADER)
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      res.body.should.be.instanceof(Object);
      done();
    });
  });
});

// // // //

<%_ } _%>
<%_ }) _%>