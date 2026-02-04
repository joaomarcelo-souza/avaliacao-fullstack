import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Application bootstrap.
 *
 * - CORS is enabled to allow requests from the frontend during development.
 * - ValidationPipe is applied globally to enforce DTO validations and auto-transform types.
 * - Swagger UI is served at /api for easy API exploration.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow cross-origin requests (adjust in production as needed)
  app.enableCors();

  // Global validation: remove unknown properties and transform payloads to DTO instances
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Avaliação API')
    .setDescription('API para gerenciamento de usuários')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
