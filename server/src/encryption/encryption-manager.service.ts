import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto-js';

@Injectable()
export class EncryptionManagerService {
    /**
     * iterations
     */
    protected iterations: number = 1000;

    /**
     * keyLength
     */
    protected keyLength: number = 64;

    /**
     * digestAlgorithm
     */
    protected digestAlgorithm: string = 'sha512';

    /**
     * Genera la sal correspondiente para el hash de la contraseña
     * @returns string
     */
    public generateSalt(): string {
        const salt: string = crypto.lib.WordArray.random(128 / 8);
        return salt.toString();
    }

    /**
     * Genera el hash de la contraseña del usuario
     * @param pass string
     * @param salt string
     * @returns string
     */
    public hashPassword(pass: string, salt: string): string {
        const psswdHash: string = crypto.PBKDF2(pass, salt, {
            hasher: crypto.algo.SHA512,
            keySize: 512 / 8,
            iterations: this.iterations,
        });
        return psswdHash.toString();
    }

    /**
     * Compara la contraseña almacenada con la introducida por el usuario
     * @param pass string
     * @param storedPass string
     * @param salt string
     * @returns boolean
     */
    public comparePassword(pass: string, storedPass: string, salt: string): boolean {
        const userHash: string = this.hashPassword(pass, salt);
        return userHash === storedPass;
    }
}
