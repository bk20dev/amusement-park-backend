const express = require('express');
const common = require('../../controllers/common/common');
const Offer = require('../../models/offer');
const offer = require('../../controllers/api/offer');
const mongoReducer = require('../../helpers/mongoReducer');

const router = express.Router();

const customReducer = (initial) => {
  const { discountedPrice, ...rest } = initial;

  const price = rest.price;
  const discounted = Math.min(discountedPrice, rest.price); // Make sure discountedPrice is lower than normal price
  const discount = (1 - discounted / rest.price) * 100;

  rest.discount = parseInt(discount.toFixed(0));
  rest.price = price;

  return rest;
};

const fullReducer = (value) => customReducer(mongoReducer(value));

router.get('/', common.getAll(Offer, fullReducer));
router.post('/', common.create(Offer, fullReducer));
router.put('/:id', offer.update);
router.delete('/:id', common.deleteOne(Offer, fullReducer));

module.exports = router;
