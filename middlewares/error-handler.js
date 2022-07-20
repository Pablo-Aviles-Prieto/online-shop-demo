// This function gets 4 params (the 1st one is error), so when there is a error express looks for this function in app.js (has to be called in such file).
function handleErrors(error, req, res, next) {
  console.log(error);
  res.status(500).render('shared/500');
}

module.exports = handleErrors;
