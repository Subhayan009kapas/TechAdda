const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));

// (comment these out for now until you create them)
app.use("/api/posts", require("./routes/posts"));
// app.use("/api/users", require("./routes/users"));

// User routes
// app.use('/api/users', require('./routes/userRoutes'));


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error("Mongo error:", err));
