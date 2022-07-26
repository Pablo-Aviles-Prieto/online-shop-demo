const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');
const db = require('../data/database');

class User {
  constructor(email, password, fullname, street, postal, city) {
    this.email = email;
    this.password = password;
    this.name = fullname;
    this.address = {
      street: street,
      postalCode: postal,
      city: city,
    };
  }

  static async findById(userId) {
    const uid = new mongodb.ObjectId(userId);

    return db
      .getDb()
      .collection('users')
      .findOne({ _id: uid }, { projection: { password: 0 } }); // We omit password of the data we fetch, thx to the projection object.
  }

  getUserWithSameEmail() {
    // No need to use async - await since we are returning the promise, and will return only when finished.
    return db.getDb().collection('users').findOne({ email: this.email });
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    } else {
      return false;
    }
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    const response = await db.getDb().collection('users').insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.name,
      address: this.address,
    });
    return response;
  }

  hasMatchingPassword(hashedPassword) {
    // First compares the unshash password and then the stored hashed password on DB
    return bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;
