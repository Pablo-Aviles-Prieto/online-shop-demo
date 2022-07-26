const express = require('express');
const ordersController = require('../controllers/orders.controller');

const router = express.Router();

// We register the prefix of (/orders) in app.js
router.post('/', ordersController.addOrder);

router.get('/', ordersController.getOrders);

module.exports = router;
