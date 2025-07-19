const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const result = await User.create(userData);
    res.send(result);
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).send({ message: "Failed to create user" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await User.findAll();
    res.send(result);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).send({ message: "Failed to fetch users" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const userEmail = req.params.email;
    const result = await User.findByEmail(userEmail);

    if (!result) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send(result);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).send({ message: "Failed to fetch user" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    const result = await User.update(userId, updateData);
    res.send(result);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).send({ message: "Failed to update user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await User.delete(userId);
    res.send(result);
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).send({ message: "Failed to delete user" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getCurrentUser,
  updateUser,
  deleteUser,
};
