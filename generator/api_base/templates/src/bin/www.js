require('dotenv').config()
const app = require('../app')
const mongoose = require('mongoose')

// Mongoose Deprecations
// https://mongoosejs.com/docs/deprecations.html
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

// // // //

// TODO - is this needed?
mongoose.Promise = global.Promise

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_URI)

// Instantiates new Mongoose connection
const db = mongoose.connection

// Handles Mongoose connection error
db.on('error', console.error)

// Open Mongoose connection
db.once('open', () => {

    // TODO - use Morgan for logging
    console.info('Connected to MongoDB...')

    // Starts Express App
    app.listen(process.env.PORT, () => {
        // TODO - use Morgan for logging
        console.info(`Express is running on port ${process.env.PORT}`)
    })
})
