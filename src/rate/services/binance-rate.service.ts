import { Injectable } from '@nestjs/common';

import { LocalEnvService } from '@app/env/local-env.service';

export interface BinanceRate {
    symbol: string;
    bidPrice: string;
    bidQty: string;
    askPrice: string;
    askQty: string;
}

@Injectable()
export class BinaceRateService {
    constructor(private readonly localEnvService: LocalEnvService) {}

    public async getRates(symbols: string[]): Promise<BinanceRate[]> {
        if (!symbols?.length) {
            console.log('BinaceRateService: getRates, warning, symbols is empty');
        }

        const params = new URLSearchParams({
            symbols: `[${symbols.map((item) => `"${item}"`).join(',')}]`,
        });

        const baseUrl = this.localEnvService.getBinanceApiUrl();
        const url = `${baseUrl}/ticker/bookTicker?${params.toString()}`;

        const result = await fetch(url, { method: 'GET' }).catch((err) => {
            console.log('BinaceRateService: getRates, request error', err);
            throw err;
        });

        let data: BinanceRate[];

        try {
            data = (await result.json()) as BinanceRate[];
        } catch (err) {
            console.log('BinaceRateService: getRates, json parse error');
            throw err;
        }

        return data;
    }
}
