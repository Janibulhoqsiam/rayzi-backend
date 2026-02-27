const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const cors = require('cors');

// Socket.IO
const http = require('http');
const server = http.createServer(app);
global.io = require('socket.io')(server);

// Routes and socket
const Route = require('./route');
require('./socket');

app.use(cors());
app.use(express.json());
app.use('/', Route);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/storage', express.static(path.join(__dirname, 'storage')));

// Live router (keep obfuscated part if needed)
const liveRouter = require('./node_modules/server/service/stream-service/live'); // adjust if path differs
app.use('/live', liveRouter);

// Serve frontend
app.get('/*', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// MongoDB connection (use environment variable)
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('MONGO: successfully connected to db');
});

// Start server (Render provides PORT automatically)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
