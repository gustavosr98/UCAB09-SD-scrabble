import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { Status } from '@/entities';

@Module({
    imports: [TypeOrmModule.forFeature([Status])],
    providers: [StatusService],
    controllers: [StatusController],
    exports: [StatusService],
})
export class StatusModule {}
