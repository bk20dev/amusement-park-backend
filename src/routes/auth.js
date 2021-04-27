const express = require('express');
const AuthController = require('../controllers/auth');

const router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);
router.get('/signout', AuthController.signout);

module.exports = router;
