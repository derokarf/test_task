import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test } from '@nestjs/testing';
import { Cache } from 'cache-manager';

import { FloatRate } from '@app/rate/interfaces';
import { RateCacheService } from '@app/rate/services/rate-cache.service';

describe('rateCacheService', () => {
    let rateCacheService: RateCacheService;
    let cache: Cache;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RateCacheService,
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        set: jest.fn(),
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        rateCacheService = module.get(RateCacheService);
        cache = module.get(CACHE_MANAGER);
    });

    describe('getLastRates', () => {
        let result: FloatRate[];

        beforeEach(async () => {
            jest.spyOn(cache, 'get').mockResolvedValueOnce(
                '[{"symbol":"BTN","scaledBidPriceWithFee":10,"scaledAskPriceWithFee":20,"scaledMidPriceWithFee":15}]',
            );

            result = await rateCacheService.getLastFloatRatesWithFee();
        });

        it('must get rates from cache', () => {
            expect(cache.get).toHaveBeenCalledTimes(1);
            expect(cache.get).toHaveBeenCalledWith('cache:rates');
        });

        it('result must be rates', () => {
            expect(result).toStrictEqual([
                {
                    scaledAskPriceWithFee: 20,
                    scaledBidPriceWithFee: 10,
                    scaledMidPriceWithFee: 15,
                    symbol: 'BTN',
                },
            ]);
        });
    });
});
