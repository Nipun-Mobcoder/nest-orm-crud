import { Module } from '@nestjs/common';

import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './modules/roles/roles.module';
import { ProductsModule } from './modules/products/products.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule,
    UsersModule,
    RolesModule,
    DatabaseModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
