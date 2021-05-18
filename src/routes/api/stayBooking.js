const router = require('express').Router();
const common = require('../../controllers/common/common');
const StayBooking = require('../../models/stayBooking');

router.get('/', common.getAll(StayBooking));
router.get('/:id', common.getOne(StayBooking));
router.post('/', common.create(StayBooking));
router.put('/:id', common.update(StayBooking));
router.delete('/:id', common.deleteOne(StayBooking));

module.exports = router;
