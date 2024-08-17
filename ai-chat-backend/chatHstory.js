const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;; // Your backend port

dotenv.config();


app.use(cors()); // for connecting different ports 

app.use(express.json());


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

// export async function ConnnecttoDB(){
//   try {
//     await mongoose.connect('mongodb://localhost:27017/AIChatHistory', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     console.log('Database connected successfully');
//   }
//   catch (err){
//     console.log("Database Connection error: ", err);
//   }
// }

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



// export async function FetchHistory(hist) {

//   if (!hist || !Array.isArray(hist)) {
//     console.error('Invalid history data');
//     return;
//   }
//   const modelIdHaiku = 'anthropic.claude-3-haiku-20240307-v1:0';

//   const updatedhist = new ClaudeHistory({
//     model_name: modelIdHaiku,
//     history: hist
//   })

//   try {
//     await updatedhist.save();
//     console.log("History added Successfully");
//   }
//   catch (err) {
//     console.log("History updation error:", err);
//   }

// }


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
