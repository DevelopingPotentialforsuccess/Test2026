import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // This loads the environment variables from GitHub Secrets
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // IMPORTANT: Changed to '/' because of your custom domain
    base: '/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), tailwindcss()],
    define: {
      // This sends the list of 12 keys into your website code safely
      'process.env.GEMINI_KEYS': JSON.stringify(env.VITE_GEMINI_KEYS || env.GEMINI_API_KEY || '')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
