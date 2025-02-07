const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Atlas connected successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('MongoDB Atlas connection error:', error);
    process.exit(1);
  }); 