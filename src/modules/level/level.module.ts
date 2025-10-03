import { Module } from '@nestjs/common';
import { LEVEL_REPOSITORY_TOKEN } from './domain/level.repository.interface';
import { PrismaLevelRepository } from './infrastructure/level.repository';
import { LevelService } from './application/level.service';
@Module({
    providers: [
        {
            provide: LEVEL_REPOSITORY_TOKEN,
            useClass: PrismaLevelRepository
        },
        LevelService
    ],
    exports: [
        LevelService
    ],
})
export class FrequencyModule {}