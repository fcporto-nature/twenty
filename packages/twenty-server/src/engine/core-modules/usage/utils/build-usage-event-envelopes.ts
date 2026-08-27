/* @license Enterprise */

import { formatDateTimeForClickHouse } from 'src/database/clickhouse/utils/format-date-time-for-clickhouse.util';
import { type WorkspaceEventEnvelope } from 'src/engine/core-modules/event-logs/types/workspace-event-envelope.type';
import { type UsageEvent } from 'src/engine/core-modules/usage/types/usage-event.type';

export const buildUsageEventEnvelopes = (
  workspaceId: string,
  usageEvents: UsageEvent[],
): WorkspaceEventEnvelope[] => {
  const now = formatDateTimeForClickHouse(new Date());

  return usageEvents.map((usageEvent) => {
    const spenders = usageEvent.spenders ?? {};

    return {
      table: 'usageEvent',
      row: {
        timestamp: now,
        workspaceId,
        periodStart: usageEvent.periodStart
          ? formatDateTimeForClickHouse(usageEvent.periodStart)
          : undefined,
        userWorkspaceId: spenders.userWorkspaceId ?? '',
        apiKeyId: spenders.apiKeyId ?? '',
        applicationId: spenders.applicationId ?? '',
        agentId: spenders.agentId ?? '',
        workflowId: spenders.workflowId ?? '',
        workflowRunId: spenders.workflowRunId ?? '',
        logicFunctionId: spenders.logicFunctionId ?? '',
        resourceType: usageEvent.resourceType,
        operationType: usageEvent.operationType,
        quantity: usageEvent.quantity,
        unit: usageEvent.unit,
        creditsUsedMicro: usageEvent.creditsUsedMicro,
        resourceContext: usageEvent.resourceContext ?? '',
        metadata: {},
      },
    };
  });
};
