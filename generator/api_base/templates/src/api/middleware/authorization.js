const jwt = require('jsonwebtoken')

// // // //

// Authorization middleware - rejects requests
// with missing, invalid, or expired tokens.
module.exports.requireAuthenticated = function (req, res, next) {

  // Isolates token
  let token = req.headers.authorization;

  // Reject requests without token
  if (!token) {

    // Returns 'missing token' message
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Authorization token missing.' }));
    return;

  }

  // Reject tokens with incorrect format
  else if (token.indexOf('JWT ') != 0) {

    // Returns 'invalid token' message
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid authorization token.' }));
    return;

  }

  // Ensure validity of token and presence in Redis
  else {

    // Isolates Token from 'JWT ' prefix
    token = token.split('JWT ')[1];

    // Ensure validity of token
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {

      // Verification error
      if (err) {
        // 401 Unauthorized
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid token format.' }));
        return;
      }

      // Isolates values from decoded token
      const user_id = decoded.id;
      const email = decoded.email;
      const admin = decoded.admin;
      const issuedAt = decoded.iat; // NOTE - unused

      // Success - user is authorized
      // Attach the req.user object to be used in the application's controllers
      req.user = { id: user_id, email: email, admin: admin  };

      // Continue through this middleware to the original request
      next();
      return;

    });

  }

};


// Rejects requests for non-admin users
module.exports.requireAdmin = function (req, res, next) {

  // Reject requests from non-admin users
  if (!req.user.admin) {

    // Returns 'missing token' message
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'You are not authorized for this API endpoint' }));
    return;

  }

  // Continue through this middleware to the original request
  next();
  return;

};
