import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UpdateResult } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { User } from '@/entities';
import { EncryptionManagerService } from '@/encryption/encryption-manager.service';
import { ScrabbleException } from '@/common/exceptions/abstract.exception';
import { StatusErrorCodes } from '@/common/enums/status-error-codes.enum';
import { Status } from '@/common/enums/constants';


@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly log: Logger,
        @InjectRepository(User) repo,
        private readonly encryptionManagerService: EncryptionManagerService,
    ) {
        super(repo);
    }

    private logMetadata = { context: UsersService.name };

    /**
     * Obtiene el usuario dado el username
     * @param username string
     * @returns Promise<User>
     */
    public async getUserByUsername(username: string): Promise<User> {
        return await this.repo
            .createQueryBuilder('user')
            .addSelect('user.password')
            .addSelect('user.salt')
            .where(`user.username = '${username}'`)
            .andWhere(`user.status = ${Status.ACTIVE}`)
            .getOne();
    }

    /**
     * This method allows to create users in database according to the
     * given attributes, validating that the given username is not taken. 
     * Also, this method automatically generates the salt
     * in order to hash the password so it won't be saved as plain text.
     * @param user user object to store in database
     * @returns { Promise<User> }
     */
    public async create(user: User): Promise<User> {
        const salt: string = this.encryptionManagerService.generateSalt();
        user.salt = salt;

        if (user.password) {
            const psswd: string = this.encryptionManagerService.hashPassword(user.password, salt);
            user.password = psswd;
        }

        const userFound: User = await this.repo.findOne({ username: user.username });

        if (userFound) {
            throw new ScrabbleException(
                'El nombre de usuario ya se encuentra registrado en la aplicación',
                HttpStatus.BAD_REQUEST,
                StatusErrorCodes.USERNAME_TAKEN,
            );
        }

        const newUser: User = await this.repo.save(user);
        return newUser;
    }

    /**
     * This method allows to update user information.
     * @param user user information to update in database.
     * @returns { Promise<User> }
     */
    public async updateUser(user: User): Promise<User> {
        const userFound: User = await this.getUserByUsername(user.username);

        const psswd: string = this.encryptionManagerService.hashPassword(user.password, userFound.salt);
        user.password = psswd;

        return await this.repo.save(user);
    }

    public async getUserBestGame(id: number): Promise<{ totalPoints: number }>  {
        return await this.repo.query(`
            SELECT total_points as totalPoints
            FROM user_game
            WHERE fk_user = ${id}
            ORDER BY total_points DESC
            LIMIT 1;
        `)
    }

    public async getTotalAccumulatedPoints(id: number): Promise<{ totalAccumulatedPoints: number }> {
        return await this.repo.query(`
            SELECT SUM(total_points) as totalAccumulatedPoints
            FROM user_game
            WHERE fk_user = ${id};
        `);
    }

    public async getUserGamesWon(id: number): Promise<{ gamesWon: number }> {
        return await this.repo.query(`
            WITH games_history AS (
                SELECT fk_user, fk_game, total_points,
                    ROW_NUMBER () OVER (
                        PARTITION BY fk_game
                        ORDER BY
                            total_points DESC
                    ) as game_ranking
                FROM user_game
            )
            SELECT COUNT(*) as gamesWon
            FROM games_history
            WHERE fk_user = ${id}
                AND game_ranking = 1;
        `);
    }

    public async getUserGamesLost(id: number): Promise<{ gamesLost: number }> {
        return await this.repo.query(`
            WITH games_history AS (
                SELECT fk_user, fk_game, total_points,
                    ROW_NUMBER () OVER (
                        PARTITION BY fk_game
                        ORDER BY
                            total_points ASC
                    ) as game_ranking
                FROM user_game
            )
            SELECT COUNT(*) as gamesLost
            FROM games_history
            WHERE fk_user = ${id}
                AND game_ranking = 1;
        `);
    }

    public async getUserTotalGamesPlayed(id: number): Promise<{ totalGamesPlayed: number }> {
        return await this.repo.query(`
            SELECT COUNT(*) as totalGamesPlayed
            FROM user_game
            WHERE fk_user = ${id}
        `);
    }

    public async getUserRanking(id: number): Promise<{ ranking: number }> {
        return await this.repo.query(`
            WITH ranking AS (
                SELECT fk_user, SUM(total_points) as totalAccumulatedPoints,
                    ROW_NUMBER () OVER (
                        ORDER BY SUM(total_points) DESC
                    ) as ranking
                FROM user_game
                GROUP BY 1
                ORDER BY 2 DESC
            )
            SELECT ranking
            FROM ranking
            WHERE fk_user = ${id};
        `);
    }

    public async getUserStatistics(id: number): Promise<any> {
        this.log.debug(`getUserStatistics... [userId=${id}]`);

        const bestGame = await this.getUserBestGame(id);
        const totalAccumulatedPoints = await this.getTotalAccumulatedPoints(id);
        const gamesWon: { gamesWon: number } = await this.getUserGamesWon(id);
        const gamesLost: { gamesLost: number } = await this.getUserGamesLost(id);
        const totalGamesPlayed: { totalGamesPlayed: number } = await this.getUserTotalGamesPlayed(id);
        const ranking: { ranking: number } = await this.getUserRanking(id);

        return {
            bestGame,
            totalAccumulatedPoints,
            gamesWon,
            gamesLost,
            totalGamesPlayed,
            ranking,
        }
    }

    /**
     * This method allows to delete a user in database
     * @param userId user id of the user to delete
     * @returns { Promise<UpdateResult> }
     */
    public async deleteUser(userId: number): Promise<UpdateResult> {
        return await this.repo.update(userId, { status: { id: Status.DELETED } });
    }

    public async getRanking(limit, page, username) {
        const ranking = await this.repo.query(
            `
            SELECT us.username as username, us.full_name as name, SUM(ug.total_points) as points, COUNT(CASE WHEN ug.total_points > 0 THEN 1 END) as victories,  COUNT(CASE WHEN ug.total_points = 0 THEN 1 END) as defeats
            FROM public.user us, game ga, user_game ug, status st
            WHERE st.name = 'FINISHED'
                AND st.id = ga.fk_status
                AND ga.id = ug.fk_game
                AND us.id = ug.fk_user
                AND us.fk_status = ${Status.ACTIVE}
                AND LOWER(us.username) LIKE '${username.toLowerCase()}%'
            GROUP BY us.username, us.full_name
            ORDER BY SUM(ug.total_points) DESC
            LIMIT ${limit} OFFSET ${page};
            `
        );
        const count = await this.repo.query(
            `
            SELECT COUNT(*)
            FROM (
                SELECT us.username as username, us.full_name as name, SUM(ug.total_points) as ranking, COUNT(CASE WHEN ug.total_points > 0 THEN 1 END) as victories,  COUNT(CASE WHEN ug.total_points = 0 THEN 1 END) as defeats
                FROM public.user us, game ga, user_game ug, status st
                WHERE st.name = 'FINISHED'
                    AND st.id = ga.fk_status
                    AND ga.id = ug.fk_game
                    AND us.id = ug.fk_user
                    AND us.fk_status = ${Status.ACTIVE}
                GROUP BY us.username, us.full_name
                ORDER BY SUM(ug.total_points) DESC
            ) as ranking;
            `
        );
        return { ranking, count: Number(count[0].count) }
    }

    public async getGamesByUser(id) {
        const query = this.repo
            .createQueryBuilder('users')
            .innerJoinAndSelect('users.userGames', 'userGames')
            .innerJoinAndSelect('userGames.game', 'games')
            .innerJoinAndSelect('games.status', 'status')
            .andWhere(`games.status != ${Status.FINISHED}`)
            .andWhere(`users.id = ${id}`)

        return await query.getOne()
    }
}
