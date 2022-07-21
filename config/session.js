const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');

function createSessionStore() {
  const MongoDBStore = mongoDbStore(expressSession);

  const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017',
    databaseName: 'online-shop',
    collection: 'sessions',
  });

  return store;
}

function createSessionConfig() {
  // We return a configuration object to give later to the express session pckge.
  return {
    secret: 'super-secret',
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    // If we dont indicate the max age of the cookie of the session, it will be cleared whenever the user closes the browser.
    cookie: {
      maxAge: 60 * 1000, // 2 days
    },
  };
}

module.exports = createSessionConfig;
