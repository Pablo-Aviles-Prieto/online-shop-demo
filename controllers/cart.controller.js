const Product = require('../models/product.model');

function getCart(req, res) {
  res.render('customer/cart/cart');
}

// We are using a middleware because we need to access the session of a user and access to the cart to use the addItem() method declared in the model.
// That middleware we mentioned, will look at the inc request and determining wheter its coming from a user who already has a cart or who doesnt have a cart yet.
async function addCartItem(req, res) {
  let product;
  try {
    // We get the req.body.id from the post we use to add an item to the cart (id included on the button dataset prop).
    product = await Product.findById(req.body.productId);
  } catch (error) {
    next(error);
    return;
  }

  // res.locals.cart gets (from the cart middleware) a new created obj from the cart.model.
  const cart = res.locals.cart;
  cart.addItem(product);
  // We save the updated cart into the session, also will be saved in the session DB collection. (Since res.locals.cart will get reinitialized and lost this data if its not saved in req.session.cart, because the cart middleware checks the session.cart for every inc request, and set res.locals with the req.session data).
  req.session.cart = cart;

  // There is no need to use req.session.save() since it will be called by the session package. We only need to use it if we want to perform an action such as redirect which will rely on that updated data.
  // We gonna use an ajax response and handle it on the front.
  res.status(201).json({
    message: 'Cart updated',
    newTotalItems: cart.totalQuantity,
  });
}

module.exports = {
  addCartItem: addCartItem,
  getCart: getCart,
};
