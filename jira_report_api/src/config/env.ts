import dotenv from 'dotenv';
import { z } from 'zod';
import { EnvironmentSchema } from '@/schemas';

dotenv.config();

export type Environment = z.infer<typeof EnvironmentSchema>;

export function validateEnv(): Environment {
  try {
    return EnvironmentSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .filter(e => e.code === 'invalid_type' && e.received === 'undefined')
        .map(e => e.path[0]);

      if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
      }
      
      throw new Error(`Environment validation failed: ${error.errors.map(e => `${e.path}: ${e.message}`).join('; ')}`);
    }
    throw new Error('Unknown error during environment validation');
  }
}

export const ENV = validateEnv();