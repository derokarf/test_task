import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TYPEORM_TEST_CONFIG } from '@app/ormconfig.test';
import { RateSettingsEntity } from '@app/rate/repositories/dao/rate-settings.entity';
import { RateEntity } from '@app/rate/repositories/dao/rate.entity';
import { RateRepository } from '@app/rate/repositories/rate.repository';

declare global {
    interface BigInt {
        toJSON(): string;
    }
}

// eslint-disable-next-line no-extend-native, func-names
BigInt.prototype.toJSON = function () {
    return String(this);
};

describe('rateRepository', () => {
    let module: TestingModule;
    let rawRateRepository: Repository<RateEntity>;
    let rawRateSettingsRepository: Repository<RateSettingsEntity>;
    let rateRepository: RateRepository;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [TypeOrmModule.forRoot(TYPEORM_TEST_CONFIG), TypeOrmModule.forFeature([RateEntity, RateSettingsEntity])],
            providers: [RateRepository],
        }).compile();

        rawRateRepository = module.get(getRepositoryToken(RateEntity));
        rateRepository = module.get(RateRepository);
        rawRateSettingsRepository = module.get(getRepositoryToken(RateSettingsEntity));
    });

    afterAll(async () => {
        await module.close('SIGKILL');
    });

    const truncateData = async (): Promise<void> => {
        await rawRateRepository.query(`TRUNCATE "${RateEntity.tableName}" CASCADE`);
        await rawRateRepository.query(`TRUNCATE "${RateSettingsEntity.tableName}" CASCADE`);
    };

    describe('addRates', () => {
        beforeAll(async () => {
            await truncateData();

            await rawRateSettingsRepository.save([
                {
                    id: '6c6a1d95-822d-4059-90a1-00cbf32d1458',
                    symbol: 'USDTBTN',
                    enabled: false,
                },
            ]);

            await rateRepository.addRates([
                {
                    rateSettingsId: '6c6a1d95-822d-4059-90a1-00cbf32d1458',
                    scaledAskPrice: 1000n,
                    scaledBidPrice: 2000n,
                    receivedAt: new Date('2020-01-01'),
                },
            ]);
        });

        it('result must contain added rates', async () => {
            const result = await rawRateRepository.find({});

            expect(result).toHaveLength(1);
            expect(result).toMatchObject([
                {
                    rateSettingsId: '6c6a1d95-822d-4059-90a1-00cbf32d1458',
                    receivedAt: new Date('2020-01-01'),
                    scaledAskPrice: 1000n,
                    scaledBidPrice: 2000n,
                },
            ]);
        });
    });

    describe('getLastRates', () => {
        beforeAll(async () => {
            await truncateData();

            await rawRateSettingsRepository.save([
                {
                    id: '6c6a1d95-822d-4059-90a1-00cbf32d1458',
                    symbol: 'USDTBTN',
                    enabled: true,
                },
                {
                    id: '6c6a1d95-822d-4059-90a1-00cbf32d1001',
                    symbol: 'USDTETH',
                    enabled: false,
                },
                {
                    id: '6c6a1d95-822d-4059-90a1-00cbf32d1000',
                    symbol: 'USDTCC',
                    enabled: true,
                },
            ]);

            await rawRateRepository.save([
                {
                    id: '57d5d33e-fedd-4812-a9c4-a98be2aba245',
                    rateSettingsId: '6c6a1d95-822d-4059-90a1-00cbf32d1458',
                    scaledAskPrice: 10n,
                    scaledBidPrice: 20n,
                    receivedAt: new Date('2020-02-01'),
                },
                {
                    id: '57d5d33e-fedd-4812-a9c4-a98be2aba246',
                    rateSettingsId: '6c6a1d95-822d-4059-90a1-00cbf32d1001',
                    scaledAskPrice: 33n,
                    scaledBidPrice: 44n,
                    receivedAt: new Date('2020-02-01'),
                },
                {
                    id: '57d5d33e-fedd-4812-a9c4-a98be2aba247',
                    rateSettingsId: '6c6a1d95-822d-4059-90a1-00cbf32d1000',
                    scaledAskPrice: 11n,
                    scaledBidPrice: 22n,
                    receivedAt: new Date('2020-02-01'),
                },
                {
                    id: '57d5d33e-fedd-4812-a9c4-a98be2aba248',
                    rateSettingsId: '6c6a1d95-822d-4059-90a1-00cbf32d1458',
                    scaledAskPrice: 55n,
                    scaledBidPrice: 77n,
                    receivedAt: new Date('2020-01-01'),
                },
            ]);
        });

        it('result must contain added rates', async () => {
            const result = await rateRepository.getLastRates({ onlyEnabled: true });

            expect(result).toHaveLength(2);
            expect(result).toMatchObject([
                {
                    id: '57d5d33e-fedd-4812-a9c4-a98be2aba245',
                    rateSettingsId: '6c6a1d95-822d-4059-90a1-00cbf32d1458',
                    receivedAt: new Date('2020-02-01'),
                    scaledAskPrice: 10n,
                    scaledBidPrice: 20n,
                },
                {
                    id: '57d5d33e-fedd-4812-a9c4-a98be2aba247',
                    rateSettingsId: '6c6a1d95-822d-4059-90a1-00cbf32d1000',
                    receivedAt: new Date('2020-02-01'),
                    scaledAskPrice: 11n,
                    scaledBidPrice: 22n,
                },
            ]);
        });
    });
});
