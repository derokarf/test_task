import { Test } from '@nestjs/testing';

import { FloatRate } from '@app/rate/interfaces';
import { RateHandler } from '@app/rate/rate.handler';
import { RateCacheService } from '@app/rate/services/rate-cache.service';
import { RateService } from '@app/rate/services/rate.service';

describe('rateHandler', () => {
    let rateService: RateService;
    let rateCacheService: RateCacheService;
    let rateHandler: RateHandler;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RateHandler,
                { provide: RateService, useValue: { getLastFloatRatesWithFee: jest.fn() } },
                { provide: RateCacheService, useValue: { getLastFloatRatesWithFee: jest.fn() } },
            ],
        }).compile();

        rateService = module.get(RateService);
        rateCacheService = module.get(RateCacheService);
        rateHandler = module.get(RateHandler);
    });

    describe('getLastEnabledRatesWithFee', () => {
        describe('when cache is not empty', () => {
            let result: FloatRate[];

            beforeEach(async () => {
                jest.spyOn(rateCacheService, 'getLastFloatRatesWithFee').mockResolvedValueOnce([
                    {
                        askPrice: '1',
                        bidPrice: '3',
                        midPrice: '2',
                        symbol: 'BTNUSDT',
                    },
                ]);

                result = await rateHandler.getLastRatesWithFee();
            });

            it('must get last rates by cache service', () => {
                expect(rateCacheService.getLastFloatRatesWithFee).toHaveBeenCalledTimes(1);
            });

            it('must not call service method', () => {
                expect(rateService.getLastFloatRatesWithFee).toHaveBeenCalledTimes(0);
            });

            it('result must contain rates', () => {
                expect(result).toStrictEqual([
                    {
                        askPrice: '1',
                        bidPrice: '3',
                        midPrice: '2',
                        symbol: 'BTNUSDT',
                    },
                ]);
            });
        });

        describe('when cache is empty', () => {
            let result: FloatRate[];

            beforeEach(async () => {
                jest.spyOn(rateService, 'getLastFloatRatesWithFee').mockResolvedValueOnce([
                    {
                        askPrice: '1',
                        bidPrice: '3',
                        midPrice: '2',
                        symbol: 'BTNUSDT',
                    },
                ]);

                result = await rateHandler.getLastRatesWithFee();
            });

            it('must try to get last rates by cache service', () => {
                expect(rateCacheService.getLastFloatRatesWithFee).toHaveBeenCalledTimes(1);
            });

            it('must call service method', () => {
                expect(rateService.getLastFloatRatesWithFee).toHaveBeenCalledTimes(1);
            });

            it('result must contain rates', () => {
                expect(result).toStrictEqual([
                    {
                        askPrice: '1',
                        bidPrice: '3',
                        midPrice: '2',
                        symbol: 'BTNUSDT',
                    },
                ]);
            });
        });
    });
});
