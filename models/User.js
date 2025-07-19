const { getDB } = require("../config/database");

class User {
  constructor() {
    this.collection = null;
  }

  getCollection() {
    if (!this.collection) {
      const db = getDB();
      this.collection = db.collection("users");
    }
    return this.collection;
  }

  async create(userData) {
    const collection = this.getCollection();
    return await collection.insertOne(userData);
  }

  async findAll() {
    const collection = this.getCollection();
    return await collection.find().toArray();
  }

  async findByEmail(email) {
    const collection = this.getCollection();
    return await collection.findOne({ email });
  }

  async findById(id) {
    const collection = this.getCollection();
    const { ObjectId } = require("mongodb");
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  async update(id, updateData) {
    const collection = this.getCollection();
    const { ObjectId } = require("mongodb");
    return await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

  async delete(id) {
    const collection = this.getCollection();
    const { ObjectId } = require("mongodb");
    return await collection.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = new User();