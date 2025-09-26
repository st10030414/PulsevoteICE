const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");

dotenv.config();

const app = express();

app.use("/api/polls", pollRoutes);
app.use("/api/auth", authRoutes);
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('PulseVote API running!');
});

app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date() });
});


module.exports = app;
