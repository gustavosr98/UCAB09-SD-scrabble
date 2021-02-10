import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { User } from '@/entities';
import { EncryptionManagerService } from '@/encryption/encryption-manager.service';
import { ScrabbleException } from '@/common/exceptions/abstract.exception';
import { StatusErrorCodes } from '@/common/enums/status-error-codes.enum';
import { CrudRequest } from '@nestjsx/crud';
import { Status } from '@/common/enums/constants';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
    constructor(
        @InjectRepository(User) repo,
        private readonly encryptionManagerService: EncryptionManagerService,
    ) {
        super(repo);
    }

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

    public async getRanking(limit, page, username) {
        const ranking = await this.repo.query(
            `
            SELECT us.username as username, us.full_name as name, SUM(ug.total_points) as points, COUNT(CASE WHEN ug.total_points > 0 THEN 1 END) as victories,  COUNT(CASE WHEN ug.total_points = 0 THEN 1 END) as defeats
            FROM public.user us, game ga, user_game ug, status st
            WHERE st.name = 'FINISHED'
                AND st.id = ga.fk_status
                AND ga.id = ug.fk_game
                AND us.id = ug.fk_user
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
                    AND us.username LIKE '%'
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
