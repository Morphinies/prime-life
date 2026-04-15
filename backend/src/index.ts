import http from 'http';
import { env } from './config/env';
import router from './core/router';
import swagger from './config/swagger';
import { initDatabase } from './core/database/init';
import { corsMiddleware } from './core/middleware/cors';
import { corsConfig } from './config/cors';

async function startServer() {
  await initDatabase();

  const server = http.createServer((req, res) => {
    // const referer = req.headers.referer || req.headers.referrer;

    const corsResult = corsMiddleware(corsConfig)({ req, res });
    if (req.method === 'OPTIONS' || !corsResult) return;

    const isHandled = swagger(req, res);

    if (!isHandled) {
      router.handleRequest(req, res);
    }
  });

  server.listen(env.PORT, () => {
    console.log(`The server was started on ${env.PORT} port`);
  });
}

startServer();
