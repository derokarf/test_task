/* eslint-disable @typescript-eslint/no-floating-promises */

import { NestFactory } from '@nestjs/core';
import * as cacheManager from 'cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

import { AppModule } from '@app/app.module';
import { EnvModule } from '@app/env/env.module';
import { LocalEnvService } from '@app/env/local-env.service';

// noinspection JSUnusedGlobalSymbols
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function toJSON() {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return this.toString();
};

// eslint-disable-next-line jest/require-hook
(async () => {
    const localEnvProviderApp = await NestFactory.createMicroservice(EnvModule);
    const localEnvService = localEnvProviderApp.get(LocalEnvService);

    const redisCacheStore = await redisStore({
        url: process.env.REDIS_URL,
    });

    const redisCache = await cacheManager.caching(redisCacheStore);

    const app = await NestFactory.create(AppModule.forRoot(localEnvService, redisCache));

    await localEnvProviderApp.close();

    app.enableShutdownHooks();

    await app.listen(`${process.env.APP_PORT}`);
})();
