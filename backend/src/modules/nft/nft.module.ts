import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { NFT } from './nft.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NFT])],
  providers: [NftService],
  controllers: [NftController],
})
export class NftModule {}
