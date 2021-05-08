// Load .env file
require('dotenv').config();

// Import dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

const database = require('./connection/database');

// Import routes
const auth = require('./routes/auth');
const api = require('./routes/api');

// Configure Passport.js
require('./auth/passport');

// Create server
const app = express();
const port = process.env.PORT || 5000;

// Serve static files
app.use('/static', express.static(path.join(__dirname, '../static')));

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
database().then(() => {
  app.listen(port, () => console.log(`Server listening on port ${port}`));
});
