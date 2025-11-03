import { Provider, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { ALL_ROLES } from 'src/common/enums/roles.enum';

export const DEV_CONFIG = 'DEV_CONFIG';

export type DevConfigType = {
  enabled: boolean;
  role: Role;
};

const devConfigProvider: Provider = {
  provide: DEV_CONFIG,
  useFactory: (configService: ConfigService): DevConfigType => {
    const configRole = configService.get<string>('DEV_ROLE');
    const role = ALL_ROLES.includes(configRole as typeof ALL_ROLES[number])
      ? (configRole as typeof ALL_ROLES[number])
      : Role.teacher;
    
    const enabled = configService.get<string>('DEV_ROLE_OVERRIDE') === 'true';

    return { enabled, role };
  },
  inject: [ConfigService],
};

@Module({
  providers: [devConfigProvider],
  exports: [devConfigProvider],
})
export class DevConfigModule {}
