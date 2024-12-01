export interface RateWithFee {
    symbol: string;
    scaledBidPriceWithFee: bigint;
    scaledAskPriceWithFee: bigint;
    scaledMidPriceWithFee: bigint;
}

export interface FloatRate {
    symbol: string;
    bidPrice: string;
    askPrice: string;
    midPrice: string;
}

export interface Rate {
    rateSettingsId: string;
    scaledBidPrice: bigint;
    scaledAskPrice: bigint;
    rateSettings: {
        symbol: string;
        id: string;
    };
    receivedAt: Date;
}

export interface RateSettings {
    id: string;
    symbol: string;
    enabled: boolean;
}
