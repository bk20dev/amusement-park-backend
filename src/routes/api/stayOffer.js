const router = require('express').Router();
const common = require('../../controllers/common/common');
const Offer = require('../../models/stayOffer');

router.get('/', common.getAll(Offer));
router.get('/:id', common.getOne(Offer));
router.post('/', common.create(Offer));
router.put('/:id', common.update(Offer));
router.delete('/:id', common.deleteOne(Offer));

module.exports = router;
