// We need to send this token in every single form/post request. So thanks to express we create a variable inserted in all the responses that can be accessed from all the views so we dont have to pass the token manually.
// We respond with the locals property of express, that allows us to send variables created by us to all the views automatically
function addCsrfToken(req, res, next) {
  // This generates a valid token (the csrfToken() method) saved in res.locals which is available in all the views.
  res.locals.csrfToken = req.csrfToken();
  next();
}

module.exports = addCsrfToken;
