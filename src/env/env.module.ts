import { Module } from '@nestjs/common';

import { LocalEnvService } from '@app/env/local-env.service';

@Module({
    providers: [LocalEnvService],
    exports: [LocalEnvService],
})
export class EnvModule {}
