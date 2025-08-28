import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // ou celui que tu veux
    strictPort: true,
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173, // assure-toi que ça correspond au port de ton serveur
    },
  },
});
