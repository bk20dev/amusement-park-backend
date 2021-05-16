const router = require('express').Router();
const common = require('../../controllers/common/common');
const Accommodation = require('../../models/accommodation');

router.get('/', common.getAll(Accommodation));
router.get('/:id', common.getOne(Accommodation));
router.post('/', common.create(Accommodation));
router.put('/:id', common.update(Accommodation));
router.delete('/:id', common.deleteOne(Accommodation));

module.exports = router;
