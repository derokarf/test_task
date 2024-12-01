import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

import { UPDATE_BINANCE_RATE_JOB, UPDATE_BINANCE_RATE_QUEUE } from '@app/rate/constants';
import { Rate } from '@app/rate/interfaces';
import { BinaceRateService } from '@app/rate/services/binance-rate.service';
import { RateCacheService } from '@app/rate/services/rate-cache.service';
import { RateSettingsService } from '@app/rate/services/rate-settings.service';
import { RateService } from '@app/rate/services/rate.service';
import { UtilsService } from '@app/utils/utils.service';

@Injectable()
@Processor(UPDATE_BINANCE_RATE_QUEUE)
export class UpdateBinanceRateProcessor {
    constructor(
        private readonly binaceRateService: BinaceRateService,
        private readonly rateCacheService: RateCacheService,
        private readonly rateService: RateService,
        private readonly rateSettingsService: RateSettingsService,
        private readonly utilsService: UtilsService,
    ) {}

    @Process(UPDATE_BINANCE_RATE_JOB)
    public async updateRates(): Promise<void> {
        console.log(`${new Date().toString()}: Start updating rates from binance`);
        try {
            const rateSettingsMap = await this.rateSettingsService.getEnabledRateSettingsMapBySymbol();

            const symbols = Array.from(rateSettingsMap.keys());

            const rawRates = await this.binaceRateService.getRates(symbols);

            const receivedAt = new Date();

            const actualRates: Rate[] = [];

            for (let i = 0, size = rawRates.length; i < size; i++) {
                const rawRate = rawRates[i];
                const rateSettings = rateSettingsMap.get(rawRate.symbol);

                if (rateSettings) {
                    actualRates.push({
                        rateSettingsId: rateSettings.id,
                        receivedAt,
                        scaledAskPrice: this.utilsService.stringToScaledBigint(rawRate.askPrice),
                        scaledBidPrice: this.utilsService.stringToScaledBigint(rawRate.bidPrice),
                        rateSettings: {
                            symbol: rawRate.symbol,
                            id: rateSettings.id,
                        },
                    });
                } else {
                    console.warn(
                        `BinanceRateProcessor: updateRates, warning, response contains unrequested symbol: ${rawRate.symbol}`,
                    );
                }
            }

            if (actualRates.length !== rateSettingsMap.size) {
                const requiredSymbols = Array.from(rateSettingsMap.keys());
                const receivedSymbols = actualRates.map((rate) => rate.rateSettings.symbol);
                const unreceivedSymbols = requiredSymbols.filter((item) => !receivedSymbols.includes(item));

                console.log(`BinanceRateProcessor: updateRates, warning, unreceived symbols: ${unreceivedSymbols.join()}`);
            }

            await this.rateService.addRates(actualRates);

            const ratesWithFee = this.rateService.addFeeToRates(actualRates);

            const floatRates = this.rateService.getFloatRates(ratesWithFee);

            await this.rateCacheService.updateLastRates(floatRates);
        } catch (err) {
            console.log('UpdateBinanceRateProcessor: updateRates, error', err);
        }
    }
}
