// This function gets 4 params (the 1st one is error), so when there is a error express looks for this function in app.js (has to be called in such file).
function handleErrors(error, req, res, next) {
  console.log(error);
  // We created the property code in the error obj in some try/catch error handler (like in the product.model.js), so we can be more precise when addressing errors.
  if (error.code === 404) {
    return res.status(404).render('shared/404');
  }
  res.status(500).render('shared/500');
}

module.exports = handleErrors;
