import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Game } from '@/entities';

@Injectable()
export class GamesService extends TypeOrmCrudService<Game> {
    constructor(@InjectRepository(Game) repo) {
        super(repo);
    }
}
