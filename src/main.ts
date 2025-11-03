import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

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
      "http://localhost:4173",
      "http://localhost:5173",
      "http://localhost:8080",
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
  app.useGlobalFilters(new HttpExceptionFilter());
  // TODO: Enable once all controllers are secured properly
  // TODO: Add @ApiBearerAuth("JWT-auth") to all controllers
  // app.useGlobalGuards(
  //   app.get(FirebaseAuthGuard),
  //   app.get(DbGuard),
  //   app.get(RolesGuard),
  // );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
