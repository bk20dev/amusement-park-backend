const router = require('express').Router();
const common = require('../../controllers/common/common');
const only = require('../../middleware/secured');
const favorites = require('../../controllers/api/favorites');
const Attraction = require('../../models/attraction');

// Attractions
router.get('/attractions', common.getAll(Attraction));
router.get('/attractions/:id', common.getOne(Attraction));
router.post('/attractions', only.isAdmin, common.create(Attraction));
router.put('/attractions/:id', only.isAdmin, common.update(Attraction));
router.delete('/attractions/:id', only.isAdmin, common.deleteOne(Attraction));

// Favorites
router.get('/favorites', only.signedIn, favorites.all);
router.post('/favorites', only.signedIn, favorites.add);
router.delete('/favorites', only.signedIn, favorites.remove);

module.exports = router;
