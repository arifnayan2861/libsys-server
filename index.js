const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");

// Import database connection
const connectDB = require("./config/database");

const port = process.env.PORT || 5000;
const app = express();

// Cookie options
const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  secure: process.env.NODE_ENV === "production" ? true : false,
};

// Middleware
app.use(
  cors({
    origin: [
      "https://libsys.netlify.app",
      "https://libsys-7ee11.web.app",
      "https://libsys-7ee11.firebaseapp.com",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Connect to database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("libsys is running...");
});

// Start server
app.listen(port, () => {
  console.log(`LibSys is running at port: ${port}`);
});

module.exports = app;