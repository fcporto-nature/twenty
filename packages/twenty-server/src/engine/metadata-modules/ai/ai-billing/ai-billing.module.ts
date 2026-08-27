import { Module } from '@nestjs/common';

import { BillingModule } from 'src/engine/core-modules/billing/billing.module';
import { UsageModule } from 'src/engine/core-modules/usage/usage.module';
import { AiBillingService } from 'src/engine/metadata-modules/ai/ai-billing/services/ai-billing.service';
import { AiModelsModule } from 'src/engine/metadata-modules/ai/ai-models/ai-models.module';
import { WorkspaceEventEmitterModule } from 'src/engine/workspace-event-emitter/workspace-event-emitter.module';
import { UsageLimitModule } from 'src/engine/core-modules/usage-limit/usage-limit.module';

@Module({
  imports: [
    WorkspaceEventEmitterModule,
    AiModelsModule,
    BillingModule,
    UsageLimitModule,
    UsageModule,
  ],
  providers: [AiBillingService],
  exports: [AiBillingService],
})
export class AiBillingModule {}
