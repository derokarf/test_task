import { Injectable } from '@nestjs/common';

export const typeormBigIntTransformer = {
    from: (value: string): bigint => (typeof value === 'string' ? BigInt(value) : value),
    to: (value: bigint): string => (typeof value === 'bigint' ? String(value) : value),
};

const DECIMALS = '00000000';

@Injectable()
export class UtilsService {
    public stringToScaledBigint(float: string): bigint {
        try {
            const [integerPart = '0', floatPart = '0'] = float.split('.');
            const filledFloatPart = `${floatPart}${DECIMALS}`;

            return BigInt(integerPart) * BigInt(10 ** DECIMALS.length) + BigInt(filledFloatPart.slice(0, DECIMALS.length));
        } catch (err) {
            console.log('UtilsService: toScaledBigint, error', err);
            throw err;
        }
    }

    public numberToScaledBigit(integer: number): bigint {
        return BigInt(integer) * BigInt(10 ** DECIMALS.length);
    }

    public fromScaledToFloatString(scaledNumber: bigint): string {
        const isNegative: boolean = scaledNumber < 0;
        const positiveScaledNumber = isNegative ? -scaledNumber : scaledNumber;
        const integerPart = `${positiveScaledNumber / BigInt(10 ** DECIMALS.length)}`;
        const decimalPart = positiveScaledNumber.toString().slice(-DECIMALS.length);
        const floatPart = `.${`${DECIMALS}${decimalPart}`.slice(-DECIMALS.length)}`;

        const result = `${integerPart}${floatPart.replace(/\.?0+$/, '')}`;

        return result === '0' ? result : isNegative ? `-${result}` : result;
    }
}
