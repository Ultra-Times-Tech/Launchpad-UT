import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../ormconfig';
import { NftModule } from '../modules/nft/nft.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    NftModule
  ],
})
export class AppModule {}