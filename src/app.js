const express = require('express');
const authRoutes = require('./routes/auth.routes');
const promptRoutes = require('./routes/prompts.routes');
const errorHandler = require('./middlewares/errorHandler');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static directory for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root route (Health check / Welcome API)
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to AI Prompt Marketplace API! 🤘',
    status: 'Running'
  });
});

app.use('/auth', authRoutes);
app.use('/users', authRoutes); // as requested either /auth/register or /users
app.use('/prompts', promptRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route Not Found' });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
