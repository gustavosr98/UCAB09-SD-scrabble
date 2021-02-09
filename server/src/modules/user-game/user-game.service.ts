import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { UserGame } from '@/entities';

@Injectable()
export class UserGameService extends TypeOrmCrudService<UserGame> {
    constructor(@InjectRepository(UserGame) repo) {
        super(repo);
    }
}
