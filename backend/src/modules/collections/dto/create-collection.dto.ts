import {IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean} from 'class-validator'
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger'

export class CreateCollectionDto {
  @ApiProperty({
    description: 'Collection name',
    example: 'My Collection',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'Collection alias (URL-friendly name)',
    example: 'my-collection',
  })
  @IsString()
  @IsNotEmpty()
  alias: string

  @ApiProperty({
    description: 'Collection state (0: unpublished, 1: published)',
    example: '0',
  })
  @IsString()
  @IsNotEmpty()
  state: string

  @ApiPropertyOptional({
    description: 'Collection image path',
    example: '/images/launchpad/collections/1/image.png',
  })
  @IsString()
  @IsOptional()
  image?: string

  @ApiPropertyOptional({
    description: 'Is the collection trending',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_trending?: boolean

  @ApiPropertyOptional({
    description: 'Is the collection featured',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_featured?: boolean

  @ApiPropertyOptional({
    description: 'Collection ordering number',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  ordering?: number
} 