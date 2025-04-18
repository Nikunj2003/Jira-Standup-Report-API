import fs from 'fs';
import yaml from 'js-yaml';
import { type Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import logger from '@/utils/logger';

export function setupSwagger(app: Express): void {
  try {
    const swaggerDocument = yaml.load(
      fs.readFileSync('swagger.yaml', 'utf8')
    ) as swaggerUi.JsonObject;
    
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    logger.info('Swagger docs available at /api/docs');
  } catch (error) {
    logger.error('Failed to load Swagger docs:', error);
  }
}