import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftController } from 'src/modules/nft/nft.controller';
import { NftService } from 'src/modules/nft/nft.service';
import { NftModule } from 'src/modules/nft/nft.module';
import { AppDataSource } from 'src/ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    NftModule
  ],
  controllers: [NftController],
  providers: [NftService],
})
export class AppModule {}