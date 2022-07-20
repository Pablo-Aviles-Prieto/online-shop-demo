const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

// Since we configurated express to check for the views in the views folder, we use that path.
function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: '',
      confirmEmail: '',
      password: '',
      fullname: '',
      street: '',
      postal: '',
      city: '',
    };
  }
  res.status(200).render('customer/auth/signup', { inputData: sessionData });
}

async function signup(req, res, next) {
  const {
    email,
    password,
    ['confirm-email']: confirmEmail,
    fullname,
    street,
    postal,
    city,
  } = req.body;
  const enteredData = {
    email,
    confirmEmail,
    password,
    fullname,
    street,
    postal,
    city,
  };

  if (
    !validation.userDetailsAreValid(
      email,
      password,
      fullname,
      street,
      postal,
      city
    ) ||
    !validation.emailIsConfirmed(email, confirmEmail)
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          'Please check your input. Password must be at least 6 characters long and postal code must be 5 character long!',
        ...enteredData,
      },
      () => res.redirect('/signup') // Passing this function as an action in the middleware function, we ensure it only executes this redirects after finishing saving with the save() method from express session. We return after calling flashDataToSession.
    );
    return;
  }
  const user = new User(email, password, fullname, street, postal, city);

  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: 'User exists already! - Try logging in instead!',
          ...enteredData,
        },
        () => res.redirect('/signup')
      );
      return;
    }

    await user.signup();
  } catch (error) {
    return next(error);
  }
  // When a user submit data from a form is better to redirect instead of rendering a view. So in case he refresh the page, it doesnt pop's an alert to resend the request again to the back (this happens when rendering instead of redirecting).
  return res.status(200).redirect('/login');
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: '',
      password: '',
    };
  }
  res.status(200).render('customer/auth/login', { inputData: sessionData });
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const user = new User(email, password);
  // Using try and catch, we scope the variable existingUser inside the try, so we need to put it out of that scope.
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    return next(error);
  }

  const sessionErrorData = {
    errorMessage:
      'Invalid credentials - please double-check your email and password!',
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, () =>
      res.redirect('/login')
    );
    return;
  }

  // It wouldn't be necessary to use try/catch with the password checking since it shouldnt fail. (Is just a comparision)
  let passwordIsCorrect;
  try {
    passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);
  } catch (error) {
    return next(error);
  }

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, () =>
      res.redirect('/login')
    );
    return;
  }

  // Nowe we create the session for this auth user. We send to the create session function, el req, the user from the BD and a function that will be executed after saving the session.
  authUtil.createUserSession(req, existingUser, () =>
    res.status(200).redirect('/')
  );
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect('/login');
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
