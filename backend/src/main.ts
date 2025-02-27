import {NestFactory} from '@nestjs/core'
import {AppModule} from './config/app.module'
import {AppDataSource} from './ormconfig'

async function bootstrap() {
  await AppDataSource.initialize()

  const app = await NestFactory.create(AppModule)

  // Configure CORS
  app.enableCors({
    origin: 'https://launchpad-ut.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: false,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Disposition'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap().catch(error => {
  console.error('Error during bootstrap:', error)
  process.exit(1)
})
