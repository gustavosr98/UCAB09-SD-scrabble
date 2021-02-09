import { Module } from '@nestjs/common';
import { databaseProviders } from '@/database/services/database.service';

@Module({
  imports: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
