const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");
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

    //user added to db
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    //add-books api
    app.post("/add-book", async (req, res) => {
      const book = req.body;
      const result = await booksCollection.insertOne(book);
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
