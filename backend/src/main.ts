import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

// Load .env file
dotenv.config();

console.log('🔑 INGEST_TOKEN:', process.env.INGEST_TOKEN || 'NOT FOUND');
console.log('🔗 DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Content Crawler API')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'X-Ingest-Token', in: 'header' },
      'ingest',
    )
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, doc);

  await app.listen(process.env.PORT || 4000);
  console.log('🚀 Server running on port:', process.env.PORT || 4000);
}
bootstrap();