import { Injectable } from '@nestjs/common';

import { FloatRate } from '@app/rate/interfaces';
import { RateCacheService } from '@app/rate/services/rate-cache.service';
import { RateService } from '@app/rate/services/rate.service';

@Injectable()
export class RateHandler {
    constructor(private readonly rateService: RateService, private readonly rateCacheService: RateCacheService) {}

    public async getLastRatesWithFee(): Promise<FloatRate[]> {
        const cachedRates = await this.rateCacheService.getLastFloatRatesWithFee();

        if (!cachedRates?.length) {
            console.log('RateHandler: getLastRatesWithFee, error, cache is empty');

            return this.rateService.getLastFloatRatesWithFee();
        }

        return cachedRates;
    }
}
