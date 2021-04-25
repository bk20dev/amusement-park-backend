// Load .env file
require('dotenv').config();

// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

const connect = require('./db/connect');

// Import routes
const auth = require('./routes/auth');
const api = require('./routes/api');

// Configure Passport.js
require('./auth/passport');

// Create server
const app = express();
const port = process.env.PORT || 5000;

// Add middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// prettier-ignore
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Add routes
app.use(auth);
app.use(api);

// Connect to the database
// and start the server
connect().then(() => {
  app.listen(port, () => console.log(`Server listening on port ${port}`));
});
