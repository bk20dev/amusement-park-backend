// Load .env file
require('dotenv').config();

// Import dependencies
const express = require('express');
const connect = require('./db/connect');

// Create server
const app = express();
const port = process.env.PORT || 5000;

// Connect to the database
// and start the server
connect().then(() => {
  app.listen(port, () => console.log(`Server listening on port ${port}`));
});
