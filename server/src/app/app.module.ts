import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { indexModules } from '../modules/indexModule'

// CONFIGURATION
import configuration from '@/configuration';

// LOGGER
import { WinstonModule } from 'nest-winston';
import createOptions from '@/logger/winston';

// MODULES
import { DatabaseModule } from '@/database/database.module';

// CONTROLLERS
import { AppController } from '@/app/app.controller';

// SERVICES
import { AppService } from '@/app/app.service';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    ...indexModules,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
    }),
    AuthModule,
    DatabaseModule,
    WinstonModule.forRoot(createOptions({ fileName: 'main' })),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
