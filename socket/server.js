const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    const { recipientId, message } = data;

    io.to(recipientId).emit("received_message", message);
  });

  //   socket.on("send_message", (message) => {
  //     console.log(message);
  //     socket.broadcast.emit("received_message", message);
  //   });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
