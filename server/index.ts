import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes, registerPreJsonRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase } from "./database-init";

// Validate required environment variables in production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.FRONTEND_URL) {
    console.error('❌ FRONTEND_URL is required in production');
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is required in production');
    process.exit(1);
  }
  if (!process.env.SESSION_SECRET || 
      process.env.SESSION_SECRET === 'your-secret-key-change-in-production' ||
      process.env.SESSION_SECRET === 'CHANGE_ME_TO_RANDOM_64_CHAR_STRING') {
    console.error('❌ SESSION_SECRET must be set to a secure value in production');
    process.exit(1);
  }
}

/**
 * Get allowed CORS origins based on environment
 * @returns Array of allowed origins or false to block all origins
 */
function getAllowedOrigins(): string[] | false {
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.FRONTEND_URL) {
      return false;
    }
    // Split comma-separated URLs and trim whitespace
    return process.env.FRONTEND_URL.split(',').map(url => url.trim());
  }
  // Development environment allows localhost
  return ['http://localhost:5173', 'http://127.0.0.1:5173'];
}

const app = express();

// Enable CORS for frontend-backend communication
app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Mount pre-JSON routes (e.g., Stripe webhook signature verification) before body parsers
registerPreJsonRoutes(app);

// Use larger limits to support base64 images (profile headshot uploads)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: false, limit: '25mb' }));

// Serve attached assets (videos, images, documents)
app.use('/attached_assets', express.static('attached_assets'));
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize database before starting the server
  console.log('🔄 Initializing database...');
  const dbInitSuccess = await initializeDatabase();
  
  if (!dbInitSuccess) {
    console.error('❌ Database initialization failed. Exiting...');
    process.exit(1);
  }
  
  console.log('✅ Database initialization completed successfully');
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Only start server if not running in Vercel environment
  if (!process.env.VERCEL) {
    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen(port, () => {
      log(`serving on port ${port}`);
    });
  }
})();

// Export the app for Vercel
export { app };
