const router = require('express').Router();
const common = require('../../controllers/common/common');
const Booking = require('../../models/ticketBooking');

router.get('/', common.getAll(Booking));
router.get('/:id', common.getOne(Booking));
router.post('/', common.create(Booking));
router.put('/:id', common.update(Booking));
router.delete('/:id', common.deleteOne(Booking));

module.exports = router;