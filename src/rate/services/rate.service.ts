import { Injectable } from '@nestjs/common';

import { LocalEnvService } from '@app/env/local-env.service';
import { FloatRate, Rate, RateWithFee } from '@app/rate/interfaces';
import { RateRepository } from '@app/rate/repositories/rate.repository';
import { UtilsService } from '@app/utils/utils.service';

@Injectable()
export class RateService {
    constructor(
        private readonly ratesRepository: RateRepository,
        private readonly utilsService: UtilsService,
        private readonly localEnvService: LocalEnvService,
    ) {}

    public async addRates(rates: Rate[]): Promise<void> {
        await this.ratesRepository.addRates(rates);
    }

    public addFeeToRates(rates: Rate[]): RateWithFee[] {
        const scaledFee = this.utilsService.stringToScaledBigint(this.localEnvService.getFee());
        const scalingCompensation = this.utilsService.numberToScaledBigit(1);

        return rates.map((rate) => ({
            symbol: rate.rateSettings.symbol,
            scaledAskPriceWithFee: rate.scaledAskPrice + (rate.scaledAskPrice * scaledFee) / scalingCompensation,
            scaledBidPriceWithFee: rate.scaledBidPrice + (rate.scaledBidPrice * scaledFee) / scalingCompensation,
            scaledMidPriceWithFee: (rate.scaledAskPrice + rate.scaledBidPrice) / 2n,
        }));
    }

    public getFloatRates(rates: RateWithFee[]): FloatRate[] {
        return rates.map((rate) => ({
            symbol: rate.symbol,
            askPrice: this.utilsService.fromScaledToFloatString(rate.scaledAskPriceWithFee),
            bidPrice: this.utilsService.fromScaledToFloatString(rate.scaledBidPriceWithFee),
            midPrice: this.utilsService.fromScaledToFloatString(rate.scaledMidPriceWithFee),
        }));
    }

    public async getLastFloatRatesWithFee(): Promise<FloatRate[]> {
        const rates = await this.ratesRepository.getLastRates({ onlyEnabled: true });

        const ratesWithFee = this.addFeeToRates(rates);

        return this.getFloatRates(ratesWithFee);
    }
}
