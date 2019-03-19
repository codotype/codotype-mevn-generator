const jwt = require('./jwt');
const assert = require('chai').assert;
const { JWT_PAYLOAD } = require('../../test/utils');

// // // //

describe('/lib/jwt.js', () => {
  describe('sign valid token', () => {
    it('verify signed JWT should equal original payload', () => {
      // Stores the token generated by jwt.sign(...)
      let token = jwt.sign(JWT_PAYLOAD);

      // Verifies the payload
      let verify_payload = jwt.verify(token);

      // Asserts equality of original payload and signed/verified payload
      // assert.equal(JWT_PAYLOAD.id, verify_payload.id);
      assert.equal(JWT_PAYLOAD.email, verify_payload.email);
    });
  });
});
