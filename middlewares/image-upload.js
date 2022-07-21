// We need this middleware to configure the multer package
const multer = require('multer');
const uuid = require('uuid').v4;

// This give us back an upload object so we can access pre-configured middlewares from multer that can be added to the routes.
const upload = multer({
  // We configure the storage option of multer, calling multer.diskStorage() method and setting some options for the destination (we can pass a function with our own logic or a path for the destination) and the file name.
  storage: multer.diskStorage({
    destination: 'product-data/images',
    // For the filename we use a funct that needs as params the request, the file extracted by multer and a callback function.
    // This cb funct receives as 1st param information about a potential error we can face (in this case we pass null since we have no errors).
    // The 2nd value of the cb funct is the name we wanna use for the uploaded file. In this case we use uuid and separated with a '-' we take the original name and extension of the file accessing through the originalname property from multer.
    filename: (req, file, cb) => {
      cb(null, `${uuid()}-${file.originalname}`);
    },
  }),
});

// This single method from multer allows us to extract a single file by field name from the inc req. We pass the field name (from the form in admin/products/new-product) as a parameter.
// single() method return a configured multer middleware that we can export and use on app.js
const configuredMulterMiddleware = upload.single('image');

module.exports = configuredMulterMiddleware;
