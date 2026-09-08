import app from './app.js';
import { connectDatabase } from './config/database.js';
import { requireEnvironment } from './config/env.js';

async function startServer() {
  const configuration = requireEnvironment();
  await connectDatabase(configuration.mongodbUri);

  const server = app.listen(configuration.port, () => {
    console.log(`ArthSaathi API listening on port ${configuration.port}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down.`);
    server.close(async () => {
      process.exit(0);
    });
  };

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

startServer().catch((error) => {
  console.error(`Unable to start ArthSaathi API: ${error.message}`);
  process.exitCode = 1;
});
