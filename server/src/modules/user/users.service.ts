import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { User } from '@/entities';
import { EncryptionManagerService } from '@/encryption/encryption-manager.service';

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

    public async create(user: User) {
        const salt: string = this.encryptionManagerService.generateSalt();
        user.salt = salt;

        if (user.password) {
            const psswd: string = this.encryptionManagerService.hashPassword(user.password, salt);
            user.password = psswd;
        }
        const newUser: User = await this.repo.save(user);
        return newUser;
    }
}
