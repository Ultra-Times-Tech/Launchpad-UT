import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ContactFormDto } from './dto/contact.dto';

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);
  private transporter: Mail;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('EMAIL_HOST');
    const port = this.configService.get<number>('EMAIL_PORT');
    const secure = this.configService.get<boolean>('EMAIL_SECURE');
    const user = this.configService.get<string>('EMAIL_SENDER');
    const pass = this.configService.get<string>('EMAIL_PASSWORD');

    if (!host || !port || secure === undefined || !user || !pass) {
      this.logger.error('Missing email configuration in environment variables');
      throw new Error('Missing email configuration');
    }

    const transportOptions: SMTPTransport.Options = {
      host: host,
      port: port,
      secure: secure,
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    };

    this.transporter = nodemailer.createTransport(transportOptions);

    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Error with email transporter configuration:', error);
      } else {
        this.logger.log('Email transporter configured successfully and ready to send emails.');
      }
    });
  }

  async sendWelcomeEmail(to: string, name: string = 'User') {
    const senderEmail = this.configService.get<string>('EMAIL_SENDER');
    const subject = 'Welcome to Our Newsletter!';
    const htmlBody =
      '<h1>Hi ' + name + ',</h1>' +
      '<p>Thank you for subscribing to the Ultra Times newsletter!</p>' +
      '<p>We\'re excited to have you on board.</p>' +
      '<p>Best regards,</p>' +
      '<p>The Ultra Times Team</p>';

    const mailOptions = {
      from: '"Ultra Times Newsletter" <' + senderEmail + '>',
      to: to,
      subject: subject,
      html: htmlBody,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log('Welcome email sent to ' + to + ': ' + info.messageId);
      return info;
    } catch (error) {
      this.logger.error('Error sending welcome email to ' + to + ': ', error);
      throw error;
    }
  }

  async sendNewSubscriberNotification(subscriberEmail: string) {
    const receiverEmail = this.configService.get<string>('EMAIL_RECEIVER');
    const senderEmail = this.configService.get<string>('EMAIL_SENDER');
    const subject = '🎉 New Newsletter Subscriber!';
    const htmlBody =
      '<h1>New Subscriber Alert!</h1>' +
      '<p>A new user has subscribed to the newsletter:</p>' +
      '<p><strong>Email:</strong> ' + subscriberEmail + '</p>' +
      '<p>Have a great day!</p>';

    if (!receiverEmail) {
        this.logger.error('EMAIL_RECEIVER is not set. Cannot send notification.');
        return;
    }

    const mailOptions = {
      from: '"Ultra Times System" <' + senderEmail + '>',
      to: receiverEmail,
      subject: subject,
      html: htmlBody,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log('New subscriber notification sent to ' + receiverEmail + ' for ' + subscriberEmail + ': ' + info.messageId);
      return info;
    } catch (error) {
      this.logger.error('Error sending new subscriber notification to ' + receiverEmail + ': ', error);
      throw error;
    }
  }

  async sendContactFormEmail(contactDto: ContactFormDto) {
    const receiverEmail = this.configService.get<string>('EMAIL_RECEIVER');
    const senderEmail = this.configService.get<string>('EMAIL_SENDER'); // Used for the 'from' field
    const subject = `New Contact Form Submission: ${contactDto.subject}`;
    
    // Sanitize inputs if necessary (though class-validator helps a lot)
    const name = contactDto.name;
    const email = contactDto.email;
    const message = contactDto.message;

    const htmlBody =
      '<h1>New Contact Form Submission</h1>' +
      '<p>You have received a new message from your website contact form:</p>' +
      '<ul>' +
      '  <li><strong>Name:</strong> ' + name + '</li>' +
      '  <li><strong>Email:</strong> ' + email + '</li>' +
      '  <li><strong>Subject:</strong> ' + contactDto.subject + '</li>' +
      '</ul>' +
      '<p><strong>Message:</strong></p>' +
      '<p>' + message.replace(/\n/g, '<br>') + '</p>' +
      '<hr>' +
      '<p>Please respond to ' + email + ' at your earliest convenience.</p>';

    if (!receiverEmail) {
      this.logger.error('EMAIL_RECEIVER is not set. Cannot send contact form email.');
      // Potentially throw an error here or handle it as per application requirements
      throw new Error('System error: Contact form recipient not configured.');
    }

    const mailOptions = {
      from: `"${name} (Ultra Times Contact)" <${senderEmail}>`,
      replyTo: email, // Set the sender's email as replyTo for easy response
      to: receiverEmail,
      subject: subject,
      html: htmlBody,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Contact form email sent to ${receiverEmail} from ${email}: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error(`Error sending contact form email to ${receiverEmail} from ${email}: `, error);
      throw error;
    }
  }

  async sendContactFormUserConfirmationEmail(contactDto: ContactFormDto) {
    const senderEmail = this.configService.get<string>('EMAIL_SENDER');
    const userEmail = contactDto.email;
    const userName = contactDto.name;

    const subject = 'Thank You for Your Message - Ultra Times';
    const htmlBody =
      `<h1>Dear ${userName},</h1>` +
      '<p>Thank you for contacting Ultra Times. We have received your message regarding: ' +
      `<strong>${contactDto.subject}</strong>.</p>` +
      '<p>Here is a copy of your message:</p>' +
      '<blockquote style="border-left: 2px solid #ccc; padding-left: 1em; margin-left: 1em; color: #555;">' +
      contactDto.message.replace(/\n/g, '<br>') +
      '</blockquote>' +
      '<p>Our team will review your inquiry and get back to you as soon as possible.</p>' +
      '<p>Best regards,</p>' +
      '<p>The Ultra Times Team</p>';

    const mailOptions = {
      from: `"Ultra Times Support" <${senderEmail}>`,
      to: userEmail,
      subject: subject,
      html: htmlBody,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Contact form confirmation email sent to ${userEmail}: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error(`Error sending contact form confirmation to ${userEmail}: `, error);
      // We might not want to throw an error here if the main admin email was sent successfully,
      // as the primary operation (notifying admin) succeeded.
      // Log the error and potentially monitor these failures.
      // For now, let's rethrow to be consistent, but this could be a business decision.
      throw error;
    }
  }
}