import {NestFactory} from '@nestjs/core'
import {AppModule} from './config/app.module'
import {AppDataSource} from './ormconfig'
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger'
import * as dotenv from 'dotenv'
import * as basicAuth from 'express-basic-auth'

async function bootstrap() {
  dotenv.config()
  try {
    const app = await NestFactory.create(AppModule)

    // Protection de Swagger avec une authentification basique
    app.use(
      '/docs',
      basicAuth({
        challenge: true,
        users: {
          [process.env.SWAGGER_USER || 'admin']: process.env.SWAGGER_PASSWORD || 'password',
        },
      })
    )

    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('The API description')
      .setVersion('1.0')
      .addTag('users')
      .addServer('https://launchpad-2ycml.ondigitalocean.app/api')
      .addServer('http://localhost:3000')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        basePath: '/api',
        security: [{bearer: []}],
      },
      customSiteTitle: 'Launchpad UT API Documentation',
    })

    try {
      await AppDataSource.initialize()
    } catch (dbError) {
      console.error('Database initialization failed, using fallback data:', dbError)
    }

    app.enableCors({
      origin: ['https://launchpad-ut.vercel.app', 'http://localhost:5173', 'https://localhost:5173', 'https://launchpad-ut-backend.vercel.app', 'https://launchpad-2ycml.ondigitalocean.app'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: false,
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      exposedHeaders: ['Content-Disposition'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    })

    // Add a health check endpoint
    app.use('/', (req, res, next) => {
      if (req.path === '/') {
        return res.send({status: 'ok', message: 'API is running'})
      }
      next()
    })

    const port = process.env.PORT || 3000
    await app.listen(port)
  } catch (error) {
    console.error('Error during bootstrap:', error)
    process.exit(1)
  }
}

bootstrap()