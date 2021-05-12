const router = require('express').Router();
const common = require('../../controllers/common/common');
const restaurant = require('../../controllers/api/restaurant');
const Restaurant = require('../../models/restaurant');

router.get('/', common.getAll(Restaurant));
router.get('/:id', common.getOne(Restaurant));
router.post('/', common.create(Restaurant));
router.put('/:id', restaurant);
router.delete('/:id', common.deleteOne(Restaurant));

module.exports = router;
