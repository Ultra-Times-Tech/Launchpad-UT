import {IsOptional, IsNumber, IsString, IsIn} from 'class-validator'
import {ApiPropertyOptional} from '@nestjs/swagger'
import {Transform} from 'class-transformer'

export class CollectionFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter by publication state (0: unpublished, 1: published)',
    enum: [0, 1],
  })
  @IsOptional()
  @IsNumber()
  @Transform(({value}) => parseInt(value))
  published?: number

  @ApiPropertyOptional({
    description: 'Search by name or ID (prefix with "id:" to search by ID)',
    example: 'collection1 or id:65',
  })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({
    description: 'Field to order by',
    example: 'created',
  })
  @IsOptional()
  @IsString()
  ordering?: string

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  direction?: 'asc' | 'desc'
} 