const Product = require('../models/product.model');

async function getAllProducts(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render('customer/products/all-products', { products: products });
  } catch (error) {
    next(error);
  }
}

async function getProductDetails(req, res, next) {
  try {
    // With the method findById() created in the class, we retrieve an instance of the Product class, so we get access to the property imageUrl to render in the template.
    const product = await Product.findById(req.params.id);
    res.render('customer/products/product-details', { product: product });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts: getAllProducts,
  getProductDetails: getProductDetails,
};
