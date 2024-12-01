import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalEnvService {
    public getBinanceApiUrl(): string {
        return process.env.BINANCE_API_URL || 'https://api.binance.com/api/v3';
    }

    public getFee(): string {
        return process.env.FEE || '0.01';
    }

    public getUpdatingRateSchedule(): string {
        return process.env.UPDATING_RATE_SCHEDULE || '*/10 * * * * *';
    }
}
