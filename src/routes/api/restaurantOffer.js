const router = require('express').Router();
const common = require('../../controllers/common/common');
const only = require('../../middleware/secured');
const RestaurantOffer = require('../../models/restaurantOffer');

router.get('/', common.getAll(RestaurantOffer));
router.get('/:id', common.getOne(RestaurantOffer));
router.post('/', only.isAdmin, common.create(RestaurantOffer));
router.put('/:id', only.isAdmin, common.update(RestaurantOffer));
router.delete('/:id', only.isAdmin, common.deleteOne(RestaurantOffer));

module.exports = router;
