const Cart = require('../models/cart.model');

// This middleware will look at the inc request and determining wheter its coming from a user who already has a cart or who doesnt have a cart yet.
function initializeCart(req, res, next) {
  let cart;

  // Firstly we check if there is a cart in the session (e.g. a user visiting for first time the page wont have it).
  // Also, in case that the cart exists and was initialized previously, we want to get the information calling the class and passing to it the session.cart.items stored (the items property is defined in the cart.model).
  if (!req.session.cart) {
    // We create a new cart
    cart = new Cart();
  } else {
    // Here we reinitialized based on an old cart session, but we use the class to make sure that it has the class methods available to use (since the way the data is stored in a session works such that any methods that might've been attached to an object are no stored there. So it would have the items property but not the methods of the class blueprint).
    const sessionCart = req.session.cart;
    cart = new Cart(
      sessionCart.items,
      sessionCart.totalQuantity,
      sessionCart.totalPrice
    );
  }

  // We want this cart info available in all the other middleware functs and views.
  res.locals.cart = cart;

  next();
}

module.exports = initializeCart;
