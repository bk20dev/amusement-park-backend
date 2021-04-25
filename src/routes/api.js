const express = require('express');
const authenticated = require('../middleware/authenticated');

const router = express.Router();

router.get('/public', (req, res) => res.send('Hello!'));
router.get('/user', authenticated, (req, res) => res.send(`Hello, ${req.user.name}!`));

module.exports = router;
