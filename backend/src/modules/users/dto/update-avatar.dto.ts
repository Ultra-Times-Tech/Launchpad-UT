import {IsNotEmpty, IsString} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'

export class UpdateAvatarDto {
  @ApiProperty({
    description: "The NFT ID (Uniq ID) to set as the user's avatar",
    example: '4000',
  })
  @IsNotEmpty()
  @IsString()
  nftId: string
}
