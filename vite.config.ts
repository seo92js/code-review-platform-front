import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api' : 'http://localhost:8080',
      '/oauth2' : 'http://localhost:8080',
      '/logout' : 'http://localhost:8080',
    }
  }
})
