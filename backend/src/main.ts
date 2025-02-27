import {NestFactory} from '@nestjs/core'
import {AppModule} from './config/app.module'
import {AppDataSource} from './ormconfig'

async function bootstrap() {
  try {
    await AppDataSource.initialize()
    console.log('Database initialized successfully')
    
    const app = await NestFactory.create(AppModule)

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

    const port = process.env.PORT || 3000
    await app.listen(port)
    console.log(`Application is running on port ${port}`)
  } catch (error) {
    console.error('Error during bootstrap:', error)
    process.exit(1)
  }
}

bootstrap()