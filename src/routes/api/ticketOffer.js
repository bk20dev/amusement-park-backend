const router = require('express').Router();
const common = require('../../controllers/common/common');
const mongoReducer = require('../../helpers/mongoReducer');
const only = require('../../middleware/secured');
const Offer = require('../../models/ticketOffer');

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
router.get('/:id', common.getOne(Offer, fullReducer));
router.post('/', only.isAdmin, common.create(Offer));
router.put('/:id', only.isAdmin, common.update(Offer));
router.delete('/:id', only.isAdmin, common.deleteOne(Offer));

module.exports = router;
