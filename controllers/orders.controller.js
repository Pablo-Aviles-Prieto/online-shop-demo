const Order = require('../models/order.model');
const User = require('../models/user.model');

async function getOrders(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render('customer/orders/all-orders', { orders: orders });
  } catch (error) {
    next(error);
    return;
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  // With this we clear all the data from the cart, since the data is stored in the session and then passed to the res.locals
  req.session.cart = null;

  res.redirect('/orders');
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
};
