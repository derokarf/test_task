import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';

import { RateSettingsEntity } from '@app/rate/repositories/dao/rate-settings.entity';

@Injectable()
export class RateSettingsRepository {
    constructor(
        @InjectRepository(RateSettingsEntity)
        private readonly repository: Repository<RateSettingsEntity>,
    ) {}

    public async getSettings(filter?: { symbols?: string[]; onlyEnabled?: boolean }): Promise<RateSettingsEntity[]> {
        const whereOptions: FindOptionsWhere<RateSettingsEntity> = {};

        if (filter?.onlyEnabled) {
            whereOptions.enabled = true;
        }

        if (filter?.symbols?.length) {
            whereOptions.symbol = In(filter.symbols);
        }

        return this.repository.find({ where: whereOptions });
    }
}
