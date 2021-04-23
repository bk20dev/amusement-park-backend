// Load .env file
require('dotenv').config();

// Import dependencies
const express = require('express');

// Create server
const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
