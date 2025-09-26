const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let notifications = []; // in-memory store for notifications

// Serve static HTML file
app.use(express.static(__dirname));

// API route to trigger notification
app.get("/notify/:msg", (req, res) => {
  const { msg } = req.params;
  notifications.push(msg);           // store notification in memory
  io.emit("notification", msg);      // send to all connected clients
  res.send(`Notification sent: ${msg}`);
});

// WebSocket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send all previous notifications to the new client
  notifications.forEach((msg) => socket.emit("notification", msg));
});

server.listen(3000, () => console.log("Server running on http://localhost:3000"));
