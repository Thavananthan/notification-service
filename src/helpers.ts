import path from 'path';

import { IEmailLocals, winstonLogger } from '@thavananthan/eapp-shared';
import { config } from '@notifications/config';
import nodemailer, { Transporter } from 'nodemailer';
import Email from 'email-templates';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mailTransportHelper', 'debug');

async function emailTemplates(template: string, receiver: string, locals: IEmailLocals): Promise<void> {
  try {
    const smtpTransport: Transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD
      },
      logger: true,
      debug: true
    });

    const email: Email = new Email({
      message: {
        from: ` Music <${config.SENDER_EMAIL}>`
      },
      send: true,
      preview: false,
      transport: smtpTransport,
      views: {
        options: {
          extension: 'ejs'
        }
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../build')
        }
      }
    });

    await email.send({
      template: path.join(__dirname, '..', 'src/emails', template),
      message: { to: receiver },
      locals
    });
  } catch (error) {
    log.error(error);
  }
}

export { emailTemplates };
