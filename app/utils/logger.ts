import pino from 'pino';
import { createServer } from 'http';
import pinoHttp from 'pino-http';
import http from 'http';
import { Logger } from 'pino';

interface LoggerServer extends http.Server {
    logger: Logger;
  }

let logger;

if (typeof window) {
  // In the browser, use a simple logger that writes to the console
  logger = pino({ level: process.env.LOG_LEVEL || 'debug' });
} else {
  // On the server, use pino-http middleware to log HTTP requests
  const pinoMiddleware = pinoHttp({
    logger: pino({ level: process.env.LOG_LEVEL || 'debug' }),
  });
  const server = createServer(pinoMiddleware);
  logger = (server as LoggerServer).logger;
}

export default logger;