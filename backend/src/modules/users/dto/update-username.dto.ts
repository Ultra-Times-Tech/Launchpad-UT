import {IsNotEmpty, IsString} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger' // Assuming swagger is used based on package.json

export class UpdateUsernameDto {
  @ApiProperty({
    description: 'The new username for the user',
    example: 'newcooluser',
  })
  @IsNotEmpty()
  @IsString()
  username: string
}