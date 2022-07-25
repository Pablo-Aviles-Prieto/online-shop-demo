// Here we check if the user is logged so he can access the route is trying to visit. After it, we check in case is trying to get an /admin route, if the user is an admin. With this, we can protect auth and admin routes.

function protectRoutes(req, res, next) {
  if (!res.locals.isAuth) {
    return res.redirect('/401');
  }

  // We check if the request path starts with /admin. (startsWitch() is a built-in method from JS that we can call to strings).
  if (req.path.startsWith('/admin') && !res.locals.isAdmin) {
    return res.redirect('/403');
  }

  next();
}

module.exports = protectRoutes;
