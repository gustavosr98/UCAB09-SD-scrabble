import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { User } from '@/entities';
import { EncryptionManagerService } from '@/encryption/encryption-manager.service';
import { ScrabbleException } from '@/common/exceptions/abstract.exception';
import { StatusErrorCodes } from '@/common/enums/status-error-codes.enum';

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
}
