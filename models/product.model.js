// With the product class is better to save the image path and url in the constructor and dont save it on the BD (for better manteinance). Is easier to ask for the url and path dynamically knowing the name and extension of the file uploaded.

const mongodb = require('mongodb');
const db = require('../data/database');

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price; // Thanks to the plus, we force to get this value saved as int instead of string.
    this.description = productData.description;
    this.image = productData.image; // This will be the name of the image file with extension embedded.
    this.imagePath = `product-data/images/${productData.image}`; // We create the path to the image saved on the server.
    this.imageUrl = `/products/assets/images/${productData.image}`; // This should be the URL/path which is used on the front-end for requesting this image from the server.
    // It can happens that we dont have an ID from Mongo yet, so the toString() method would fail if its undefined. Thats why we use a conditional to create the id only if productData._id exists.
    if (productData._id) {
      this.id = productData._id.toString(); // So it retrieves the alphanumeric string and not the whole object (ObjectID("Alphanumeric string")).
    }
  }

  static async findById(productId) {
    let objId;
    try {
      objId = new mongodb.ObjectId(productId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const product = await db
      .getDb()
      .collection('products')
      .findOne({ _id: objId });

    if (!product) {
      // The built-in error class generates a new JS object with some internal error info and our own info. We can pass a string to the error obj, for example. Also we add a the code property to the error obj, and pass the status in it.
      const error = new Error('Could not find product with the provided id!');
      error.code = 404;
      throw error;
    }
    return product;
  }

  static async findAll() {
    const products = await db.getDb().collection('products').find().toArray();

    // Since we dont have imagePath and imageUrl saved in the DB. We get the objects in the BD and initialize them with the Product class, so it creates the object with the same keys/values adding them the imagePath and imageUrl attributes.
    return products.map((productDocument) => new Product(productDocument));
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };
    await db.getDb().collection('products').insertOne(productData);
  }
}

module.exports = Product;
