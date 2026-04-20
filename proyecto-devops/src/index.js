const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', version: process.env.VERSION || 'blue' }));

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

console.log('authRoutes:', typeof authRoutes);
console.log('taskRoutes:', typeof taskRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;