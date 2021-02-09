import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EncryptionModule } from '../encryption/encryption.module';
import { ConfigService } from '@/config/config.service';

import { UsersModule } from '@/modules/user/users.module';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('TOKEN_SECRET'),
                signOptions: {
                    expiresIn: configService.get('TOKEN_EXPIRATION_TIME'),
                },
            }),
            inject: [ConfigService],
        }),
        EncryptionModule,
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
