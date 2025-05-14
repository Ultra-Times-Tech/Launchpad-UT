import {defineConfig, Plugin} from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig(({mode}) => {
  const certExists = fs.existsSync('./.cert/cert.pem') && fs.existsSync('./.cert/key.pem')

  const redirectPlugin: Plugin = {
    name: 'redirect-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || ''

        if (url === '/launchpad-ut') {
          res.writeHead(301, {Location: '/launchpad-ut/'})
          res.end()
          return
        }

        next()
      })
    },
  }

  return {
    plugins: [react(), redirectPlugin],
    base: mode === 'production' ? '/' : `/launchpad-ut/`,
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
      historyApiFallback: {
        rewrites: [{from: /^\/launchpad-ut$/, to: '/launchpad-ut/'}],
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
      allowedHosts: ['launchpad-2ycml.ondigitalocean.app', 'localhost'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})