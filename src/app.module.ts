import { Module } from '@nestjs/common';
import { DbModule } from './modules/db/db.module';
import { Database } from './modules/db/database/database';
import { DatabaseModule } from './modules/db/database.module';

@Module({
  imports: [DbModule, DatabaseModule],
  controllers: [],
  providers: [Database],
})
export class AppModule {}
