import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '@/entities';
import { EncryptionModule } from '@/encryption/encryption.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), EncryptionModule],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
