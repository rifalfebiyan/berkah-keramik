import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('DEBUG: DATABASE_URL =', process.env.DATABASE_URL);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3002);
}

// Triggering rebuild for UsersModule registration
bootstrap();
