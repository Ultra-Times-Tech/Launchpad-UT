import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SubscribeDto } from './dto/subscribe.dto';
import { ContactFormDto } from './dto/contact.dto';


@ApiTags('Emails')
@Controller('emails')
export class EmailsController {
  private readonly logger = new Logger(EmailsController.name);

  constructor(private readonly emailsService: EmailsService) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Subscribe a user to the newsletter' })
  @ApiResponse({ status: 200, description: 'Successfully subscribed to the newsletter.' })
  @ApiResponse({ status: 400, description: 'Invalid email provided.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async subscribeToNewsletter(@Body() subscribeDto: SubscribeDto) {
    this.logger.log(`New newsletter subscription attempt for: ${subscribeDto.email}`);
    try {
      await this.emailsService.sendWelcomeEmail(subscribeDto.email);
      await this.emailsService.sendNewSubscriberNotification(subscribeDto.email);
      this.logger.log(`Successfully sent emails for ${subscribeDto.email}`);
      return { message: 'Successfully subscribed! Welcome email and notification sent.' };
    } catch (error) {
      this.logger.error(`Failed to send emails for ${subscribeDto.email}:`, error);
      throw error;
    }
  }

  @Post('contact')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit a contact form' })
  @ApiBody({ type: ContactFormDto })
  @ApiResponse({ status: 200, description: 'Contact form submitted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data provided for contact form.' })
  @ApiResponse({ status: 500, description: 'Internal server error while processing contact form.' })
  async submitContactForm(@Body() contactDto: ContactFormDto) {
    this.logger.log(`New contact form submission from: ${contactDto.email} with subject: ${contactDto.subject}`);
    try {
      await this.emailsService.sendContactFormEmail(contactDto);
      await this.emailsService.sendContactFormUserConfirmationEmail(contactDto);
      this.logger.log(`Successfully processed contact form for ${contactDto.email} and sent confirmation.`);
      return { message: 'Contact form submitted successfully. We will get back to you soon and a confirmation has been sent to your email.' };
    } catch (error) {
      this.logger.error(`Failed to process contact form or send confirmation for ${contactDto.email}:`, error);
      throw error;
    }
  }
} 