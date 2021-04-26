const express = require('express');
const map = require('./api/map');

const router = express.Router();

router.use('/map', map);

module.exports = router;
