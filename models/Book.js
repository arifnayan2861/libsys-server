const { getDB } = require("../config/database");
const { ObjectId } = require("mongodb");

class Book {
  constructor() {
    this.collection = null;
  }

  getCollection() {
    if (!this.collection) {
      const db = getDB();
      this.collection = db.collection("books");
    }
    return this.collection;
  }

  async create(bookData) {
    const collection = this.getCollection();
    return await collection.insertOne(bookData);
  }

  async findAll() {
    const collection = this.getCollection();
    return await collection.find().toArray();
  }

  async findByCategory(category) {
    const collection = this.getCollection();
    return await collection.find({ category }).toArray();
  }

  async findById(id) {
    const collection = this.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  async findAvailable() {
    const collection = this.getCollection();
    return await collection.find({ quantity: { $gt: 0 } }).toArray();
  }

  async update(id, updateData) {
    const collection = this.getCollection();
    const options = { upsert: true };
    return await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData },
      options
    );
  }

  async incrementQuantity(id) {
    const collection = this.getCollection();
    const options = { upsert: true };
    return await collection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { quantity: 1 } },
      options
    );
  }

  async decrementQuantity(id) {
    const collection = this.getCollection();
    const options = { upsert: true };
    return await collection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { quantity: -1 } },
      options
    );
  }

  async delete(id) {
    const collection = this.getCollection();
    return await collection.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = new Book();