import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import express from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const PORT = process.env.PORT ?? 3000

    app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("CRM Panel")
    .setDescription("O'quvchilar uchun Crm panel")
    .setVersion("1.0.0") 
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "token saqlash uchun",
        in: "header",
      }, 
      "JWT-auth", 
    ) 
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api-docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true
    } 
  });

  app.use("/uploads", express.static("uploads"))

 
  await app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
    console.log(`Documentation: http://localhost:${PORT}/api-docs`);
  });
}
bootstrap();
