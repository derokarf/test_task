import { MigrationInterface, QueryRunner } from 'typeorm';

import { RateSettingsEntity } from '@app/rate/repositories/dao/rate-settings.entity';

const { tableName } = RateSettingsEntity;

export class RateSettingsFillTable1732878481900 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "${tableName}" ("symbol","enabled")
            VALUES 
                ('ETHUSDT', true),
                ('BTCUSDT', true);
        `);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async down(queryRunner: QueryRunner): Promise<void> {
        await Promise.resolve();
    }
}
