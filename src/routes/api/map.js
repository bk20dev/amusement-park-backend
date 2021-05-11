const express = require('express');
const common = require('../../controllers/common/common');
const only = require('../../middleware/secured');
const Attraction = require('../../models/attraction');
const attractions = require('../../controllers/api/attractions');
const favourite = require('../../controllers/api/favourites');

const router = express.Router();

// Attractions
router.get('/attractions', common.getAll(Attraction));
router.get('/attractions/:id', common.getOne(Attraction));
router.post('/attractions', common.create(Attraction));
router.put('/attractions/:id', attractions.update);
router.delete('/attractions/:id', common.deleteOne(Attraction));

// Favourites
router.get('/favourites', only.signedIn, favourite.all);
router.post('/favourites', only.signedIn, favourite.add);
router.delete('/favourites', only.signedIn, favourite.remove);

module.exports = router;
