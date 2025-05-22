import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SubscribeDto {
  @ApiProperty({ description: 'User email for newsletter subscription', example: 'test@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
} 