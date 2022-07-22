const express = require('express');

const adminController = require('../controllers/admin.controller');
const imageUploadMiddleware = require('../middlewares/image-upload');

const router = express.Router();

// We configured the middleware for this routes with a path of '/admin'. With this, all requests to localhost/admin/'whatever' will activate this routers.
router.get('/products', adminController.getProducts); // admin/products

router.get('/products/new', adminController.getNewProduct);

// The imageUploadMiddleware funct (middlewares/image-upload) is the multer middleware funct that we configure to check for files in the form and get the file and save it.
router.post(
  '/products',
  imageUploadMiddleware,
  adminController.createNewProduct
);

router.get('/products/:id', adminController.getUpdateProduct);

// We need to use imageUploadMiddleware to parse the data from the incoming form with enctype multipart/form-data, if not the urlencoded middleware wont activate to get the req.body, we need this middleware for it.
router.post(
  '/products/:id',
  imageUploadMiddleware,
  adminController.updateProduct
);

module.exports = router;
