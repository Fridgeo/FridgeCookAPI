import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('FridgeCook API')
    .setDescription('API pour gérer les recettes, ingrédients et régimes alimentaires')
    .setVersion('1.0')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI
  SwaggerModule.setup('api', app, document);

  // Scalar API Reference
  app.use(
    '/reference',
    apiReference({
      content: document,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`API en cours d'exécution sur http://localhost:${port}`);
}
bootstrap();
