// We are saving the info of the cart in the user's session.
class Cart {
  // We give to items a default value (an empty array), in case there are no items saved in the cart.
  // Every single item in the array will be added by the addItem() method, so will have the cartItem properties.
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
    this.items = items;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
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
        cartItem.quantity = item.quantity + 1;
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
}

module.exports = Cart;
