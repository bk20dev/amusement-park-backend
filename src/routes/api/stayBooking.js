const router = require('express').Router();
const common = require('../../controllers/common/common');
const createStayBooking = require('../../controllers/api/stayBooking');
const only = require('../../middleware/secured');
const StayBooking = require('../../models/stayBooking');

router.get('/', only.isAdmin, common.getAll(StayBooking));
router.get('/:id', common.getOne(StayBooking));
router.post('/', createStayBooking);
router.put('/:id', only.isAdmin, common.update(StayBooking));
router.delete('/:id', only.isAdmin, common.deleteOne(StayBooking));

module.exports = router;
