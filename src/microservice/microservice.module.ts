import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'Redis_Client',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            port: parseInt(configService.getOrThrow('REDIS_PORT')),
            host: configService.getOrThrow('REDIS_HOST'),
            password: configService.getOrThrow('REDIS_PASSWORD'),
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MicroServiceModule {}
