import * as Handlebars from 'handlebars';
import * as fs from 'node:fs/promises';
import * as nodemailer from 'nodemailer';

import { IMailerConfig } from '@libs/server/util-common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServerUtilMailerService {
  private readonly transporter: nodemailer.Transporter | undefined;
  private logger = new Logger('MailerService');

  constructor(private readonly cfgService: ConfigService<IMailerConfig>) {
    if (cfgService.get('enabled', { infer: true })) {
      this.logger.debug(`Configuring nodemailer`);
      this.transporter = nodemailer.createTransport({
        host: cfgService.get('host', { infer: true }),
        port: cfgService.get('port', { infer: true }),
        ignoreTLS: cfgService.get('ignoreTls', { infer: true }),
        secure: cfgService.get('secure', { infer: true }),
        requireTLS: cfgService.get('requireTls', { infer: true }),
        auth: {
          user: cfgService.get('user', { infer: true }),
          pass: cfgService.get('password', { infer: true }),
        },
        debug: cfgService.get('debug', { infer: true }),
      });
    } else {
      this.logger.debug(`nodemailer is disabled, skipping configuration`);
    }
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    let html: string | undefined;
    if (templatePath) {
      const template = await fs.readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, {
        strict: true,
      })(context);
    }

    await this.transporter?.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `"${this.cfgService.get('defaultName', {
            infer: true,
          })}" <${this.cfgService.get('defaultEmail', {
            infer: true,
          })}>`,
      html: mailOptions.html ? mailOptions.html : html,
    });
  }
}
