import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Game } from '@/entities';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Status } from '@/common/enums/constants';

@Injectable()
export class GamesService extends TypeOrmCrudService<Game> {
    constructor(
        @InjectRepository(Game) repo,
        @InjectRepository(Game)
        private readonly gamesRepository: Repository<Game>,
    ) {
        super(repo);
    }

    public async getGames({ limit, start }): Promise<{ data: Game[]; count: number }> {
        start = limit * (start - 1);
        const query: SelectQueryBuilder<Game> = this.gamesRepository
            .createQueryBuilder('games')
            .innerJoinAndSelect('games.userGames', 'userGames')
            .innerJoinAndSelect('userGames.user', 'users')
            .innerJoinAndSelect('games.status', 'status')
            .andWhere(`games.status = ${Status.CREATED}`)
            .skip(start)
            .take(limit);
        
        const games: [Game[], number] = await query.getManyAndCount();
        return {
            data: games[0],
            count: games[1],
        }
    }
}
