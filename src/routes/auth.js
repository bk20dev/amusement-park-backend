const express = require('express');
const AuthController = require('../controllers/auth');
const only = require('../middleware/secured');

const router = express.Router();

router.post('/signup', only.signedOut, AuthController.signup);
router.post('/verification', only.signedOut, AuthController.verification);
router.post('/signin', only.signedOut, AuthController.signin);
router.get('/signout', only.signedIn, AuthController.signout);
router.get('/reset', AuthController.sendPasswordResetEmail);
router.post('/reset', AuthController.resetPassword);

module.exports = router;
