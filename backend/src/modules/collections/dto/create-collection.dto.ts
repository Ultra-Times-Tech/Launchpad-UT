import {IsString, IsNotEmpty} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'

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
} 