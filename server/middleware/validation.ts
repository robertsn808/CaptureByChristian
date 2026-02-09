import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * Middleware to validate route parameters against a Zod schema
 */
export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      res.status(400).json({ 
        error: 'Invalid parameters', 
        details: error instanceof z.ZodError ? error.errors : error 
      });
    }
  };
};

/**
 * Middleware to validate request body against a Zod schema
 */
export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ 
        error: 'Invalid request body', 
        details: error instanceof z.ZodError ? error.errors : error 
      });
    }
  };
};

/**
 * Middleware to validate query parameters against a Zod schema
 */
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      res.status(400).json({ 
        error: 'Invalid query parameters', 
        details: error instanceof z.ZodError ? error.errors : error 
      });
    }
  };
};

/**
 * Async error handler wrapper to eliminate try-catch boilerplate
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Common parameter schemas
 */

// Schema for validating numeric ID parameters
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a valid number").transform(Number)
});

// Schema for availability query parameters
export const availabilityQuerySchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime()
});
