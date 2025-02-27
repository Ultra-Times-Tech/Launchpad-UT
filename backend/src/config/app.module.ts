import { Module } from '@nestjs/common';
import { NftController } from 'src/modules/nft/nft.controller';
import { NftService } from 'src/modules/nft/nft.service';
import { NftModule } from 'src/modules/nft/nft.module';

@Module({
  imports: [NftModule],
  controllers: [NftController],
  providers: [NftService],
})
export class AppModule {}
