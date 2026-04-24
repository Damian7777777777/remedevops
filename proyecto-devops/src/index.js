const express = require('express');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requests HTTP',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duracion de requests HTTP en segundos',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    httpRequestsTotal.inc({ method: req.method, route: req.path, status: res.statusCode });
    end({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', version: process.env.VERSION || 'blue' }));

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
