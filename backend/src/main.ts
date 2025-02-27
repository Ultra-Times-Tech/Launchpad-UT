import { NestFactory } from '@nestjs/core';
import { AppModule } from './config/app.module';
import { AppDataSource } from './ormconfig';

async function bootstrap() {
  await AppDataSource.initialize();
  
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['https://launchpad-ut.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
  process.exit(1);
});