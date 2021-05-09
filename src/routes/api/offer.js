const express = require('express');
const offer = require('../../controllers/api/offer');

const router = express.Router();

router.get('/', offer.all);
router.post('/', offer.create);
router.delete('/:id', offer.delete);

module.exports = router;
