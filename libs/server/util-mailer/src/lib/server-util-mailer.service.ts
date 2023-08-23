import * as Handlebars from 'handlebars';
import * as fs from 'node:fs';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import * as path from 'path';

import { mailerConfig } from '@libs/server/util-common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { IBaseEmailContext } from '../templates/contexts';

import SMTPTransport = require('nodemailer/lib/smtp-transport');
@Injectable()
export class ServerUtilMailerService {
  private readonly transporter!: Transporter;
  private logger = new Logger('MailerService');

  constructor(
    @Inject(mailerConfig.KEY)
    private readonly cfgService: ConfigType<typeof mailerConfig>,
  ) {
    if (cfgService.enabled) {
      this.logger.debug(`Configuring nodemailer`);
      const options: SMTPTransport.Options = {
        host: cfgService.host,
        port: cfgService.port,
        ignoreTLS: cfgService.ignoreTls,
        secure: cfgService.secure,
        requireTLS: cfgService.requireTls,
        auth: {
          user: cfgService.user,
          pass: cfgService.password,
        },
        debug: cfgService.debug,
        logger: true,
      };
      this.transporter = createTransport(options);
      this.registerPartials(cfgService.partialsDir);
    } else {
      this.logger.debug(`nodemailer is disabled, skipping configuration`);
    }
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown> | IBaseEmailContext;
  }): Promise<void> {
    let html: string | undefined;
    if (templatePath) {
      try {
        const template = fs.readFileSync(templatePath, 'utf-8');
        html = Handlebars.compile(template, {
          strict: true,
        })(context);
      } catch (err) {
        this.logger.error(`Error while registering email template`, err);
      }
    }

    await this.transporter?.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `"${this.cfgService.defaultName}" <${this.cfgService.defaultEmail}>`,
      html: mailOptions.html ? mailOptions.html : html,
    });
  }

  isValidPartial(file: string) {
    const ext = path.extname(file);
    return ext === '.hbs';
  }

  registerPartials(partialsDir: string) {
    const partials = fs
      .readdirSync(partialsDir)
      .filter(this.isValidPartial)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((res: { [name: string]: any }, curr) => {
        const ext = path.extname(curr);
        const partialPath = path.join(partialsDir, curr);
        const partialFile = fs.readFileSync(partialPath, 'utf-8');
        const partialName = path.basename(curr, ext);
        res[partialName] = partialFile;
        return res;
      }, {});

    this.logger.debug(
      `Registering all found partials: ${Object.keys(partials).join(', ')}`,
    );
    Handlebars.registerPartial(partials);
  }
}
