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
    .setTitle(`Nx NestJS Angular Boilerplace REST API`)
    .setVersion(configService.get(ENV_API_VERSION) ?? '1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  const documentEndpoint = `${configService.get(
    ENV_API_PREFIX,
  )}/${configService.get(ENV_API_VERSION)}`;
  Logger.debug(`Using documentation endpoint: ${documentEndpoint}`);

  SwaggerModule.setup(documentEndpoint, app, document, {
    jsonDocumentUrl: configService.get(ENV_SWAGGER_JSON_FILE),
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  Logger.log(
    `🚀 Swagger API Documentation: http://${configService.get(
      ENV_SERVER_HOST,
    )}:${configService.get(ENV_SERVER_PORT)}/${documentEndpoint}`,
  );
}
