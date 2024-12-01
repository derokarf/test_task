import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { EnvModule } from '@app/env/env.module';
import { LocalEnvService } from '@app/env/local-env.service';
import { RateModule } from '@app/rate/rate.module';

@Module({})
export class AppModule {
    public static forRoot(localEnvService: LocalEnvService, redisCacheStore: Cache): DynamicModule {
        return {
            module: AppModule,
            imports: [
                EnvModule,
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: process.env.DB_HOST,
                    port: Number(process.env.DB_PORT),
                    username: process.env.DB_USER,
                    password: process.env.DB_PASSWD,
                    database: process.env.DB_NAME,
                    entities: ['./*/repositories/dao/*'],
                    autoLoadEntities: false,
                    namingStrategy: new SnakeNamingStrategy(),
                    migrations: ['./**/migrations/*'],
                    ssl: undefined,
                }),
                CacheModule.register({
                    store: redisCacheStore,
                    url: process.env.REDIS_URL,
                    isGlobal: true,
                }),
                BullModule.forRoot({
                    url: process.env.REDIS_URL,
                }),
                RateModule,
            ],
        };
    }
}
