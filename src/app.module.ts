import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserModule } from './user/user.module';
import { join } from 'path';

export const Config = {
  envFilePath: ".env",
  isGlobal: true
}
export const IMPORT_MODULES = [
  UserModule,
  ConfigModule.forRoot(Config),
  MongooseModule.forRoot(process.env.DB_CONNECTION_URL),
  CommonModule,
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public/',
  }),
]

@Module({
  imports: IMPORT_MODULES,
  
})
export class AppModule {

}
