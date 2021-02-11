import { Injectable, UnauthorizedException, Inject, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UsersService } from '@/modules/user/users.service';
import { User } from '@/entities';
import { EncryptionManagerService } from '@/encryption/encryption-manager.service';
import { ScrabbleException } from '@/common/exceptions/abstract.exception';
import { StatusErrorCodes } from '@/common/enums/status-error-codes.enum';

@Injectable()
export class AuthService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly log: Logger,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly encryptionManagerService: EncryptionManagerService,
    ) {}

    private logMetadata = { context: AuthService.name };

    /**
     * Valida las credenciales del usuario para generar el token que permite el acceso a los URIs del backend
     * @param username string
     * @param pass string
     * @returns Promise<Partial<User>>
     */
    public async validateUser(username: string, pass: string): Promise<Partial<User>> {
        this.log.debug(
            `validateUser: gotten combination [username=${username}|pass=${
                pass ? '[Protected]' : 'undefined'
            }]`,
            this.logMetadata,
        );
        const user: User = await this.usersService.getUserByUsername(username);

        if (!user) {
            throw new ScrabbleException(
                'El usuario no se encuentra registrado en la aplicación',
                HttpStatus.BAD_REQUEST,
                StatusErrorCodes.USER_NOT_FOUND,
            );
        }

        this.log.debug(`validateUser: obtained user [id=${user.id}]`);

        const correctPassword: boolean = this.encryptionManagerService.comparePassword(
            pass,
            user.password,
            user.salt,
        );

        if (!correctPassword) {
            throw new ScrabbleException(
                'La combinación de correo electrónico y contraseña es incorrecta',
                HttpStatus.UNAUTHORIZED,
                StatusErrorCodes.INCORRECT_PASSWORD,
            );
        }

        const { password, salt, ...result } = user;
        return result;
    }

    /**
     * Genera el payload del token y lo firma de acuerdo a la configuración del módulo auth
     * @param user Partial<User>
     */
    public async login(
        user: Partial<User>,
    ): Promise<{ access_token: string; user: Partial<User> }> {
        this.log.debug(
            `login: generating token for [userId=${user.id}|username=${user.username}]`,
            this.logMetadata,
        );
        const payload = { id: user.id, username: user.username };
        return {
            access_token: this.jwtService.sign(payload),
            user: user,
        };
    }

    /**
     * Genera el token de acuerdo al payload enviado
     * @returns string
     */
    public generateToken(payload): string {
        return this.jwtService.sign(payload);
    }
}
