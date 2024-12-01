import { Test } from '@nestjs/testing';

import { LocalEnvService } from '@app/env/local-env.service';
import { BinaceRateService, BinanceRate } from '@app/rate/services/binance-rate.service';

const mockedFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
    json: () =>
        Promise.resolve([
            {
                symbol: 'BTNUSDT',
                bidPrice: '40.30',
                bidQty: '30.99',
                askPrice: '10.03',
                askQty: '10.01',
            },
        ]),
} as Response);

describe('binaceRateService', () => {
    let binaceRateService: BinaceRateService;
    let localEnvService: LocalEnvService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                BinaceRateService,
                {
                    provide: LocalEnvService,
                    useValue: {
                        getBinanceApiUrl: jest.fn(),
                    },
                },
            ],
        }).compile();

        binaceRateService = module.get(BinaceRateService);
        localEnvService = module.get(LocalEnvService);
    });

    describe('getRates', () => {
        let result: BinanceRate[];

        beforeEach(async () => {
            jest.spyOn(localEnvService, 'getBinanceApiUrl').mockReturnValueOnce('api.test');

            result = await binaceRateService.getRates(['BNTUSDT', 'USDTBNT']);
        });

        it('must get url from envs', () => {
            expect(localEnvService.getBinanceApiUrl).toHaveBeenCalledTimes(1);
        });

        it('must get binance rates by fetch', () => {
            expect(mockedFetch).toHaveBeenCalledTimes(1);
            expect(mockedFetch).toHaveBeenCalledWith('api.test/ticker/bookTicker?symbols=%5B%22BNTUSDT%22%2C%22USDTBNT%22%5D', {
                method: 'GET',
            });
        });

        it('result must contains rates', () => {
            expect(result).toStrictEqual([
                {
                    symbol: 'BTNUSDT',
                    bidPrice: '40.30',
                    bidQty: '30.99',
                    askPrice: '10.03',
                    askQty: '10.01',
                },
            ]);
        });
    });
});
