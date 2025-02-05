const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/tasks');
const commentRoutes = require('./routes/comments');
const analyticsRoutes = require('./routes/analytics');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/tasks', taskRoutes);
app.use('/comments', commentRoutes);
app.use('/analytics', analyticsRoutes);

// ... 残りのコード ... 