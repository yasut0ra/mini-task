const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const taskRoutes = require('./routes/tasks');
const cookieParser = require('cookie-parser');

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// MongoDBの接続
mongoose.connect('mongodb://localhost:27017/minitask', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/tasks', taskRoutes);
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
