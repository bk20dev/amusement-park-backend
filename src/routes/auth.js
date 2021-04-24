const express = require('express');
const { signup } = require('../controllers/auth');

const router = express.Router();

router.post('/signup', signup);

module.exports = router;
