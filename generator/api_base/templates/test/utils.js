const jwt = require('../server/lib/jwt');

// // // //

const JWT_PAYLOAD = {
  id: 12345,
  username: 'aeksco'
};

// JWT_HEADER - valid, signed JSON Web Token that's
// used while testing API endpoints that require authorization
const JWT_HEADER = jwt.sign(JWT_PAYLOAD);

// // // //

module.exports = {
    JWT_PAYLOAD,
    JWT_HEADER
}
