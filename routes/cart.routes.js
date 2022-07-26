const express = require('express');
const cartController = require('../controllers/cart.controller');

const router = express.Router();

// We omit the 'cart/' and set the prefix to the routes in the route middleware we use in app.js
router.get('/', cartController.getCart); // /cart/

router.post('/items', cartController.addCartItem); // /cart/items

router.patch('/items', cartController.updateCartItem); // (/cart/items) We are updating just some parts of existing data, so we use patch.

module.exports = router;
