const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (req, res) => res.json({ 
  status: 'ok', 
  version: 'green',
  app: 'proyecto-devops-green',
  mensaje: 'Version 2.0 - Nuevas features activas!'
}));

// Endpoint exclusivo de green
app.get('/version', (req, res) => res.json({
  version: '2.0',
  color: 'green',
  features: ['CRUD mejorado', 'Endpoint /version', 'Blue-Green Deployment']
}));
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

console.log('authRoutes:', typeof authRoutes);
console.log('taskRoutes:', typeof taskRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;