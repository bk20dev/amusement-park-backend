const router = require('express').Router();
const common = require('../../controllers/common/common');
const RestaurantOffer = require('../../models/restaurantOffer');

router.get('/', common.getAll(RestaurantOffer));
router.get('/:id', common.getOne(RestaurantOffer));
router.post('/', common.create(RestaurantOffer));
router.put('/:id', common.update(RestaurantOffer));
router.delete('/:id', common.deleteOne(RestaurantOffer));

module.exports = router;
