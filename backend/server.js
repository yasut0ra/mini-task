const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
console.log('Environment variables loaded');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '設定されています' : '未設定です');

// MongoDB接続を最適化
async function connectToDatabase() {
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    retryWrites: true,
    w: 'majority',
    maxPoolSize: 10,
    minPoolSize: 5
  };

  try {
    console.log('Attempting to connect to MongoDB...');
    const client = await mongoose.connect(process.env.MONGODB_URI, opts);
    console.log('MongoDB connection successful');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// 初期接続を確立
connectToDatabase()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log('Environment:', process.env.NODE_ENV);
    });
  })
  .catch(error => {
    console.error('Initial database connection failed:', error);
    process.exit(1);
  });

// プロセス終了時の処理
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB connection closure:', err);
    process.exit(1);
  }
});

module.exports = app;