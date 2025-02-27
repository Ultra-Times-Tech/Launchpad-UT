import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftController } from 'src/modules/nft/nft.controller';
import { NftService } from 'src/modules/nft/nft.service';
import { AppDataSource } from 'src/ormconfig';
import { NFTEntity } from 'src/modules/nft/nft.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    NFTEntity
  ],
  controllers: [NftController],
  providers: [NftService],
})
export class AppModule {}