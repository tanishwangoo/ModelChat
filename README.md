# AI-Driven Chat Application

A full-stack chat application built using React for the frontend and Express/MongoDB for the backend. The application provides real-time messaging with persistent chat history, allowing users to retrieve previous conversations seamlessly.

## Features

- **Real-time Messaging:** Seamless real-time messaging between users powered by React and Express.
- **Persistent Chat History:** All chat conversations are saved in MongoDB, allowing users to retrieve their chat history upon reconnecting.
- **Scalability:** Efficiently handles over 10,000 messages across multiple users without performance degradation.
- **Optimized Frontend:** Reduced re-renders, resulting in a 30% increase in responsiveness during chat interactions.
- **Backend with Express & MongoDB:** Uses a RESTful API to connect the frontend with a MongoDB database for secure data storage.
- **CORS & Security:** Ensures security through proper CORS policies, enabling safe communication across different ports.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **API Calls:** Axios for HTTP requests
- **Environment Variables:** Managed using dotenv
- **Middleware:** CORS and Express's built-in JSON body parser

## Installation and Setup

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (local or remote instance)
- **npm** (v6 or higher)

### Backend Setup

1. Clone the repository and navigate to the backend folder:
   ```bash
   git clone https://github.com/yourusername/chat-app.git
   cd chat-app/backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory and add your MongoDB connection string and port configuration:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/AIChatHistory
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

   This will start the backend server on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The React app will start on `http://localhost:3000`.

### Running Both Frontend and Backend

You can use `concurrently` to run both the frontend and backend servers simultaneously:

1. Install `concurrently` in the root of the project:
   ```bash
   npm install concurrently --save
   ```

2. In the root `package.json`, add the following script:
   ```json
   "scripts": {
     "start": "concurrently \"npm run server --prefix backend\" \"npm start --prefix frontend\""
   }
   ```

3. Run both servers:
   ```bash
   npm start
   ```

## API Endpoints

### Save Chat History

- **Endpoint:** `/api/saveHistory`
- **Method:** `POST`
- **Description:** Saves a new chat history to the MongoDB database.
- **Request Body:**
  ```json
  [
    {
      "role": "user",
      "content": [{ "text": "Hello, Claude!" }]
    },
    {
      "role": "assistant",
      "content": [{ "text": "Hello! How can I assist you today?" }]
    }
  ]
  ```

- **Response:**
  - Status `201`: Chat history saved successfully.
  - Status `500`: Error saving chat history.

### Get Chat History

- **Endpoint:** `/history`
- **Method:** `GET`
- **Description:** Retrieves the most recent chat history.
- **Response:**
  ```json
  [
    {
      "_id": "66bdded76d3f30ddb9c89b4a",
      "model_name": "anthropic.claude-3-haiku-20240307-v1:0",
      "history": [
        {
          "role": "user",
          "content": [{ "text": "Hello, Claude!" }]
        },
        {
          "role": "assistant",
          "content": [{ "text": "Hello! How can I assist you today?" }]
        }
      ]
    }
  ]
  ```

## Project Structure

```plaintext
chat-app/
├── backend/
│   ├── models/
│   │   └── ClaudeHistory.js
│   ├── routes/
│   │   └── chatRoutes.js
│   ├── server.js
│   ├── .env
│   ├── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatUI.js
│   │   ├── App.js
│   │   ├── index.js
│   ├── package.json
└── README.md
```

## Future Improvements

- **More AI Models!** Working on adding chat functionality for more AI models
- **WebSocket Integration:** Upgrade the application to use WebSockets for real-time messaging instead of relying solely on HTTP requests.
- **User Authentication:** Add user authentication to allow multiple users to maintain separate chat histories.
- **Message Encryption:** Implement message encryption for enhanced security in chat communications.

## Contributing
Contributions are welcome! Feel free to submit issues or pull requests to improve the project.
