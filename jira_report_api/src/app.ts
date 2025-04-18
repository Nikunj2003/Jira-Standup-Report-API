import express from 'express';
import router from "@/routers/index";
import { validateEnv } from '@/config';
import { setupSwagger } from '@/utils';
import logger from '@/utils/logger';

export function createApp(): express.Application {
  validateEnv();
  
  const app = express();
  app.use(express.json());
  setupSwagger(app);

  app.use((req, res, next) => {
    const host = req.headers.host || 'unknown';
    res.on('finish', () => {
      logger.info(`${host} - "${req.method} ${req.originalUrl}" ${res.statusCode}`);
    });
    next();
  });

  app.use('/api', router);

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    void _next;
    logger.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  return app;
}