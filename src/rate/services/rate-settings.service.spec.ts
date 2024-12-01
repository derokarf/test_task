import { Test } from '@nestjs/testing';

import { RateSettings } from '@app/rate/interfaces';
import { RateSettingsEntity } from '@app/rate/repositories/dao/rate-settings.entity';
import { RateSettingsRepository } from '@app/rate/repositories/rate-settings.repository';
import { RateSettingsService } from '@app/rate/services/rate-settings.service';

describe('rateSettingsService', () => {
    let rateSettingsService: RateSettingsService;
    let rateSettingsRepository: RateSettingsRepository;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RateSettingsService,
                {
                    provide: RateSettingsRepository,
                    useValue: {
                        getSettings: jest.fn(),
                    },
                },
            ],
        }).compile();

        rateSettingsService = module.get(RateSettingsService);
        rateSettingsRepository = module.get(RateSettingsRepository);
    });

    describe('getEnabledRatesSettings', () => {
        let result: RateSettings[];

        beforeEach(async () => {
            jest.spyOn(rateSettingsRepository, 'getSettings').mockResolvedValueOnce([
                {
                    id: 'id',
                    enabled: true,
                    symbol: 'BTNUSDT',
                } as RateSettingsEntity,
            ]);

            result = await rateSettingsService.getEnabledRatesSettings();
        });

        it('must get enabled settings by repository', () => {
            expect(rateSettingsRepository.getSettings).toHaveBeenCalledTimes(1);
            expect(rateSettingsRepository.getSettings).toHaveBeenCalledWith({ onlyEnabled: true });
        });

        it('result must contain rate settings', () => {
            expect(result).toStrictEqual([{ enabled: true, id: 'id', symbol: 'BTNUSDT' }]);
        });
    });

    describe('getEnabledRateSettingsMapBySymbol', () => {
        let result: Map<string, RateSettings>;

        beforeEach(async () => {
            jest.spyOn(rateSettingsService, 'getEnabledRatesSettings').mockResolvedValueOnce([
                {
                    id: 'id',
                    enabled: true,
                    symbol: 'BTNUSDT',
                } as RateSettings,
            ]);

            result = await rateSettingsService.getEnabledRateSettingsMapBySymbol();
        });

        it('must get enabled settings by repository', () => {
            expect(rateSettingsService.getEnabledRatesSettings).toHaveBeenCalledTimes(1);
            expect(rateSettingsService.getEnabledRatesSettings).toHaveBeenCalledWith();
        });

        it('result must contain map with rate settings', () => {
            expect(result).toStrictEqual(new Map([['BTNUSDT', { enabled: true, id: 'id', symbol: 'BTNUSDT' }]]));
        });
    });
});
