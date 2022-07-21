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

module.exports = router;
