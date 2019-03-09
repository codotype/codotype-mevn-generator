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

// Helper function for validating emails
function validateEmail (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}

const userAttributes = {
  email: {
    type: String,
    index: true,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
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
  <%_ schema.attributes.filter(a => a.identifier !== 'email').forEach((attr) => { _%>
  <%_ if (attr.datatype === DATATYPE_BOOLEAN) { _%>
  <%= attr.identifier %>: {
    type: Boolean
  },
  <%_ } else if (attr.datatype === DATATYPE_NUMBER) { _%>
  <%= attr.identifier %>: {
    type: Number,
    required: <%= attr.required %>,
    unique: <%= attr.unique %>
  },
  <%_ } else if (attr.datatype === DATATYPE_STRING_ARRAY) { _%>
  <%= attr.identifier %>: [{
    type: String,
    trim: true,
    required: <%= attr.required %>,
    unique: <%= attr.unique %>
  }],
  <%_ } else { _%>
  <%= attr.identifier %>: {
    type: String,
    trim: true,
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

// findOneByEmail
// Find one User by email
// TODO - should be findOneByEmail
UserModel.statics.findOneByEmail = function (email) {
    return this.findOne({ email })
    .select('_id email admin role password salt password_reset_token password_reset_expiration')
    .exec()
}

// verify
// Verifies the password parameter of POST /auth/login requests
UserModel.method('verify', function (password) {
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
})


const validatePresenceOf = (value) => {
  return value && value.length;
}

// TODO - document & test
UserModel.pre('validate', function (next) {

  // Handle new/update passwords
  if (!this.isModified('password')) {
    return next();
  }

  // TODO - DOCUMENT
  if (!validatePresenceOf(this.password)) {
    next(new Error('Invalid password'));
  }

  // TODO - DOCUMENT
  const salt = this.makeSalt()
  this.salt = salt;

  // TODO - DOCUMENT
  const hashedPassword = encryptPassword(this.password, this.salt)

  // TODO - DOCUMENT
  this.password = hashedPassword;

  // Continues to remaining middleware
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
