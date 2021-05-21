const router = require('express').Router();
const common = require('../../controllers/common/common');
const createStayBooking = require('../../controllers/api/stayBooking');
const StayBooking = require('../../models/stayBooking');

router.get('/', common.getAll(StayBooking));
router.get('/:id', common.getOne(StayBooking));
router.post('/', createStayBooking);
router.put('/:id', common.update(StayBooking));
router.delete('/:id', common.deleteOne(StayBooking));

module.exports = router;
