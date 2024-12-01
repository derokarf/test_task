import { MigrationInterface, QueryRunner } from 'typeorm';

import { RateSettingsEntity } from '@app/rate/repositories/dao/rate-settings.entity';

const { tableName } = RateSettingsEntity;

export class RateSettingsCreateTable1732878481885 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "${tableName}" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "symbol" character varying NOT NULL,
                "enabled" boolean NOT NULL DEFAULT false,
                "created_at" timestamp NOT NULL DEFAULT now(),
                "updated_at" timestamp NOT NULL DEFAULT now(),
                CONSTRAINT "${tableName}_pk" PRIMARY KEY ("id")
            );

            CREATE INDEX "idx_${tableName}_enabled" ON "${tableName}" ("enabled");
            CREATE UNIQUE INDEX "idx_${tableName}_symbol" ON "${tableName}" ("symbol");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "${tableName}";
        `);
    }
}
