import {IsNotEmpty, IsEmail, IsString, IsNumber, IsOptional, IsArray, ValidateNested} from 'class-validator'
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger'
import {Type} from 'class-transformer'

class UserParams {
  @IsOptional()
  @IsString()
  admin_language?: string

  @IsOptional()
  @IsString()
  admin_style?: string

  @IsOptional()
  @IsString()
  editor?: string

  @IsOptional()
  @IsString()
  helpsite?: string

  @IsOptional()
  @IsString()
  language?: string

  @IsOptional()
  @IsString()
  timezone?: string
}

class WalletRow {
  @IsString()
  field1: string
}

export class CreateUserDto {
  @ApiProperty({description: 'Full name of the user'})
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({description: 'Login username'})
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty({description: 'Email address'})
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({description: 'User block state (0: unblocked, 1: blocked)'})
  @IsNotEmpty()
  @IsString()
  state: string

  @ApiProperty({description: 'User password'})
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiProperty({description: 'Confirmation password'})
  @IsNotEmpty()
  @IsString()
  password2: string

  @ApiProperty({description: 'User groups'})
  @IsArray()
  @IsString({each: true})
  groups: string[]

  @ApiPropertyOptional({description: 'Registration date'})
  @IsOptional()
  @IsString()
  registerDate?: string

  @ApiPropertyOptional({description: 'Require reset'})
  @IsOptional()
  @IsString()
  requireReset?: string

  @ApiPropertyOptional({description: 'Reset count'})
  @IsOptional()
  @IsString()
  resetCount?: string

  @ApiPropertyOptional({description: 'Send email'})
  @IsOptional()
  @IsString()
  sendEmail?: string

  @ApiPropertyOptional({description: 'Send notifications'})
  @IsOptional()
  @IsArray()
  @IsString({each: true})
  sendnotif?: string[]

  @ApiPropertyOptional({description: 'Send communications'})
  @IsOptional()
  @IsArray()
  @IsString({each: true})
  sendcomm?: string[]

  @ApiPropertyOptional({description: 'Additional user parameters'})
  @IsOptional()
  @ValidateNested()
  @Type(() => UserParams)
  params?: UserParams

  @ApiPropertyOptional({description: 'Phone number'})
  @IsOptional()
  @IsString()
  tphone?: string

  @ApiPropertyOptional({description: 'User wallets'})
  @IsOptional()
  wallets?: {[key: string]: WalletRow}
} 