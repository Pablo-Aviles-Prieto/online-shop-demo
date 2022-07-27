// We import the stripe package and execute the function immediately to return it to the stripe const.
// The string can be found in the stripe user menu, in api keys as secret key.
const stripe = require('stripe')(process.env.STRIPE_KEY);
// Its the shame that:
// const stripe = require('stripe');
// const stripeObj = stripe('privateToken');

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

  // We ensure a user cant try to buy the products in the cart when he has 0 items (should be fixed in front, that when a user deletes all products, the button should disappear, but its too much work atm, I need to learn react, not keep working in DOM).
  if (!cart.totalQuantity) {
    res.status(400).redirect('/products');
    return;
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

  // STRIPE ORIGINAL CODE FROM website
  // const session = await stripe.checkout.sessions.create({
  //   line_items: [
  //     {
  //       // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
  //       // This price field has to be an ID as it says. That ID needs to point at a price object defined on stripes server.
  //       // Define product information when you create the Checkout Session using predefined price IDs or on the fly with price_data.
  //       price: '{{PRICE_ID}}',
  //       quantity: 1,
  //     },
  //   ],
  //   mode: 'payment',

  // Since Stripes API redirects the user to the Stripe's own site to make the payment, then it will be redirected to the url indicateds, depending if it succeded or failed.
  //   success_url: `${YOUR_DOMAIN}/success.html`,
  //   cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  // });

  // This is the actual redirect to the Stripe's website to make the page in a secure environment (When it finish, it should redirect to the previous indicated URLs depending how the transaction went).
  // res.redirect(303, session.url);

  //////////////////////////////////////////////
  // line_items expects an array of objects defined such as the example commented.
  // Since we define price_data and create an obj on the fly that is filled with our products information.
  // Aswell for the key currency, we need to define since stripe's require to set this key in case we create a obj in the fly.
  // In product_data, name is a required field that we populate with info of our product/products.
  // And unit_amount_decimal we should use 'cents' instead of 'decimal', so we avoid problems with JS rounding numbers. Passing everything in cents, we can avoid that problem.
  // This obj (inside line_items) requires to set some key/values (others are optional). We can check in the stripe's page => https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-line_items-price_data
  // {
  //   price_data: {
  //     // We can chose price_data instead of price when we dont have the items/products that we wanna sell in the Stripes page, and only in our server/db.
  //     currency: 'usd',
  //     product_data: {
  //       name: 'Dummy',
  //     },
  //     unit_amount_decimal: 10.99,
  //   },
  //   quantity: 1,
  // },

  // Since we need to pass the products stored in the cart, we cant just pass the product obj as its saved in the DB, we need to redifine it (with help of .map(), since it return an array of items with the conditions we set) so it adjusts to the key properties that line_items objects needs. Also we need to map the array of items in the cart since the user can buy different products and not just one.
  // Here we get the cart from res.locals.cart (we can see the properties of the items stored in the cart, in the cart.model, in the function addItem, where it has a 'product' containing all the info of the product, 'quantity' to know how many same products is the user ordering and 'totalPrice' that is the total price of that exact item in case its selected more than 1 from the user to buy it).
  // Just to clarify we are using the item.product.price and not the item.totalPrice since Stripe's object wants to know the price of a single unit and the quantity to calculate it.
  const session = await stripe.checkout.sessions.create({
    line_items: cart.items.map((item) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.title,
          },
          // We cant use the unit_amount_decimal since if we pass an amount of '99.99' Stripes translate it to '$0.9999' and with usd its not valid more  than 2 decimals (as it says in the error throwed by Stripes)
          // So in order to work, we just use unit_amount since it expects a value in cents (it doesnt expect a decimal number like _decimal, it expects an integer number).
          unit_amount: +item.product.price.toFixed(2) * 100, // Since Stripes is expecting a value in cents, we can change our value (that for example is $99.99) multiplying by 100 (so we get the value in cents) and then setting it fixed to 2 decimal numbers only.
          // unit_amount_decimal: +item.product.price, // We ensure that we are sending a number with the '+'
        },
        quantity: item.quantity,
      };
    }),
    mode: 'payment',
    // We use our own path to our localhost and the routes for that petitions. Also we dont set .env variables.
    success_url: `${process.env.BACKEND_URL}/orders/success`,
    cancel_url: `${process.env.BACKEND_URL}/orders/failure`,
  });

  // This is the actual redirect to the Stripe's website to make the page in a secure environment (When it finish, it should redirect to the previous indicated URLs depending how the transaction went).
  res.redirect(303, session.url);
}

function getSuccess(req, res) {
  res.render('customer/orders/success');
}

function getFailure(req, res) {
  res.render('customer/orders/failure');
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSuccess: getSuccess,
  getFailure: getFailure,
};
