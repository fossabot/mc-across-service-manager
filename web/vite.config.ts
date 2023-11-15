import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const basicConfig = {
  plugins: [react(), tsconfigPaths()],
  base: '/',
  build: {
    // minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        assetFileNames: assetInfo => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      ...basicConfig,
      server: {
        host: true,
        proxy: {
          '/api/v1/orchestrator': {
            target: 'http://34.64.91.20:8090/',
            secure: false,
          },
          '/api/v1/multi-cloud': {
            target: 'http://34.64.91.20:8091/',
            secure: false,
          },
          '/api/v1/controller': {
            target: 'http://34.64.91.20:8092/',
          },
          '/api/v1/bff': {
            target: 'http://localhost:8095/',
          },
        },
      },
    };
  }
  return {
    ...basicConfig,
    server: {
      host: true,
      proxy: {
        '/api/v1/orchestrator': {
          target: 'http://34.64.91.20:8090',
          changeOrigin: false,
          secure: false,
        },
        '/api/v1/multi-cloud': {
          target: 'http://34.64.91.20:8091',
          changeOrigin: false,
          secure: false,
        },
        '/api/v1/controller': {
          target: 'http://34.64.91.20:8092',
          changeOrigin: false,
          secure: false,
        },
        '/api/v1/bff': {
          target: 'http://34.64.91.20:8095',
          changeOrigin: false,
          secure: false,
        },
      },
    },
  };
});
