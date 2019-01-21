const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')

// // // //

// Password encryption helper function
// function encryptPassword (password) {
//     return crypto.createHmac('sha1', process.env.PASSWORD_ENCRYPTION_SECRET)
//     .update(password)
//     .digest('base64')
// }

// Crypto library variables
const defaultIterations = 10000;
const defaultKeyLength = 64;
const defaultDigest = 'sha512';

function encryptPassword (password, salt) {

  // TOOD - throw error here?
  if (!password || !salt) { return null; }

  const saltBuf = new Buffer(salt, 'base64');

  return crypto.pbkdf2Sync(password, saltBuf, defaultIterations, defaultKeyLength, defaultDigest).toString('base64');
}

const collection_options = {
  timestamps: {
    createdAt: 'createdOn',
    updatedAt: 'updatedOn'
  },
  versionKey: false
}

const userAttributes = {
  email: {
    type: String, // TODO - email validation?
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  salt: {
    type: String,
    required: true,
    select: false
  },
  password_reset_token: {
    type: String,
    select: false
  },
  password_reset_expiration: {
    type: Date,
    select: false
  },
  admin: {
    type: Boolean,
    default: false
  },
  <%_ schema.attributes.forEach((attr) => { _%>
  <%_ if (attr.datatype.identifier === 'email') { return } _%>
  <%_ if (attr.datatype === 'BOOL') { _%>
  <%_ return _%>
  <%_ } else if (attr.datatype === 'BOOL') { _%>
  <%= attr.identifier %>: {
    type: Boolean
  },
  <%_ } else if (attr.datatype === 'NUMBER') { _%>
  <%= attr.identifier %>: {
    type: Number,
    required: <%= attr.required %>,
    unique: <%= attr.unique %>
  },
  <%_ } else if (attr.datatype === 'STRING_ARRAY') { _%>
  <%= attr.identifier %>: [{
    type: String,
    required: <%= attr.required %>,
    unique: <%= attr.unique %>
  }],
  <%_ } else { _%>
  <%= attr.identifier %>: {
    type: String,
    required: <%= attr.required %>,
    unique: <%= attr.unique %>
  },
  <%_ } _%>
  <%_ }) _%>

  <%_ schema.relations.forEach((rel) => { _%>
  <%_ if (rel.type === 'BELONGS_TO') { _%>
  <%= rel.alias.identifier %>: {
    type: Schema.Types.ObjectId,
    ref: '<%= rel.schema.class_name %>'
  },
  <%_ } else if (rel.type === 'HAS_MANY') { _%>
  <%= rel.alias.identifier %>_ids: [{
    type: Schema.Types.ObjectId,
    ref: '<%= rel.schema.class_name %>'
  }],
  <%_ } _%>
  <%_ }) _%>
}

// // // //

const <%= schema.class_name %>Model = new Schema(userAttributes, collection_options);

// // // //

// Create new User document
// UserModel.statics.create = function ({ <%= inlineDeconstrction %>, password }) {

//     // Instantiates new User model with all required attributes
//     // TODO - add required attributes here
//     const user = new this({ <%= inlineDeconstrction %>, password: encryptPassword(password) })

//     // Return User.save() Promise
//     return user.save()
// }

// findOneByEmail
// Find one User by email
// TODO - should be findOneByEmail
UserModel.statics.findOneByEmail = function (email) {
    return this.findOne({ email })
    .select('_id email password salt password_reset_token password_reset_expiration')
    .exec()
}

// verify
// Verifies the password parameter of POST /auth/login requests
UserModel.method('verify', function (password) {
  console.log('VERIFY')
  console.log(password)
  console.log(this.password)
  console.log(this.salt)
  console.log(this)
  const encryptedPassword = encryptPassword(password, this.salt)
  return this.password === encryptedPassword
})

// Return true if the reset token is valid for this user
UserModel.method('validResetToken', function(token){
  return this.password_reset_token === token && new Date() < this.password_reset_expiration
})

// TODO - document & test
UserModel.method('makeSalt', function (byteSize) {
  const defaultByteSize = 16;

  if (!byteSize) { byteSize = defaultByteSize; }

  return crypto.randomBytes(byteSize).toString('base64')

  // return crypto.randomBytes(byteSize, (err, salt) => {
  //   if (err) {
  //     callback(err);
  //   } else {
  //     callback(null, salt.toString('base64'));
  //   }
  // });
})


const validatePresenceOf = (value) => {
  return value && value.length;
}

// TODO - document & test
// UserModel.pre('update', (next) => {
//   console.log('PRE UPDATE')
//   console.log('PRE UPDATE')
//   console.log('PRE UPDATE')
//   console.log(this)
// })

// TODO - document & test
UserModel.pre('validate', function (next) {

  console.log(this)
  console.log(this.password)
  console.log(this.salt)
  console.log("PRE SAVE PRE SAVE")
  console.log("PRE SAVE PRE SAVE")
  console.log("PRE SAVE PRE SAVE")

  // Handle new/update passwords
  if (!this.isModified('password')) {
    console.log('PASSWORD NOT MODIFIED')
    console.log('PASSWORD NOT MODIFIED')
    return next();
  }

  // TODO - DOCUMENT
  if (!validatePresenceOf(this.password)) {
    console.log('INVALID PASSWORD')
    console.log('INVALID PASSWORD')
    console.log('INVALID PASSWORD')
    next(new Error('Invalid password'));
  }

  // TODO - DOCUMENT
  // Make salt with a callback

  // TODO - DOCUMENT
  const salt = this.makeSalt()
  console.log("MADE SALT")
  this.salt = salt;

  console.log(this.salt)
  console.log(this.password)

  // TODO - DOCUMENT
  const hashedPassword = encryptPassword(this.password, this.salt)

  console.log("MADE HASHED PASSWORD")
  console.log(hashedPassword)

  // TODO - DOCUMENT
  this.password = hashedPassword;

  console.log("NEXT?")
  console.log("NEXT?")
  console.log("NEXT?")
  next();

});


// assignAdmin
// Assigns admin priviledges to a user
UserModel.method('assignAdmin', function () {
    // Assigns true to `admin` attribute
    this.admin = true

    // Returns `save` Promise
    return this.save()
})

<%_ schema.relations.forEach((rel) => { _%>
<%_ if (rel.type === 'BELONGS_TO') { _%>

<%= schema.class_name %>Model.methods.get<%= rel.alias.class_name %> = function () {
  return mongoose.model('<%= rel.schema.class_name %>').findById(this.<%= rel.alias.identifier + '_id' %>);
}

<%_ } else if (rel.type === 'HAS_MANY') { _%>

<%= schema.class_name %>Model.methods.get<%= rel.alias.class_name_plural %> = function () {
  return mongoose.model('<%= rel.schema.class_name %>').find({ <%= schema.identifier %>_id: this._id });
}

<%_ } else if (rel.type === 'HAS_ONE') { _%>

<%= schema.class_name %>Model.methods.get<%= rel.alias.class_name %> = function () {
  return mongoose.model('<%= rel.schema.class_name %>').findById(this.<%= rel.identifier + '_id' %> });
}

<%_ } _%>
<%_ }) _%>

// TODO - absract schema.class_name
module.exports = mongoose.model('<%= schema.class_name %>', <%= schema.class_name %>Model)
