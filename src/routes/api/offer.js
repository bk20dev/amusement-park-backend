const express = require('express');
const common = require('../../controllers/common/common');
const Offer = require('../../models/offer');

const router = express.Router();

router.get('/', common.getAll(Offer));
router.post('/', common.create(Offer));
router.delete('/:id', common.deleteOne(Offer));

module.exports = router;
