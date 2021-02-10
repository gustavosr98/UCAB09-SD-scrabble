import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserGameController } from './user-game.controller';
import { UserGameService } from './user-game.service';
import { UserGame } from '@/entities';

@Module({
    imports: [TypeOrmModule.forFeature([UserGame])],
    providers: [UserGameService],
    controllers: [UserGameController],
    exports: [UserGameService],
})
export class UserGameModule {}
