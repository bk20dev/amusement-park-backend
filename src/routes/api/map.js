const express = require('express');
const AttractionsController = require('../../controllers/attractions');
const FavouriteAttractionsController = require('../../controllers/favourites');
const only = require('../../middleware/secured');

const router = express.Router();

// Attractions
router.get('/attractions', AttractionsController.getAll);
router.get('/attractions/:id', AttractionsController.getOne);
router.post('/attractions', AttractionsController.create);
router.put('/attractions/:id', AttractionsController.update);
router.delete('/attractions/:id', AttractionsController.delete);

// Favourites
router.get('/favourites', only.signedIn, FavouriteAttractionsController.all);
router.post('/favourites', only.signedIn, FavouriteAttractionsController.add);
router.delete('/favourites', only.signedIn, FavouriteAttractionsController.remove);

module.exports = router;
