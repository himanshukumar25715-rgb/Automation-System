// GovVerify Backend Server
import express from 'express';
import cors from 'cors';
import { PORT } from './src/config/constants.js';
import { requestLogger, errorHandler } from './src/middleware/logger.js';

// Route Imports
import applicationsRouter from './src/routes/applications.js';
import undertakingsRouter from './src/routes/undertakings.js';
import leasesRouter from './src/routes/leases.js';
import evcRouter from './src/routes/evc.js';
import escalationsRouter from './src/routes/escalations.js';
import regionsRouter from './src/routes/regions.js';
import integrationsRouter from './src/routes/integrations.js';
import reportsRouter from './src/routes/reports.js';
import authRouter from './src/routes/auth.js';

const app = express();

// Middlewares
app.use(cors({
  origin: true, // Local demo frontend only; do not use as production CORS policy.
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health Check & Root Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'GovVerify (AICTE Automation Platform) REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// Mount Routes
app.use('/api/applications', applicationsRouter);
app.use('/api/undertakings', undertakingsRouter);
app.use('/api/leases', leasesRouter);
app.use('/api/evc', evcRouter);
app.use('/api/escalations', escalationsRouter);
app.use('/api/regions', regionsRouter);
app.use('/api/integrations', integrationsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/auth', authRouter);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`
  });
});

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(` GovVerify REST API Server Running`);
  console.log(` Port:    http://localhost:${PORT}`);
  console.log(` Health:  http://localhost:${PORT}/api/health`);
  console.log(` Docs:    http://localhost:${PORT}/api/reports/pdf`);
  console.log(`========================================================`);
});

export default app;
