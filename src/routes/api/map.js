const express = require('express');
const AttractionsController = require('../../controllers/attractions');
const FavouriteAttractionsController = require('../../controllers/favourite');

const router = express.Router();

// Attractions
router.get('/attractions', AttractionsController.getAll);
router.get('/attractions/:id', AttractionsController.getOne);
router.post('/attractions', AttractionsController.create);
router.put('/attractions/:id', AttractionsController.update);
router.delete('/attractions/:id', AttractionsController.delete);

router.get('/favourites', FavouriteAttractionsController.all);
router.post('/favourites', FavouriteAttractionsController.add);
router.delete('/favourites', FavouriteAttractionsController.remove);

module.exports = router;
