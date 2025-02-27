import {NestFactory} from '@nestjs/core'
import {AppModule} from './config/app.module'
import {AppDataSource} from './ormconfig'

async function bootstrap() {
  try {
    // Create the app first so we can handle errors properly
    const app = await NestFactory.create(AppModule)

    // Try to initialize the database, but don't fail if it doesn't work
    try {
      await AppDataSource.initialize()
    } catch (dbError) {
      console.error('Database initialization failed, using fallback data:', dbError)
    }
    
    // Configure CORS
    app.enableCors({
      origin: ['https://launchpad-ut.vercel.app', 'http://localhost:5173', 'https://launchpad-ut-backend.vercel.app'],
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
        return res.send({ status: 'ok', message: 'API is running' });
      }
      next();
    });

    const port = process.env.PORT || 3000
    await app.listen(port)
  } catch (error) {
    console.error('Error during bootstrap:', error)
    process.exit(1)
  }
}

bootstrap()