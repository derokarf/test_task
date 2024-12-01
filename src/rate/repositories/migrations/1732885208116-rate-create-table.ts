import { MigrationInterface, QueryRunner } from 'typeorm';

import { RateSettingsEntity } from '@app/rate/repositories/dao/rate-settings.entity';
import { RateEntity } from '@app/rate/repositories/dao/rate.entity';

const { tableName } = RateEntity;

export class RateCreateTable1732885208116 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "${tableName}" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" timestamp NOT NULL DEFAULT now(),
                "received_at" timestamp NOT NULL,
                "scaled_bid_price" bigint NOT NULL,
                "scaled_ask_price" bigint NOT NULL,
                "rate_settings_id" uuid NOT NULL,
                CONSTRAINT "${tableName}_pk" PRIMARY KEY ("id")
            );

            ALTER TABLE "${tableName}" ADD CONSTRAINT "fk_${tableName}_id" FOREIGN KEY ("rate_settings_id") 
            REFERENCES "${RateSettingsEntity.tableName}"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

            CREATE INDEX "idx_${tableName}_settings_id_received_at" ON "${tableName}" ("rate_settings_id", "received_at" DESC NULLS LAST);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "${tableName}";
        `);
    }
}
