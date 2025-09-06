import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle("WBD-API")
  .setDescription("The WBD project API is the API REST")
  .setVersion("1.0")
  .addBearerAuth(
      {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT-auth',
      description: 'Enter JWT token',
      in: 'header',
      },
      'JWT-auth',
      )
  .build();
  app.enableCors({
    origin: [
      "http://localhost:5173",
      "https://ages-wimbelemdon.github.io"
    ],
    credentials: true,
  });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
