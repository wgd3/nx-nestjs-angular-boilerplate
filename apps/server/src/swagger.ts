import {
  ENV_API_PREFIX,
  ENV_API_VERSION,
  ENV_SERVER_HOST,
  ENV_SERVER_PORT,
  ENV_SWAGGER_JSON_FILE,
} from '@libs/shared/util-constants';
import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService);

  const documentBuilder = new DocumentBuilder()
    .setTitle(`Full Stack To-Do REST API`)
    .setVersion(configService.get(ENV_API_VERSION) ?? '')
    .addBearerAuth();

  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  const documentEndpoint = `${configService.get(
    ENV_API_PREFIX
  )}/${configService.get(ENV_API_VERSION)}`;
  SwaggerModule.setup(documentEndpoint, app, document, {
    jsonDocumentUrl: configService.get(ENV_SWAGGER_JSON_FILE),
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  Logger.log(
    `🚀 Swagger API Documentation: http://${configService.get(
      ENV_SERVER_HOST
    )}:${configService.get(ENV_SERVER_PORT)}/${documentEndpoint}`
  );
}
