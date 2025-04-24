import {IsOptional, IsEmail, IsString, IsNumber, IsArray, ValidateNested} from 'class-validator'
import {ApiPropertyOptional} from '@nestjs/swagger'
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

export class UpdateUserDto {
  @ApiPropertyOptional({description: 'Full name of the user'})
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({description: 'Login username'})
  @IsOptional()
  @IsString()
  username?: string

  @ApiPropertyOptional({description: 'Email address'})
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({description: 'User block state (0: unblocked, 1: blocked)'})
  @IsOptional()
  @IsString()
  block?: string

  @ApiPropertyOptional({description: 'User password'})
  @IsOptional()
  @IsString()
  password?: string

  @ApiPropertyOptional({description: 'User password confirmation'})
  @IsOptional()
  @IsString()
  password2?: string

  @ApiPropertyOptional({description: 'User groups'})
  @IsOptional()
  @IsArray()
  @IsString({each: true})
  groups?: string[]

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

  @ApiPropertyOptional({description: 'Notification preferences'})
  @IsOptional()
  @IsArray()
  @IsString({each: true})
  sendnotif?: string[]

  @ApiPropertyOptional({description: 'Marketing communication preferences'})
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