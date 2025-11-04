import { Module } from '@nestjs/common';
import { FiltersController } from './presentation/filters.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [PrismaModule, FirebaseModule],
  controllers: [FiltersController],
})
export class FiltersModule {}
