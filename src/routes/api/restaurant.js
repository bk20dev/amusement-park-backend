const router = require('express').Router();
const common = require('../../controllers/common/common');
const Restaurant = require('../../models/restaurant');

router.get('/', common.getAll(Restaurant));
router.get('/:id', common.getOne(Restaurant));
router.post('/', common.create(Restaurant));
router.put('/:id', common.update(Restaurant));
router.delete('/:id', common.deleteOne(Restaurant));

module.exports = router;
