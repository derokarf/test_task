import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnvModule } from '@app/env/env.module';
import { UPDATE_BINANCE_RATE_QUEUE } from '@app/rate/constants';
import { UpdateBinanceRateJob } from '@app/rate/jobs/update-binance-rate.job';
import { UpdateBinanceRateProcessor } from '@app/rate/processors/update-binance-rate.processor';
import { RateController } from '@app/rate/rate.controller';
import { RateHandler } from '@app/rate/rate.handler';
import { RateSettingsEntity } from '@app/rate/repositories/dao/rate-settings.entity';
import { RateEntity } from '@app/rate/repositories/dao/rate.entity';
import { RateSettingsRepository } from '@app/rate/repositories/rate-settings.repository';
import { RateRepository } from '@app/rate/repositories/rate.repository';
import { BinaceRateService } from '@app/rate/services/binance-rate.service';
import { RateCacheService } from '@app/rate/services/rate-cache.service';
import { RateSettingsService } from '@app/rate/services/rate-settings.service';
import { RateService } from '@app/rate/services/rate.service';
import { UtilsModule } from '@app/utils/utils.module';

@Module({
    controllers: [RateController],
    imports: [
        UtilsModule,
        TypeOrmModule.forFeature([RateSettingsEntity, RateEntity]),
        BullModule.registerQueue({ name: UPDATE_BINANCE_RATE_QUEUE }),
        EnvModule,
    ],
    providers: [
        BinaceRateService,
        RateCacheService,
        RateSettingsService,
        RateService,
        UpdateBinanceRateProcessor,
        UpdateBinanceRateJob,
        RateRepository,
        RateSettingsRepository,
        RateHandler,
    ],
})
export class RateModule {}
