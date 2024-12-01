import { Injectable } from '@nestjs/common';

import { RateSettings } from '@app/rate/interfaces';
import { RateSettingsRepository } from '@app/rate/repositories/rate-settings.repository';

@Injectable()
export class RateSettingsService {
    constructor(private readonly rateSettingsRepository: RateSettingsRepository) {}

    public async getEnabledRatesSettings(): Promise<RateSettings[]> {
        const enableRates = await this.rateSettingsRepository.getSettings({ onlyEnabled: true });

        return enableRates.map((item) => ({
            id: item.id,
            enabled: item.enabled,
            symbol: item.symbol,
        }));
    }

    public async getEnabledRateSettingsMapBySymbol(): Promise<Map<string, RateSettings>> {
        const rateSettings = await this.getEnabledRatesSettings();

        return new Map(rateSettings.map((item) => [item.symbol, item]));
    }
}
