const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

app.use(cors());

// Load env vars
dotenv.config({ path: "./config/config.env" });

connectDB();

// Middlewares
app.use(express.json({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));

// Routes
app.use("/api/users", require("./routes/user"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html")); // relative path
  });
}

const port = process.env.PORT || 6000;
app.listen(port, () => console.log(`Server Running on port: ${port}`));
