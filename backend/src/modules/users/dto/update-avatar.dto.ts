import {IsNotEmpty, IsString} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'

export class UpdateAvatarDto {
  @ApiProperty({
    description: "The UNIQ ID to set as the user's avatar",
    example: '4000',
  })
  @IsNotEmpty()
  @IsString()
  uniqId: string
}
