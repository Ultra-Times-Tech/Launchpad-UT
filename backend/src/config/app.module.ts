import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {AppDataSource} from '../ormconfig'
import {AuthModule} from '../modules/auth/auth.module'
import {CollectionsModule} from '../modules/collections/collections.module'
import { UsersModule } from '../modules/users/users.module'
import { UploadsModule } from '../modules/uploads/uploads.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ConfigModule } from '@nestjs/config'
import { join } from 'path'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(AppDataSource.options), 
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule, 
    CollectionsModule, 
    UsersModule,
    UploadsModule
  ],
})
export class AppModule {}