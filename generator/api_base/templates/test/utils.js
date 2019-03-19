const jwt = require('../src/lib/jwt');

// // // //

// TODO - this should be the USER MOCK?
const JWT_PAYLOAD = {
  _id: 12345,
  email: 'john@doe.com',
  admin: true,
  role: 'ADMIN'
};

// JWT_HEADER - valid, signed JSON Web Token that's
// used while testing API endpoints that require authorization
const JWT_HEADER = jwt.sign(JWT_PAYLOAD);

// // // //

module.exports = {
  JWT_PAYLOAD,
  JWT_HEADER
}
