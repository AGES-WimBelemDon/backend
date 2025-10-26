import { Module } from '@nestjs/common';
import { FiltersController } from './presentation/filters.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FiltersController],
})
export class FiltersModule {}
