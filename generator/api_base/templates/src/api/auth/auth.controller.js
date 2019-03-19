const crypto = require('crypto')
const User = require('../user/user.model')
const Mailer = require('../../lib/mailer')
const jwt = require('../../lib/jwt')

// // // //

// POST /api/auth/register
// { <%= inlineDeconstrction %>, password }
exports.register = (req, res) => {

  // Pulls parameters from req.body
  const { <%= inlineDeconstrction %>, password } = req.body

  // Create a new User instance if one does not exist
  const create = (user) => {
    // User exists - throw error and return
    if (user) {
      throw new Error('User exists')
      return
    }

    // Creates a new User
    const newUser = new User({ <%= inlineDeconstrction %>, password })
    // TODO - RE-INTEGRATE USER ROLE, REPLACE ADMIN BOOLEAN
    // newUser.role = ''
    return newUser.save()
  }

  // Respond to the client
  const respond = (user) => {
    res.json({
      message: 'Registered Successfully.'
    })
  }

  // Handle error (email exists)
  const onError = (error) => {
    res.status(409).json({
      message: error.message
    })
  }

  // check email duplication
  User.findOneByEmail(email)
  .then(create)
  .then(respond)
  .catch(onError)
}

// // // //

// POST /api/auth/login
// { email, password }
exports.login = (req, res) => {

  // Gathers email, password
  const { email, password } = req.body

  // Ensures presence of the User in the database
  // Verifies the supplied password against the database
  // Sends user data & token to the client if verifications pass
  const respond = (user) => {

    // User does NOT exist
    if (!user) {
      throw new Error('Login failed - user does not exist.')
      return
    }

    // User does exists - verify the password parameter
    if (!user.verify(password)) {
      throw new Error('Login failed - invalid password.')
      return
    }

    // Isolates the User's MongoDB ID
    let user_id = user._id.toString()

    // Assembles response_payload
    const response_payload = {
      _id: user_id,
      email: user.email,
      admin: user.admin,
      role: user.role,
      token: jwt.sign(user)
    };

    // TODO - abstract HEADER
    // TODO - can this be simplified?
    const CONTENT_TYPE_JSON = { 'Content-Type': 'application/json' };

    // 200 OK - send user data & token to client
    res.writeHead(200, CONTENT_TYPE_JSON);
    res.end(JSON.stringify(response_payload));
    return;
  }

  // Error handling
  const onError = (error) => {
    res.status(401).json({
      message: error.message
    })
  }

  // Find the user
  // TODO - replace `findOneByEmail` with Mongoose 5.x query syntax
  User.findOneByEmail(email)
  .then(respond)
  .catch(onError)
}

// // // //

// POST /api/auth/forgot_password
exports.forgot_password = async (req, res) => {

  // Isolates user's email
  const userEmail = req.body.email;

  // TODO - send error if no email is supplied

  // Finds the User model associated with the email
  const user = await User.findOne({ email: userEmail.toLowerCase() })
  .catch(err => res.status(401).json(err) )

  // Handle invalid email address
  if (!user) return res.status(400).json({ message: 'Invalid email address' })

  // Creates a random password reset token for the user
  let buf = await crypto.randomBytes(12)
  const passwordResetToken = buf.toString('hex');

  // Calculates tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Assigns user password reset variables
  user.password_reset_expiration = tomorrow;
  user.password_reset_token = passwordResetToken;

  // Saves the user model
  await user.save().catch(err => res.status(422).json(err) );

  // Assembles email
  const dispatch = {
    sender: '<%= blueprint.label %> <worker@<%= blueprint.identifier %>.com>',
    subject: '<%= blueprint.label %> Password Reset',
    recipient: user.email,
    text: "Your password reset token is " + [process.env.APP_ADDRESS + '#/auth/reset_password?token=' + user.password_reset_token].join('')
  }

  // Dispatches password reset token to user
  Mailer.dispatch(dispatch)

  // Sends success message to client
  return res.status(200).json({ success: true })
}

// // // //

// POST /api/auth/reset_password
exports.reset_password = async (req, res) => {

  // Isolates user password & password_reset_token
  const password = req.body.password;
  const password_reset_token = req.body.password_reset_token;

  // Ensures presence of password & password_reset_token
  if (!password || !password_reset_token) return res.status(401).json({ type: 'MISSING_PASSWORD_RESET_TOKEN' })

  // Finds the User model associated with the password_reset_token
  const user = await User.findOne({ password_reset_token: password_reset_token })
  .select('_id email password salt password_reset_token password_reset_expiration')
  .catch(err => res.status(401).json(err) )

  // Return error if no user is found with a matching password_reset_token
  if (!user) return res.status(401).json({ type: 'INVALID_PASSWORD_RESET_TOKEN' })

  // Ensures the validity of the reset token
  if (user.validResetToken(password_reset_token)) {

    // Assigns user.password
    user.password = password

    // Clears the verified value for password_reset_token and password_reset_expiration
    user.password_reset_token = ''
    user.password_reset_expiration = ''

    // Saves the updated user & handles error
    await user.save()
    .catch((err) => {
    console.log(err) // TODO - HANDLE ERROR
    res.status(422).json(err)
    })

    // Sends a success message to the client
    return res.status(200).json({ success: true })
  }

  // Sends error message to client
  return res.status(403).json({ forbidden: true })
}

