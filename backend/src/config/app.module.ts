import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {AppDataSource} from '../ormconfig'
import {NftModule} from '../modules/nft/nft.module'
import {AuthModule} from '../modules/auth/auth.module'
import {CollectionsModule} from '../modules/collections/collections.module'

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options), NftModule, AuthModule, CollectionsModule],
})
export class AppModule {}