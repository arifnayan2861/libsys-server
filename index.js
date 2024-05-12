const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  secure: process.env.NODE_ENV === "production" ? true : false,
};

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ph.gyzqsfs.mongodb.net/?retryWrites=true&w=majority&appName=PH`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const verifyToken = (req, res, next) => {
  const token = req?.cookies.token;
  // console.log("middleware", token);
  if (!token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).send({ message: "Unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};

async function run() {
  try {
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const usersCollection = client.db("LibSysDB").collection("users");
    const booksCollection = client.db("LibSysDB").collection("books");
    const borrowedBooksCollection = client
      .db("LibSysDB")
      .collection("borrowed-books");

    app.post("/jwt", async (req, res) => {
      const user = req.body;
      console.log("backend token", user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "3h",
      });
      res.cookie("token", token, cookieOptions);
      res.send({ success: true });
    });

    //user added to db
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.post("/logout", async (req, res) => {
      const user = req.body;
      console.log("logout", user);
      res
        .clearCookie("token", { ...cookieOptions, maxAge: 0 })
        .send({ success: true });
    });

    //add-books api
    app.post("/add-book", verifyToken, async (req, res) => {
      const book = req.body;
      const result = await booksCollection.insertOne(book);
      console.log(req.user);
      res.send(result);
    });

    //get books by category
    app.get("/books/:category", async (req, res) => {
      const bookCategory = req.params.category;
      const query = { category: bookCategory };
      const result = await booksCollection.find(query).toArray();
      res.send(result);
    });

    //get single book details by id
    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await booksCollection.findOne(query);
      res.send(result);
    });

    //update book count and store borrowed books
    app.put("/book/:id/borrow", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const book = req.body;

      const update = {
        $inc: { quantity: -1 },
      };

      try {
        const updateResult = await booksCollection.updateOne(
          filter,
          update,
          options
        );
        if (updateResult.modifiedCount > 0) {
          const borrowResult = await borrowedBooksCollection.insertOne(book);
        } else {
          res.status(400).send("Book not found or quantity already 0"); // Error handling
        }
      } catch (error) {
        console.error(error);
      }
    });

    app.get("/borrowed-books/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await borrowedBooksCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/borrowed-books/:email/:id", async (req, res) => {
      const email = req.params.email;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const query = { userEmail: email, bookId: id };
      const result = await borrowedBooksCollection.deleteOne(query);

      const update = {
        $inc: { quantity: 1 },
      };

      const updateResult = await booksCollection.updateOne(
        filter,
        update,
        options
      );

      res.send(result);
    });

    //get all books
    app.get("/all-books", verifyToken, async (req, res) => {
      const cursor = booksCollection.find();
      const result = await cursor.toArray();
      console.log("token owner", req.user);
      res.send(result);
    });

    app.put("/update-book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedBook = req.body;
      const book = {
        $set: {
          img: updatedBook.img,
          bookName: updatedBook.bookName,
          authorName: updatedBook.authorName,
          category: updatedBook.category,
          rating: updatedBook.rating,
        },
      };
      const result = await booksCollection.updateOne(filter, book, options);
      res.send(result);
    });

    app.get("/filtered-books", async (req, res) => {
      const cursor = booksCollection.find({ quantity: { $gt: 0 } }); // Filter by quantity > 0
      const result = await cursor.toArray();
      console.log("token owner", req.user);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("libsys is running...");
});

app.listen(port, () => {
  console.log(`LibSys is running at port: ${port}`);
});
