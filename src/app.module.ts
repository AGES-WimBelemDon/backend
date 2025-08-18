import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ExampleEntityModule } from './modules/exampleEntity/exampleEntity.module';

@Module({
  imports: [
    AuthModule,
    ExampleEntityModule,
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      isGlobal: true
    })
  ],
})
export class AppModule {}
