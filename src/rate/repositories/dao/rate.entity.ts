import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RateSettingsEntity } from '@app/rate/repositories/dao/rate-settings.entity';
import { typeormBigIntTransformer } from '@app/utils/utils.service';

const TABLE_NAME = 'rates';

// TODO: add order to index
@Index('idx_rates_rate_settings_id_received_at', ['rateSettingsId', 'receivedAt'])
@Entity(TABLE_NAME)
export class RateEntity {
    public static tableName = TABLE_NAME;

    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt!: Date;

    @Column({ type: 'timestamp', nullable: false })
    public receivedAt!: Date;

    @Column({ nullable: false, type: 'bigint', transformer: typeormBigIntTransformer })
    public scaledBidPrice!: bigint;

    @Column({ nullable: false, type: 'bigint', transformer: typeormBigIntTransformer })
    public scaledAskPrice!: bigint;

    @Column({ nullable: false })
    public rateSettingsId!: string;

    @ManyToOne(() => RateSettingsEntity)
    public rateSettings!: RateSettingsEntity;
}
