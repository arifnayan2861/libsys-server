const { getDB } = require("../config/database");
const { ObjectId } = require("mongodb");

class BorrowedBook {
  constructor() {
    this.collection = null;
  }

  getCollection() {
    if (!this.collection) {
      const db = getDB();
      this.collection = db.collection("borrowed-books");
    }
    return this.collection;
  }

  async create(borrowData) {
    const collection = this.getCollection();
    return await collection.insertOne(borrowData);
  }

  async findByEmail(email) {
    const collection = this.getCollection();
    return await collection.find({ userEmail: email }).toArray();
  }

  async findByEmailAndBookId(email, bookId) {
    const collection = this.getCollection();
    return await collection.findOne({ userEmail: email, bookId });
  }

  async deleteByEmailAndBookId(email, bookId) {
    const collection = this.getCollection();
    return await collection.deleteOne({ userEmail: email, bookId });
  }

  async findAll() {
    const collection = this.getCollection();
    return await collection.find().toArray();
  }

  async delete(id) {
    const collection = this.getCollection();
    return await collection.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = new BorrowedBook();