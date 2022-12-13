import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/db/database.module';
import configurationFile from 'config';
@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      load: [configurationFile],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
