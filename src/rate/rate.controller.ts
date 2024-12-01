import { Controller, Get } from '@nestjs/common';

import { FloatRate } from '@app/rate/interfaces';
import { RateHandler } from '@app/rate/rate.handler';

@Controller('rates')
export class RateController {
    constructor(private readonly rateHnadler: RateHandler) {}

    @Get('last-rates')
    public async getLastRates(): Promise<FloatRate[]> {
        return this.rateHnadler.getLastRatesWithFee();
    }
}
