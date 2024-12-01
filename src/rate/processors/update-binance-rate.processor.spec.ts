import { Test } from '@nestjs/testing';

import { UpdateBinanceRateProcessor } from '@app/rate/processors/update-binance-rate.processor';
import { BinaceRateService } from '@app/rate/services/binance-rate.service';
import { RateCacheService } from '@app/rate/services/rate-cache.service';
import { RateSettingsService } from '@app/rate/services/rate-settings.service';
import { RateService } from '@app/rate/services/rate.service';
import { UtilsService } from '@app/utils/utils.service';

describe('updateBinanceRateProcessor', () => {
    let updateBinanceRateProcessor: UpdateBinanceRateProcessor;
    let binaceRateService: BinaceRateService;
    let rateCacheService: RateCacheService;
    let rateService: RateService;
    let rateSettingsService: RateSettingsService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UpdateBinanceRateProcessor,
                UtilsService,
                { provide: BinaceRateService, useValue: { getRates: jest.fn() } },
                { provide: RateCacheService, useValue: { updateLastRates: jest.fn() } },
                { provide: RateService, useValue: { addRates: jest.fn(), addFeeToRates: jest.fn(), getFloatRates: jest.fn() } },
                { provide: RateSettingsService, useValue: { getEnabledRateSettingsMapBySymbol: jest.fn() } },
            ],
        }).compile();

        updateBinanceRateProcessor = module.get(UpdateBinanceRateProcessor);
        binaceRateService = module.get(BinaceRateService);
        rateCacheService = module.get(RateCacheService);
        rateService = module.get(RateService);
        rateSettingsService = module.get(RateSettingsService);
    });

    describe('updateRates', () => {
        beforeEach(async () => {
            jest.useFakeTimers({
                now: Date.UTC(2020, 0, 1),
            });
            jest.spyOn(rateSettingsService, 'getEnabledRateSettingsMapBySymbol').mockResolvedValueOnce(
                new Map([['BTNUSDT', { enabled: true, symbol: 'BTNUSDT', id: 'id' }]]),
            );
            jest.spyOn(binaceRateService, 'getRates').mockResolvedValueOnce([
                {
                    symbol: 'BTNUSDT',
                    askPrice: '300',
                    askQty: '100',
                    bidPrice: '400',
                    bidQty: '200',
                },
            ]);
            jest.spyOn(rateService, 'addFeeToRates').mockReturnValueOnce([
                {
                    scaledAskPriceWithFee: 300n,
                    scaledBidPriceWithFee: 400n,
                    scaledMidPriceWithFee: 350n,
                    symbol: 'BTNUSDT',
                },
            ]);
            jest.spyOn(rateService, 'getFloatRates').mockReturnValueOnce([
                {
                    askPrice: '0.3',
                    bidPrice: '0.4',
                    midPrice: '0.35',
                    symbol: 'BTNUSDT',
                },
            ]);

            await updateBinanceRateProcessor.updateRates();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('must get rate settings', () => {
            expect(rateSettingsService.getEnabledRateSettingsMapBySymbol).toHaveBeenCalledTimes(1);
        });

        it('must get binance rates', () => {
            expect(binaceRateService.getRates).toHaveBeenCalledTimes(1);
            expect(binaceRateService.getRates).toHaveBeenCalledWith(['BTNUSDT']);
        });

        it('must save rates to db', () => {
            expect(rateService.addRates).toHaveBeenCalledTimes(1);
            expect(rateService.addRates).toHaveBeenCalledWith([
                {
                    rateSettings: { symbol: 'BTNUSDT', id: 'id' },
                    rateSettingsId: 'id',
                    receivedAt: new Date('2020-01-01'),
                    scaledAskPrice: 30000000000n,
                    scaledBidPrice: 40000000000n,
                },
            ]);
        });

        it('must recalc rates with fee', () => {
            expect(rateService.addFeeToRates).toHaveBeenCalledTimes(1);
            expect(rateService.addFeeToRates).toHaveBeenCalledWith([
                {
                    rateSettings: { symbol: 'BTNUSDT', id: 'id' },
                    rateSettingsId: 'id',
                    receivedAt: new Date('2020-01-01'),
                    scaledAskPrice: 30000000000n,
                    scaledBidPrice: 40000000000n,
                },
            ]);
        });

        it('must convert scaled rates to float', () => {
            expect(rateService.getFloatRates).toHaveBeenCalledTimes(1);
            expect(rateService.getFloatRates).toHaveBeenCalledWith([
                { scaledAskPriceWithFee: 300n, scaledBidPriceWithFee: 400n, scaledMidPriceWithFee: 350n, symbol: 'BTNUSDT' },
            ]);
        });

        it('must update rates in cache', () => {
            expect(rateCacheService.updateLastRates).toHaveBeenCalledTimes(1);
            expect(rateCacheService.updateLastRates).toHaveBeenCalledWith([
                { askPrice: '0.3', bidPrice: '0.4', midPrice: '0.35', symbol: 'BTNUSDT' },
            ]);
        });
    });
});
