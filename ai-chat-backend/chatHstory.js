const express = require('express');
const axios = require('axios');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const {SendPrompt} = require('./APIcall');
const {saveConversationToDatabase} = require('./savetoHistory');

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  }
});
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
dotenv.config();


app.use(cors()); // for connecting different ports 

app.use(express.json());

const PORT = process.env.PORT || 8080; // Your backend port

io.on('connection', (socket) => {
  socket.on('userMessage', async (PromptHistory) => {

    try{
    const outputText = await SendPrompt(PromptHistory);  // Use your API call here
    const assistantMessage = { role: 'assistant', content: [{ text: outputText }] };
    console.log(assistantMessage);
    socket.emit('AIresponse', assistantMessage);
    const updatedPromptHistory = [...PromptHistory, assistantMessage];
    await saveConversationToDatabase(updatedPromptHistory);
    }
    catch(err){
      console.error('Error handling user message:', err);
    }
  });
});



const modelIdHaiku = 'anthropic.claude-3-haiku-20240307-v1:0';


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const ClaudeChat = new mongoose.Schema({
  model_name: String,
  data: { type: Date, default: Date.now },
  history: [
    {
      role: String,
      content: [{ text: String }]
    }
  ]
});

const ClaudeHistory = mongoose.model('ClaudeHistory', ClaudeChat);


app.post('/api/saveHistory', async (req, res) => {
  const modelIdHaiku = 'anthropic.claude-3-haiku-20240307-v1:0';
  //const ClaudeHistory = mongoose.model('ClaudeHistory', ClaudeChat);
  try {
    const newHistory = new ClaudeHistory({
      model_name: modelIdHaiku,
      history: req.body
    });

    try{
      await ClaudeHistory.deleteMany({});
      console.log('All documents deleted from the ClaudeHistory collection.');
    }
    catch(err){
      console.log('Error with delete docs:', err);
    }

    await newHistory.save();
    res.status(201).send('History saved');
  } catch (err) {
    res.status(500).send('Error saving history');
  }
});

app.get('/history', async (req, res)=>{
    try{
      const prevHistory = await ClaudeHistory.find({model_name: modelIdHaiku});
      res.status(200).json(prevHistory);
    }
    catch(err){
      res.status(500).json({ message: 'Error fetching chat history', error: err });
    }
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
