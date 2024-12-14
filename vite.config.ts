import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    hmr: true,
    // open: true,
    cors: true,
    port: 6868,
    host: "0.0.0.0",
    // https: {
    //     cert: "./localhost.crt",
    //     key: "./localhost.key"
    // },
},
})
