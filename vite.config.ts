import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    return {
      plugins: [
        react(), 
        tailwindcss()
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@cristianglezm/live-commentary-widget': path.resolve(__dirname, 'packages/@cristianglezm/live-commentary-widget/src/index.ts'),
        }
      },
    };
});
