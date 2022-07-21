function checkAuthStatus(req, res, next) {
  // We get this uid from the util/authentication function. It would be undefined in case it's not authed. For example we pass a id value when a user logs in, in the login function from auth.controller.js
  const uid = req.session.uid;

  if (!uid) {
    return next();
  }

  // We gonna set some variables in the locals in case the user is auth.
  res.locals.uid = uid;
  res.locals.isAuth = true;
  // Since we pass the isAdmin value to the session (in the authentication util file), we can check if the user is auth and admin, checking with this middleware if there is session data and assigning it to locals.
  res.locals.isAdmin = req.session.isAdmin
  next();
}

module.exports = checkAuthStatus;
