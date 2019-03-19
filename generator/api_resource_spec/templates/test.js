// Loads environment variables from .env.test
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.test') });

// Mongoose setup & configuration
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

// Chai configuration
const chai = require("chai");
chai.should();

// Connects to MongoDB
// Runs before all testing begins
before(() => {
  return new Promise((resolve, reject) => {
    console.log('Opening Database connection...')
    mongoose.connect(process.env.MONGO_DB_URI)
    mongoose.connection.once('open',  () => {
      console.log('Opened Database connection.')
      resolve();
    })
  })
})

// Import all library tests here
require('../src/lib/jwt.spec');
require('../src/lib/mailer.spec');
require('../src/lib/pagination.spec');

// Import all spec & integration tests here
require('../src/api/auth/auth.spec')
<%- specPaths=[] %>
<%- specPaths.join('\n') %>

// Runs after all tests are complete
after(() => {
  console.log('Closing Database connection.')
})
