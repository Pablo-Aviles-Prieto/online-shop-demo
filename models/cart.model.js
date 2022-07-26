const Product = require('./product.model');

// We are saving the info of the cart in the user's session.
class Cart {
  // We give to items a default value (an empty array), in case there are no items saved in the cart.
  // Every single item in the array will be added by the addItem() method, so will have the cartItem properties.
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
    this.items = items;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }

  async updatePrices() {
    const productIds = this.items.map(function (item) {
      return item.product.id;
    });

    const products = await Product.findMultiple(productIds);

    const deletableCartItemProductIds = [];

    for (const cartItem of this.items) {
      const product = products.find(function (prod) {
        return prod.id === cartItem.product.id;
      });

      if (!product) {
        // product was deleted!
        // "schedule" for removal from cart
        deletableCartItemProductIds.push(cartItem.product.id);
        continue; // Ensures that the next iteration of this for loop will start without going through the remaining code in that for loop first.
      }

      // product was not deleted
      // set product data and total price to latest price from database
      cartItem.product = product;
      cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
    }

    if (deletableCartItemProductIds.length > 0) {
      this.items = this.items.filter(function (item) {
        return deletableCartItemProductIds.indexOf(item.product.id) < 0;
      });
    }

    // re-calculate cart totals
    this.totalQuantity = 0;
    this.totalPrice = 0;

    for (const item of this.items) {
      this.totalQuantity = this.totalQuantity + item.quantity;
      this.totalPrice = this.totalPrice + item.totalPrice;
    }
  }

  // Since a user can add multiple times an item, we cant just simple push it in the array. We gonna push the 1st time and if the item already exist, we increase the quantity of that item.
  addItem(product) {
    const cartItem = {
      product: product,
      quantity: 1,
      totalPrice: product.price,
    };

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      // We check in the loop, if the item that is being looped has the same product.id that the one we pass to this method.
      if (item.product.id === product.id) {
        // We need to use item.quantity/totalPrice and not cartItem, since we want to get the quantity and totalPrice accumulated of that exactly item.
        cartItem.quantity = +item.quantity + 1;
        cartItem.totalPrice = item.totalPrice + product.price;
        // We want to update the item[i] (who matches in id) with the new quantity and price (since if it matched, it means that the item is already saved in the cart array).
        this.items[i] = cartItem;

        this.totalQuantity++; // this.totalQuantity = this.totalQuantity + 1
        this.totalPrice += product.price; // this.totalPrice = this.totalPrice + product.price
        // We return in the loop because we dont need to execute the next line since we already changed the item in the cart, so we dont want to push the item if it was already found in the array.
        return;
      }
    }

    this.items.push(cartItem);
    this.totalQuantity++; // this.totalQuantity = this.totalQuantity + 1
    this.totalPrice += product.price; // this.totalPrice = this.totalPrice + product.price
  }

  updateItem(productId, newQuantity) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.product.id === productId && newQuantity > 0) {
        const cartItem = { ...item };
        const quantityChange = newQuantity - item.quantity; // We need to know the new difference to increase or decrease the totalQuantity.
        cartItem.quantity = newQuantity;
        cartItem.totalPrice = newQuantity * item.product.price;
        this.items[i] = cartItem;

        this.totalQuantity = this.totalQuantity + quantityChange;
        this.totalPrice += quantityChange * item.product.price; // For the totalPrice we increase or decrease (if the quantityChange is negative) the total price of the cart based on the quantityChange of the current product/item, multiplying it for the product price of that item.
        // We return in the loop because we dont need to execute the next line since we already changed the item in the cart, so we dont want to push the item if it was already found in the array.
        return { updatedItemPrice: cartItem.totalPrice }; // We return this to the cart.controller so we can pass it to the front and modify the updated price.
      } else if (item.product.id === productId && newQuantity <= 0) {
        this.items.splice(i, 1); // We want to delete (in case the newQuantity entered by the user is 0 or less), starting from the index of the 'i' and deleten just 1.
        this.totalQuantity = this.totalQuantity - item.quantity; // We have access to the item properties (even if its sliced in the previous lines).
        this.totalPrice -= item.totalPrice; // We have access to the item properties (even if its sliced in the previous lines).
        return { updatedItemPrice: 0 };
      }
    }
  }
}

module.exports = Cart;
