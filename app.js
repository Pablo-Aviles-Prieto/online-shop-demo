// Is our main-entry file that start node/express server. Handling and distributing the inc requests.
const express = require('express');
const path = require('path');
// In order to make csrf works, we need to configure it with sessions (sessions are pieces of data stored on the server, which are connected to users with help of cookies).
const csrf = require('csurf');
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const db = require('./data/database');
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');

const app = express();

// Telling that the view engine.
app.set('view engine', 'ejs');
// Indicating express where to look for the views (views folder). Like the previous set, the 1st parameter is 'stablished' by express. 2nd param is the path (using it with with the path package thats built in express.)
app.set('views', path.join(__dirname, 'views'));

// We serve that folder to the visitor so they can reach the files inside.
app.use(express.static('public'));
// The 1st param indicates the path to activate this static-serving middleware. In case a petition comes to the back with a path of /products/assets/images, it would enter in this middleware (/products/assets) and look inside the 'product-data' folder if there is any /image folder there to serve the files in it.
app.use('/products/assets', express.static('product-data'));
// This middleware allows us to get the values in the incoming requests (such as the data sent from a form). **extended: false only support regular form submission so to say
app.use(express.urlencoded({ extended: false })); // Will look for form type requests.
app.use(express.json()); // Will look for json type requests.

const sessionConfig = createSessionConfig();

// We declare it before csrf since we have to pass it to it.
app.use(expressSession(sessionConfig));
// This middleware needs to be always implemented before the request reaches our middleware handling the routes.
// All incoming request (that are not get req's) needs to have a csrf token attached to be validated. **We need to send this token in every single form/post request. So thanks to express we create a variable inserted in all the responses that can be accessed from all the views so we dont have to pass the token manually. (middlewares/csrf-token.js)
// This csrf() package middleware basically generates the token and check the incoming tokens for validate them (with our custom middleware, we pass this generated token to the other middlewares/route functions and also to the views).
// It needs to be configured with sessions or cookies to work. Since the tokens are created and attached to a specific session/cookie.
app.use(csrf());

// This middleware will check and provide info (mainly will ensure that the res.locals.carts property exists) about the cart via sessions. If there is no cart on the session(cookie) of the user it will create a new one, and if there is one already saved we gonna reinitialize it. (more info in middlewares/cart).
app.use(cartMiddleware);

// After we use the csrf() package middleware, we can use our own middleware to generate the csrf token for that concrete req, since every req has his own token.
// For example in signup.ejs (customer/auth), we pass the token thx to our own middleware using a hidden input (with the special _csrf name and the value that gets the res.locals) for example.
app.use(addCsrfTokenMiddleware);
// We need to call this middleware at least, after we create the session in expressSesion.
app.use(checkAuthStatusMiddleware);

// Middleware handling the routes for the inc requests.
app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use('/cart', cartRoutes); // We put it before the protect routes and every single request coming to a path starting with /cart will look in this middleware.
app.use(protectRoutesMiddleware); // Before we try to handle a request to the next routes (in this case, admin routes), we want to run the request with the protect-routes.js middleware, to be sure the user is authed and an admin. (It wont affect the errorHandlerMiddleware).
app.use('/admin', adminRoutes); // The 1st parameter makes this middleware to check for all requests to a path starting with /admin (and then, whatever the routes names are in admin.routes.js, like /products would be => /admin/products).

// Custom middleware to handles errors
app.use(errorHandlerMiddleware);

// db.connectToDatabase() yields a promise since all async functions return a promise (even if we dont return anything in the function)
db.connectToDatabase()
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log('Failed to connect to the database!');
    console.log(error);
  });
