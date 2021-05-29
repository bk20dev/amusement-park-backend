const router = require('express').Router();
const common = require('../../controllers/common/common');
const only = require('../../middleware/secured');
const Offer = require('../../models/stayOffer');

router.get('/', common.getAll(Offer));
router.get('/:id', common.getOne(Offer));
router.post('/', only.isAdmin, common.create(Offer));
router.put('/:id', only.isAdmin, common.update(Offer));
router.delete('/:id', only.isAdmin, common.deleteOne(Offer));

module.exports = router;
