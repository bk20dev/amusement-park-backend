const express = require('express');
const attractions = require('../../controllers/api/attractions');
const favourite = require('../../controllers/api/favourites');
const only = require('../../middleware/secured');

const router = express.Router();

// Attractions
router.get('/attractions', attractions.all);
router.get('/attractions/:id', attractions.one);
router.post('/attractions', attractions.create);
router.put('/attractions/:id', attractions.update);
router.delete('/attractions/:id', attractions.delete);

// Favourites
router.get('/favourites', only.signedIn, favourite.all);
router.post('/favourites', only.signedIn, favourite.add);
router.delete('/favourites', only.signedIn, favourite.remove);

module.exports = router;
