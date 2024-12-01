import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TYPEORM_TEST_CONFIG } from '@app/ormconfig.test';
import { RateSettingsEntity } from '@app/rate/repositories/dao/rate-settings.entity';
import { RateSettingsRepository } from '@app/rate/repositories/rate-settings.repository';

describe('rateSettingsRepository', () => {
    let module: TestingModule;
    let rawRepository: Repository<RateSettingsEntity>;
    let rateSettingsRepository: RateSettingsRepository;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [TypeOrmModule.forRoot(TYPEORM_TEST_CONFIG), TypeOrmModule.forFeature([RateSettingsEntity])],
            providers: [RateSettingsRepository],
        }).compile();

        rawRepository = module.get(getRepositoryToken(RateSettingsEntity));
        rateSettingsRepository = module.get(RateSettingsRepository);
    });

    afterAll(async () => {
        await module.close('SIGKILL');
    });

    const truncateData = async (): Promise<void> => {
        await rawRepository.query(`TRUNCATE "${RateSettingsEntity.tableName}" CASCADE`);
    };

    describe('getSettings', () => {
        let result: RateSettingsEntity[];

        beforeAll(async () => {
            await truncateData();

            await rawRepository.save([
                {
                    id: '6c6a1d95-822d-4059-90a1-00cbf32d1458',
                    symbol: 'USDTBTN',
                    enabled: false,
                },
                {
                    id: '6c6a1d95-822d-4059-90a1-00cbf32d1000',
                    symbol: 'BTNUSDT',
                    enabled: true,
                },
            ]);

            result = await rateSettingsRepository.getSettings({ onlyEnabled: true });
        });

        it('result must contain only enabled rate settings', () => {
            expect(result).toMatchObject([
                {
                    id: '6c6a1d95-822d-4059-90a1-00cbf32d1000',
                    symbol: 'BTNUSDT',
                    enabled: true,
                },
            ]);
        });
    });
});
