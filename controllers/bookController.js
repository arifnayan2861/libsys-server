const Book = require("../models/Book");
const BorrowedBook = require("../models/BorrowedBook");

const addBook = async (req, res) => {
  try {
    const bookData = req.body;
    const result = await Book.create(bookData);
    res.send(result);
  } catch (error) {
    console.error("Add book error:", error);
    res.status(500).send({ message: "Failed to add book" });
  }
};

const getBooksByCategory = async (req, res) => {
  try {
    const bookCategory = req.params.category;
    const result = await Book.findByCategory(bookCategory);
    res.send(result);
  } catch (error) {
    console.error("Get books by category error:", error);
    res.status(500).send({ message: "Failed to fetch books by category" });
  }
};

const getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const result = await Book.findById(bookId);

    if (!result) {
      return res.status(404).send({ message: "Book not found" });
    }

    res.send(result);
  } catch (error) {
    console.error("Get book by ID error:", error);
    res.status(500).send({ message: "Failed to fetch book" });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const result = await Book.findAll();
    res.send(result);
  } catch (error) {
    console.error("Get all books error:", error);
    res.status(500).send({ message: "Failed to fetch books" });
  }
};

const getFilteredBooks = async (req, res) => {
  try {
    const result = await Book.findAvailable();
    res.send(result);
  } catch (error) {
    console.error("Get filtered books error:", error);
    res.status(500).send({ message: "Failed to fetch available books" });
  }
};

const borrowBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const borrowData = req.body;

    const updateResult = await Book.decrementQuantity(bookId);

    if (updateResult.modifiedCount > 0) {
      await BorrowedBook.create(borrowData);
      res.send({ success: true, message: "Book borrowed successfully" });
    } else {
      res.status(400).send({ message: "Book not found or quantity already 0" });
    }
  } catch (error) {
    console.error("Borrow book error:", error);
    res.status(500).send({ message: "Failed to borrow book" });
  }
};

const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const updatedBookData = req.body;

    const updateData = {
      img: updatedBookData.img,
      bookName: updatedBookData.bookName,
      authorName: updatedBookData.authorName,
      category: updatedBookData.category,
      rating: updatedBookData.rating,
    };

    const result = await Book.update(bookId, updateData);
    res.send(result);
  } catch (error) {
    console.error("Update book error:", error);
    res.status(500).send({ message: "Failed to update book" });
  }
};

const getBorrowedBooks = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await BorrowedBook.findByEmail(email);
    res.send(result);
  } catch (error) {
    console.error("Get borrowed books error:", error);
    res.status(500).send({ message: "Failed to fetch borrowed books" });
  }
};

const returnBook = async (req, res) => {
  try {
    const email = req.params.email;
    const bookId = req.params.id;

    const deleteResult = await BorrowedBook.deleteByEmailAndBookId(
      email,
      bookId
    );
    const updateResult = await Book.incrementQuantity(bookId);

    res.send(deleteResult);
  } catch (error) {
    console.error("Return book error:", error);
    res.status(500).send({ message: "Failed to return book" });
  }
};

module.exports = {
  addBook,
  getBooksByCategory,
  getBookById,
  getAllBooks,
  getFilteredBooks,
  borrowBook,
  updateBook,
  getBorrowedBooks,
  returnBook,
};
