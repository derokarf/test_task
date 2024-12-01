import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

const TABLE_NAME = 'rate_settings';

@Index('idx_rate_settings_enabled', ['enabled'])
@Index('idx_rate_settings_symbol', ['symbol'], { unique: true })
@Entity(TABLE_NAME)
export class RateSettingsEntity {
    public static tableName = TABLE_NAME;

    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column({ nullable: false })
    public symbol!: string;

    @Column({ default: false })
    public enabled!: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt!: Date;
}
