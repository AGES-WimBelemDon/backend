import { Module } from '@nestjs/common';
import { FrequencyConstroller } from './presentation/frequency.controller';
import { FrequencyService } from './application/frequency.service';
import { FREQUENCY_QUERIES_TOKEN } from './application/frequency.service.query.interfaces';
import { PrismaFrequencyQueryService } from './infrastructure/frequency.query.service.prisma';
import { FREQUENCY_REPOSITORY_TOKEN } from './domain/frequency.repository';
import { PrismaFrequencyRepository } from './infrastructure/frequency.repository';
@Module({
    controllers: [FrequencyConstroller],
    providers: [
        {
            provide: FREQUENCY_QUERIES_TOKEN,
            useClass: PrismaFrequencyQueryService
        },
        FrequencyService,
        {
            provide: FREQUENCY_REPOSITORY_TOKEN,
            useClass: PrismaFrequencyRepository
        }
    ],
    exports: [
        FREQUENCY_QUERIES_TOKEN,
        FrequencyService
    ],
})
export class FrequencyModule {}