import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    // Add connection pool configuration for better Neon compatibility
    // Note: These settings work alongside DATABASE_URL query parameters
    errorFormat: 'minimal',
  });
};

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma ?? prismaClientSingleton();

// Ensure we're using the singleton in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

// Gracefully close connections on shutdown
if (typeof window === 'undefined') {
  const cleanup = async () => {
    try {
      await db.$disconnect();
    } catch (error) {
      console.error('Error disconnecting Prisma:', error);
    }
  };

  process.on('beforeExit', cleanup);
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

// Helper function to execute queries with retry logic
export async function executeWithRetry(operation, maxRetries = 5, delay = 2000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Check if it's a connection-related error
      const isConnectionError = 
        error.message?.includes('connection pool') ||
        error.message?.includes('Timed out fetching') ||
        error.message?.includes('database server is running') ||
        error.message?.includes("Can't reach database server") ||
        error.message?.includes('Can\'t reach database server') ||
        error.code === 'P1008' || // Connection pool timeout
        error.code === 'P1017' || // Server closed connection
        error.code === 'P1001';   // Can't reach database server (Neon paused)
      
      if (isConnectionError) {
        if (attempt < maxRetries) {
          // For P1001 (database unreachable), use longer delays for Neon cold start
          const isDatabaseUnreachable = error.code === 'P1001' || 
            error.message?.includes("Can't reach database server");
          
          let waitTime;
          if (isDatabaseUnreachable) {
            // Neon cold start can take 5-15 seconds, use longer delays
            waitTime = Math.min(3000 + (attempt * 2000), 15000); // 3s, 5s, 7s, 9s, 11s (max 15s)
            console.warn(`Database server unreachable (may be paused), retrying in ${Math.round(waitTime)}ms (attempt ${attempt}/${maxRetries})`);
          } else {
            // Exponential backoff with jitter for other connection errors
            const exponentialDelay = delay * Math.pow(2, attempt - 1);
            const jitter = Math.random() * 1000;
            waitTime = Math.min(exponentialDelay + jitter, 10000); // Cap at 10 seconds
            console.warn(`Connection error, retrying in ${Math.round(waitTime)}ms (attempt ${attempt}/${maxRetries})`);
          }
          
          // Try to disconnect and reconnect to release any stale connections
          try {
            await db.$disconnect();
            // Small delay to allow connections to be released
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (disconnectError) {
            // Ignore disconnect errors
          }
          
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        } else {
          // Last attempt failed - provide helpful error message
          if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
            console.error('Database connection failed after retries. This may indicate:');
            console.error('1. Neon database is paused (check Neon dashboard)');
            console.error('2. Network connectivity issues');
            console.error('3. Database URL is incorrect');
          }
        }
      }
      
      // For other errors, throw immediately
      throw error;
    }
  }
  
  throw lastError;
}

// globalThis.prisma: This global variable ensures that the Prisma client instance is
// reused across hot reloads during development. Without this, each time your application
// reloads, a new instance of the Prisma client would be created, potentially leading
// to connection issues.