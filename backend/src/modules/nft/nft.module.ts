import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { NFTEntity } from './nft.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NFTEntity])],
  providers: [NftService],
  controllers: [NftController],
})
export class NftModule {}
