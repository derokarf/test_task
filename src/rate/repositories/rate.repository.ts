import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RateSettingsEntity } from '@app/rate/repositories/dao/rate-settings.entity';
import { RateEntity } from '@app/rate/repositories/dao/rate.entity';

@Injectable()
export class RateRepository {
    constructor(
        @InjectRepository(RateEntity)
        private readonly repository: Repository<RateEntity>,
    ) {}

    public async getLastRates(filter?: { onlyEnabled?: boolean }): Promise<RateEntity[]> {
        const qb = this.repository.createQueryBuilder();

        const sql = qb
            .innerJoinAndSelect(RateSettingsEntity, 'settings', 'settings.id = RateEntity.rateSettingsId')
            .where((sqb) => {
                const subQuery = sqb
                    .subQuery()
                    .select('max_date.received_at')
                    .from(RateEntity, 'max_date')
                    .orderBy('max_date.received_at', 'DESC')
                    .limit(1)
                    .getQuery();

                return `RateEntity.receivedAt = ${subQuery}`;
            });

        if (filter?.onlyEnabled) {
            sql.andWhere('settings.enabled = true');
        }

        return sql.getMany();
    }

    public async addRates(
        rates: Pick<RateEntity, 'rateSettingsId' | 'scaledAskPrice' | 'scaledBidPrice' | 'receivedAt'>[],
    ): Promise<void> {
        await this.repository.insert(rates);
    }
}
