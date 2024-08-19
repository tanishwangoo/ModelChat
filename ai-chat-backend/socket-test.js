const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
dotenv.config();


app.use(cors()); // for connecting different ports 
app.use(express.json());

const PORT = process.env.PORT || 8080; // Your backend port

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);  // Logging connection with socket ID
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
