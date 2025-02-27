import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from 'src/ormconfig';
import { NftModule } from 'src/modules/nft/nft.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    NftModule
  ],
})
export class AppModule {}