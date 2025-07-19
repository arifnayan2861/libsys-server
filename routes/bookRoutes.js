const express = require("express");
const router = express.Router();
const {
  addBook,
  getBooksByCategory,
  getBookById,
  getAllBooks,
  getFilteredBooks,
  borrowBook,
  updateBook,
  getBorrowedBooks,
  returnBook,
} = require("../controllers/bookController");
const { verifyToken } = require("../middleware/auth");

router.post("/add", verifyToken, addBook);
router.get("/category/:category", getBooksByCategory);
router.get("/single/:id", getBookById);
router.get("/all", verifyToken, getAllBooks);
router.get("/available", getFilteredBooks);
router.put("/borrow/:id", borrowBook);
router.put("/update/:id", updateBook);
router.get("/borrowed/:email", getBorrowedBooks);
router.delete("/return/:email/:id", returnBook);

module.exports = router;
