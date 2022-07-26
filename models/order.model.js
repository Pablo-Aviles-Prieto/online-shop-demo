const db = require('../data/database');

class Order {
  // We use the status property to set a value of how the transaction order is going on. For example, in case a user wants to reinitialize an already existing order
  // orderId might not exist yet in case of new orders.
  // Possible status => pending, fulfilled, cancelled
  constructor(cart, userData, status = 'pending', date, orderId) {
    this.productData = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date);
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'lonh',
        year: 'numeric',
      });
    }
    this.id = orderId;
  }

  async save() {
    if (this.id) {
      //updating
    } else {
      const orderDocument = {
        userData: this.userData,
        productData: this.productData,
        date: new Date(),
        status: this.status,
      };

      await db.getDb().collection('orders').insertOne(orderDocument);
    }
  }
}

module.exports = Order;
