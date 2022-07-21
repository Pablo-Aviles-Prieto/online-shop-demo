// With the product class is better to save the image path and url in the constructor and dont save it on the BD (for better manteinance). Is easier to ask for the url and path dynamically knowing the name and extension of the file uploaded.

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
