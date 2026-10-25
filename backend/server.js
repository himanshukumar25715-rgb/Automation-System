// GovVerify Backend Server entry point
import app from './app.js';
import { PORT } from './src/config/constants.js';

app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(` GovVerify REST API Server Running`);
  console.log(` Port:    http://localhost:${PORT}`);
  console.log(` Health:  http://localhost:${PORT}/api/health`);
  console.log(` Audit:   http://localhost:${PORT}/api/audit/verify`);
  console.log(`========================================================`);
});
