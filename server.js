const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const app = require("./app");
const mongoose = require("mongoose");
const http = require("http").Server(app);
const port = process.env.PORT || 6000;

app.use(cors());
const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.of("/api/socket").on("connection", (socket) => {
  console.log("socket.io: User connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("socket.io: User disconnected: ", socket.id);
  });
});
server.listen(port, () => console.log(`Server now running on port ${port}!`));
// Load env vars
dotenv.config({ path: "./config/config.env" });

connectDB();

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connected");

  console.log("Setting change streams");
  const thoughtChangeStream = connection.collection("users").watch();

  thoughtChangeStream.on("change", (change) => {
    switch (change.operationType) {
      case "insert":
        io.of("/api/socket").emit("newUser", change.fullDocument);
        break;
    }
  });
});

// Middlewares
app.use(express.json({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));

// Routes

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html")); // relative path
  });
}
