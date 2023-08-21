---
title: Getting Started
description: How to get up and running with this repository
---

# Getting Started

<ol>
    <li>
      <a href="#initial-set-up">Initial Set Up</a>
      <ul>
      <li><a href="#database">Database</a></li>
      </ul>
    </li>
    <li>
      <a href="#configuration">Configuration</a>
    </li>
    <li>
      <a href="#running">Running the Applications</a>
    </li>
</ol>

## Initial Set Up

Once the repository has been created, you'll need to install the project's dependencies:

```sh
$ yarn
```

Environment files will also be needed for later configuration. Please rename the example files so that configuration data will be recognized at run time:

```sh
$ mv .env.example .env

# this is only needed if you plan on using Nx Cloud
$ mv nx-cloud.env.example nx-cloud.env
```

### Database

This backend requires a database connection for data storage. During development I defaulted to a PostgreSQL database running via Docker, but SQLite can be used as well.

**Docker Instructions**

```sh
$ docker-compose up -d
```

The `docker-compose.yml` file includes the Alpine-based postgres image as well as Adminer with a Web UI for graphically managing your database. The Adminer UI will be available at [http://localhost:8080].

By default a local directory will be used for data persistence (`{projectRoot}/tmp/pgdata`). This can be changed or removed in the `docker-compose.yml` file.

**SQLite Instructions**

No special configuration is required - see [Configuration](#configuration) for connection details. If a `.sqlite` file is not available when the application first runs, it will be created.

## Configuration

All configuration (except for Nx Cloud) is handled in the `.env` file we created earlier. Here is an explanation of the settings currently exposed in that file:

| Variable                    | Purpose                                                                                                               | Notes                                                                                                                                                                                                                                                     |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NODE_ENV                    |                                                                                                                       |                                                                                                                                                                                                                                                           |
| ENVIRONMENT                 | Used to determine where the application is running (CI pipeline, local, prod, etc)                                    |                                                                                                                                                                                                                                                           |
| API_VERSION                 | REST API uses versioned routes for easy evolution over time. Setting this will change the version exposed by the API. |                                                                                                                                                                                                                                                           |
| API_PREFIX                  | Defaults to `/api`, this allows customization of the API endpoints paths (ex: `/api/v1/my-endpoint`)                  |                                                                                                                                                                                                                                                           |
| CORS_ORIGINS                | Tells NestJS which origins to trust, defaults to `*`                                                                  |                                                                                                                                                                                                                                                           |
| ENABLE_SWAGGER              | Toggles whether Swagger docs UI will be exposed                                                                       |                                                                                                                                                                                                                                                           |
| GENERATE_SWAGGER_JSON       | Generates a `swagger.json` file if true                                                                               |                                                                                                                                                                                                                                                           |
| JWT_ACCESS_EXPIRATION_TIME  | Time before an access token expires (ex: `3600s` or `2d`)                                                             |                                                                                                                                                                                                                                                           |
| JWT_ACCESS_EXPIRATION_TIME  | Time before a refresh token expoires (ex: `7d` or `1w`)                                                               |                                                                                                                                                                                                                                                           |
| JWT_ACCESS_SECRET           | Strong secret used to sign JWTs                                                                                       | **MUST** be different from the refresh token secret. Can be generated using this following shell command:<br><code>node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"</code>                                                   |
| JWT_REFRESH_SECRET          | See `JWT_ACCESS_SECRET`                                                                                               |                                                                                                                                                                                                                                                           |
| SERVER_HOST                 | REST API host (ex: `localhost`, `my-app.com`)                                                                         |                                                                                                                                                                                                                                                           |
| SERVER_PORT                 | Port where REST API is exposed                                                                                        |                                                                                                                                                                                                                                                           |
| SWAGGER_JSON_FILE           | Name of the file to be generated, if enabled                                                                          |                                                                                                                                                                                                                                                           |
| DATABASE_TYPE               | Defaults to `sqlite`, but `postgres` can be used as well.                                                             | PostgreSQL and SQLite are the only databases that have been tested. More infomation on configuring TypeORM can be found in their source code: [DataSourceOptions.ts](https://github.com/typeorm/typeorm/blob/master/src/data-source/DataSourceOptions.ts) |
| DATABASE_HOST               | Host where database is running                                                                                        | Not required for SQLite                                                                                                                                                                                                                                   |
| DATABASE_PORT               | Port where database is running                                                                                        | Not required for SQLite                                                                                                                                                                                                                                   |
| DATABASE_USERNAME           | Database user for connection                                                                                          | Not required for SQLite                                                                                                                                                                                                                                   |
| DATABASE_PASSWORD           | Database password for connection                                                                                      | Not required for SQLite                                                                                                                                                                                                                                   |
| DATABASE_NAME               | Name of database to create                                                                                            |                                                                                                                                                                                                                                                           |
| DATABASE_PATH               | Path to SQLite file                                                                                                   | Required for SQLite only                                                                                                                                                                                                                                  |
| DATABASE_LOGGING_ENABLED    | Toggle additional, database-specific logging                                                                          |                                                                                                                                                                                                                                                           |
| DATABASE_SYNCHRONIZE        | Automatically sync tables/entities with the application                                                               | Not supposed to be used for production!                                                                                                                                                                                                                   |
| SENTRY_DSN                  | Optional DSN URL for Sentry error reporting                                                                           |                                                                                                                                                                                                                                                           |
| SOCIAL_GOOGLE_ENABLED       | Boolean that toggles Google OAuth integration                                                                         |                                                                                                                                                                                                                                                           |
| SOCIAL_GOOGLE_CLIENT_ID     |                                                                                                                       |                                                                                                                                                                                                                                                           |
| SOCIAL_GOOGLE_CLIENT_SECRET |                                                                                                                       |                                                                                                                                                                                                                                                           |
| EMAIL_ENABLED               | Optional boolean that toggles SMTP transport abilities                                                                |                                                                                                                                                                                                                                                           |
| EMAIL_HOST                  | SMTP Host                                                                                                             |                                                                                                                                                                                                                                                           |
| EMAIL_PORT                  | SMTP port                                                                                                             |                                                                                                                                                                                                                                                           |
| EMAIL_USER                  |                                                                                                                       |                                                                                                                                                                                                                                                           |
| EMAIL_PASSWORD              |                                                                                                                       |                                                                                                                                                                                                                                                           |
| EMAIL_TEMPLATE_DIR          | Path relative to project root of Handlebars files used for emails                                                     |                                                                                                                                                                                                                                                           |
| EMAIL_PARTIALS_DIR          | Path relative to project root of Handlebars partials that can be included in templates                                |                                                                                                                                                                                                                                                           |
| EMAIL_IGNORE_TLS            |                                                                                                                       |                                                                                                                                                                                                                                                           |
| EMAIL_REQUIRE_TLS           |                                                                                                                       |                                                                                                                                                                                                                                                           |
| EMAIL_DEBUG                 |                                                                                                                       |                                                                                                                                                                                                                                                           |
| EMAIL_DEFAULT_NAME          | Default sender name for emails                                                                                        |                                                                                                                                                                                                                                                           |
| EMAIL_DEFAULT_EMAIL         | Default sender email for outgoing email                                                                               |                                                                                                                                                                                                                                                           |
| EMAIL_SECURE                |                                                                                                                       |                                                                                                                                                                                                                                                           |

## Running

With your database and configuration in place, you should be able to run one of the following commands:

```sh
# to run just the REST API
$ nx serve server

# to run both the client and API simutaneously
$ nx run-many --target=serve --all
```
