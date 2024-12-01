import { Test } from '@nestjs/testing';

import { LocalEnvService } from '@app/env/local-env.service';
import { FloatRate } from '@app/rate/interfaces';
import { RateEntity } from '@app/rate/repositories/dao/rate.entity';
import { RateRepository } from '@app/rate/repositories/rate.repository';
import { RateService } from '@app/rate/services/rate.service';
import { UtilsService } from '@app/utils/utils.service';

describe('rateService', () => {
    let rateService: RateService;
    let rateRepository: RateRepository;
    let localEnvService: LocalEnvService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RateService,
                UtilsService,
                {
                    provide: RateRepository,
                    useValue: {
                        getLastRates: jest.fn(),
                        addRates: jest.fn(),
                    },
                },
                {
                    provide: LocalEnvService,
                    useValue: { getFee: jest.fn() },
                },
            ],
        }).compile();

        rateService = module.get(RateService);
        rateRepository = module.get(RateRepository);
        localEnvService = module.get(LocalEnvService);
    });

    describe('getLastFloatRatesWithFee', () => {
        let result: FloatRate[];

        beforeEach(async () => {
            jest.spyOn(rateRepository, 'getLastRates').mockResolvedValueOnce([
                {
                    rateSettingsId: 'rateSettingsId',
                    scaledAskPrice: 40508000000n,
                    scaledBidPrice: 40705000000n,
                    rateSettings: {
                        symbol: 'BTNUSDT',
                    },
                } as RateEntity,
            ]);
            jest.spyOn(localEnvService, 'getFee').mockReturnValueOnce('0.01');

            result = await rateService.getLastFloatRatesWithFee();
        });

        it('must get source rates by repository', () => {
            expect(rateRepository.getLastRates).toHaveBeenCalledTimes(1);
            expect(rateRepository.getLastRates).toHaveBeenCalledWith({ onlyEnabled: true });
        });

        it('must return rates with fee', () => {
            expect(result).toStrictEqual([
                { askPrice: '409.1308', bidPrice: '411.1205', midPrice: '406.065', symbol: 'BTNUSDT' },
            ]);
        });
    });
});
