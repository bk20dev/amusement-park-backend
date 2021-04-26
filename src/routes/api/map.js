const express = require('express');
const AttractionsController = require('../../controllers/attractions');

const router = express.Router();

// Attractions
router.get('/attractions', AttractionsController.getAll);
router.get('/attractions/:id', AttractionsController.getOne);
router.post('/attractions', AttractionsController.create);
router.delete('/attractions/:id', AttractionsController.delete);

module.exports = router;
