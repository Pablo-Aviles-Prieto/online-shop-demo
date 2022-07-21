// We use the action to ensure that the session data was updated and saved back before redirecting or making any action.
function createUserSession(req, user, action) {
  // This req.session is available thx to the express session package. We can use any key name to create the key and associate values to that key.
  req.session.uid = user._id.toString(); // The _id is the ID format used in Mongo. Since is an object created by Mongo, we convert it to string.
  // In case the user has the isAdmin flag active in the DB, we pass it to the session to keep track of his admin status while logged.
  req.session.isAdmin = user.isAdmin;
  // save() is a built-in method from express session pckge. This method first saves the session in the DB and then execute the action (that is a function that we pass).
  req.session.save(action);
}

function destroyUserAuthSession(req) {
  // With this, we logout entirely the user since the locals.isAuth (used in the middlewares/check-auth) is only true when the session.uid has a value.
  req.session.uid = null;
  // Since we dont have another function (action) to call after set the session.uid to null, we dont need to use save() like in the createUser function.
}

module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession,
};
