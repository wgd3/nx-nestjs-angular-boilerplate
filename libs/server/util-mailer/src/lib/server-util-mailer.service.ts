import * as Handlebars from 'handlebars';
import * as fs from 'node:fs/promises';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';

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
    private readonly cfgService: ConfigType<typeof mailerConfig>
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
      // TODO this is a cheater way to handle partials
      ['style', 'header', 'footer', 'layout'].forEach(async (partialName) => {
        const partialFile =
          __dirname + '/assets/templates/partials/' + partialName + '.hbs';
        try {
          const partial = await fs.readFile(partialFile, 'utf-8');
          Handlebars.registerPartial(partialName, partial);
        } catch (err) {
          this.logger.error(`Error while registering email partial`, err);
        }
      });

      try {
        const template = await fs.readFile(templatePath, 'utf-8');
        html = Handlebars.compile(template, {
          strict: true,
        })(context);
      } catch (err) {
        this.logger.error(`Error while registering email template`, err);
      }

      if (this.cfgService.debug) {
        const used = [];
        const unused = [];

        for (const name in Handlebars.partials) {
          const partial = Handlebars.partials[name];
          if (typeof partial === 'function') {
            used.push(name);
          } else {
            unused.push(name);
          }
        }

        console.log('Used partials: ' + used);
        console.log('Unused partials: ' + unused);
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
}
