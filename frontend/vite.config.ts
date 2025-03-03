import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    base: mode === 'production' ? '/' : `/${env.VITE_APP_PATHNAME}/`,
    server: {
      proxy: {
        '/api': {
          target: 'https://localhost:3000',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
      https: {
        key: fs.readFileSync('./.cert/key.pem'),
        cert: fs.readFileSync('./.cert/cert.pem'),
      },
    },
  }
})
