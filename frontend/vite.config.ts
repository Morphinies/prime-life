import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { envPrefix } from './src/shared/config/env';
import { reactRouter } from '@react-router/dev/vite';
import { envDir, loadValidEnv } from './src/shared/config/env/env-loader';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadValidEnv(mode);

  return {
    plugins: [
      reactRouter(),
      tsconfigPaths(),
      svgr({
        include: '**/*.svg',
        svgrOptions: {
          ref: true,
          svgo: false,
          titleProp: true,
          exportType: 'named',
        },
      }),
      {
        name: 'ignore-well-known',
        configureServer(server) {
          server.middlewares.use('/.well-known', (req, res, next) => {
            res.statusCode = 404;
            res.end();
          });
        },
      },
    ],
    server: {
      port: env.PORT,
    },
    preview: {
      port: env.PORT,
    },
    envDir,
    envPrefix,
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  };
});
