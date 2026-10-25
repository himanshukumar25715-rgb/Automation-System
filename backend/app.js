// GovVerify Express app (no listen() here so tests can import it).
import express from 'express';
import cors from 'cors';
import { requestLogger, errorHandler } from './src/middleware/logger.js';

import applicationsRouter from './src/routes/applications.js';
import undertakingsRouter from './src/routes/undertakings.js';
import leasesRouter from './src/routes/leases.js';
import evcRouter from './src/routes/evc.js';
import escalationsRouter from './src/routes/escalations.js';
import regionsRouter from './src/routes/regions.js';
import integrationsRouter from './src/routes/integrations.js';
import reportsRouter from './src/routes/reports.js';
import authRouter from './src/routes/auth.js';
import auditRouter from './src/routes/audit.js';
import facultyRouter from './src/routes/faculty.js';
import rulesRouter from './src/routes/rules.js';

const app = express();

app.use(cors({
  origin: true, // Local demo frontend only; do not use as production CORS policy.
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') app.use(requestLogger);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'GovVerify (AICTE Automation Platform) REST API',
    version: '1.1.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

app.use('/api/applications', applicationsRouter);
app.use('/api/undertakings', undertakingsRouter);
app.use('/api/leases', leasesRouter);
app.use('/api/evc', evcRouter);
app.use('/api/escalations', escalationsRouter);
app.use('/api/regions', regionsRouter);
app.use('/api/integrations', integrationsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/auth', authRouter);
app.use('/api/audit', auditRouter);
app.use('/api/faculty', facultyRouter);
app.use('/api/rules', rulesRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Endpoint ${req.method} ${req.originalUrl} not found` });
});
app.use(errorHandler);

export default app;
