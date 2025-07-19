const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getCurrentUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.post("/", createUser);
router.get("/all", getAllUsers);
router.get("/current/:email", getCurrentUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
