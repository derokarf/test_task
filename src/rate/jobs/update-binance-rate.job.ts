import { InjectQueue } from '@nestjs/bull';
import { OnModuleInit } from '@nestjs/common';
import { Queue, CronRepeatOptions, JobOptions } from 'bull';

import { LocalEnvService } from '@app/env/local-env.service';
import { UPDATE_BINANCE_RATE_JOB, UPDATE_BINANCE_RATE_QUEUE } from '@app/rate/constants';

export class UpdateBinanceRateJob implements OnModuleInit {
    constructor(
        @InjectQueue(UPDATE_BINANCE_RATE_QUEUE)
        private readonly foreignTypeQueue: Queue,
        private readonly localEnvService: LocalEnvService,
    ) {}

    public async onModuleInit(): Promise<void> {
        const schedule = this.localEnvService.getUpdatingRateSchedule();
        const repeatOptions: CronRepeatOptions = { cron: schedule };
        const jobOptions: JobOptions = {
            attempts: 1,
            repeat: repeatOptions,
            jobId: UPDATE_BINANCE_RATE_JOB,
            removeOnComplete: true,
            removeOnFail: true,
        };

        const jobs = await this.foreignTypeQueue.getRepeatableJobs();
        const repeatableForeignTypeJobs = jobs.filter((job) => job.name === UPDATE_BINANCE_RATE_JOB);

        await Promise.all(repeatableForeignTypeJobs.map((job) => this.foreignTypeQueue.removeRepeatableByKey(job.key)));

        await this.foreignTypeQueue.add(UPDATE_BINANCE_RATE_JOB, {}, jobOptions);
    }
}
