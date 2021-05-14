const express = require('express');
const common = require('../../controllers/common/common');
const only = require('../../middleware/secured');
const Attraction = require('../../models/attraction');
const favorites = require('../../controllers/api/favorites');

const router = express.Router();

// Attractions
router.get('/attractions', common.getAll(Attraction));
router.get('/attractions/:id', common.getOne(Attraction));
router.post('/attractions', common.create(Attraction));
router.put('/attractions/:id', common.update(Attraction));
router.delete('/attractions/:id', common.deleteOne(Attraction));

// Favorites
router.get('/favorites', only.signedIn, favorites.all);
router.post('/favorites', only.signedIn, favorites.add);
router.delete('/favorites', only.signedIn, favorites.remove);

module.exports = router;
