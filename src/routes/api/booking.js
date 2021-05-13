const router = require('express').Router();
const common = require('../../controllers/common/common');
const Booking = require('../../models/booking');

router.get('/', common.getAll(Booking));
router.get('/:id', common.getOne(Booking));
router.post('/', common.create(Booking));
router.delete('/:id', common.deleteOne(Booking));

module.exports = router;
