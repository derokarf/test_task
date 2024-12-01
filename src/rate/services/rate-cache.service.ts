import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { CACHED_FLOAT_RATES_WITH_KEY } from '@app/rate/constants';
import { FloatRate } from '@app/rate/interfaces';

@Injectable()
export class RateCacheService {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}

    public async getLastFloatRatesWithFee(): Promise<FloatRate[]> {
        try {
            const data = (await this.cacheManager.get(CACHED_FLOAT_RATES_WITH_KEY)) as string;

            if (!data) {
                return [];
            }

            return JSON.parse(data) as FloatRate[];
        } catch (err) {
            console.log('RateCache: getLastRates, error', err);
            throw err;
        }
    }

    public updateLastRates(rates: FloatRate[]): Promise<void> {
        const data = JSON.stringify(rates);

        return this.cacheManager.set(CACHED_FLOAT_RATES_WITH_KEY, data);
    }
}
