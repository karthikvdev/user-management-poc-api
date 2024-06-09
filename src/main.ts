import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // Here the validation pipe is used for validation API request with help of dto.
  // Swagger Options
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('User Management API')
    .setDescription('Swagger Example API API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  app.enableCors();
  SwaggerModule.setup(`${process.env.SWAGGER_PATH}`, app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
