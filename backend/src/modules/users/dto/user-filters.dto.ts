import {IsOptional, IsNumber, IsString} from 'class-validator'
import {ApiPropertyOptional} from '@nestjs/swagger'
import {Transform} from 'class-transformer'

export class UserFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter by block state (0: unblocked, 1: blocked)',
    enum: [0, 1],
  })
  @IsOptional()
  @IsNumber()
  @Transform(({value}) => parseInt(value))
  state?: number

  @ApiPropertyOptional({
    description: 'Search by name, username, email or ID (prefix with "id:" to search by ID, "wid:" to search by wallet ID)',
    example: 'John or id:266 or wid:1aa2aa3aa4ab',
  })
  @IsOptional()
  @IsString()
  search?: string
} 