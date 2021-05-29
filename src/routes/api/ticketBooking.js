const router = require('express').Router();
const common = require('../../controllers/common/common');
const only = require('../../middleware/secured');
const Booking = require('../../models/ticketBooking');

router.get('/', only.isAdmin, common.getAll(Booking));
router.get('/:id', common.getOne(Booking));
router.post('/', common.create(Booking));
router.put('/:id', only.isAdmin, common.update(Booking));
router.delete('/:id', only.isAdmin, common.deleteOne(Booking));

module.exports = router;
