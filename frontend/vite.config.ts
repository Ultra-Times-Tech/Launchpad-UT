import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '')
  const certExists = fs.existsSync('./.cert/cert.pem') && fs.existsSync('./.cert/key.pem')

  return {
    plugins: [react()],
    base: mode === 'production' ? '/' : `/${env.VITE_APP_PATHNAME}/`,
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
      ...(certExists
        ? {
            https: {
              key: fs.readFileSync('./.cert/key.pem'),
              cert: fs.readFileSync('./.cert/cert.pem'),
            },
          }
        : {}),
    },
    preview: {
      host: '0.0.0.0',
      port: 8080,
      allowedHosts: ['launchpad-2ycml.ondigitalocean.app', 'localhost']
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
