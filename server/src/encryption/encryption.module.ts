import { Module } from '@nestjs/common';
import { EncryptionManagerService } from './encryption-manager.service';

@Module({
    providers: [EncryptionManagerService],
    exports: [EncryptionManagerService],
})
export class EncryptionModule {}
