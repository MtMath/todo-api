import { NestFactory } from "@nestjs/core";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/middleware/filters/http-exception.filter";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle("Task Management API")
    .setDescription(
      "API para gerenciamento de tarefas com autenticação e compartilhamento"
    )
    .setLicense("MIT", "https://opensource.org/licenses/MIT")
    .setContact(
      "Matheus Costa",
      "https://github.com/mtmath",
      "matheus.design12@gmail.com"
    )
    .setVersion("1.0")
    .addTag("auth", "Endpoints de autenticação")
    .addTag("tasks", "Endpoints para gerenciamento de tarefas")
    .addTag("task-lists", "Endpoints para listas de tarefas compartilhadas")
    .addTag("users", "Endpoints de gerenciamento de usuários")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description:
          "JWT Authorization header using the Bearer scheme.\r\n\r\n" +
          "Enter 'Bearer' [space] followed by your valid token in the field below.\r\n\r\n" +
          'Example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."',
        in: "header",
      },
      "JWT-auth"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = configService.get<number>("PORT") || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/api/v1`);
  console.log(
    `Swagger documentation is available at: http://localhost:${port}/api/docs`
  );
}
bootstrap();
