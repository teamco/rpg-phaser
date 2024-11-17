import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/rpg-phaser/',
  resolve: {
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();
          }
        },
      },
    },
  },
})
