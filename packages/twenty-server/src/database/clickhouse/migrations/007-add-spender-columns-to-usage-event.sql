ALTER TABLE usageEvent ADD COLUMN IF NOT EXISTS apiKeyId String DEFAULT '';

ALTER TABLE usageEvent ADD COLUMN IF NOT EXISTS applicationId String DEFAULT '';

ALTER TABLE usageEvent ADD COLUMN IF NOT EXISTS agentId String DEFAULT '';

ALTER TABLE usageEvent ADD COLUMN IF NOT EXISTS workflowId String DEFAULT '';

ALTER TABLE usageEvent ADD COLUMN IF NOT EXISTS workflowRunId String DEFAULT '';

ALTER TABLE usageEvent ADD COLUMN IF NOT EXISTS logicFunctionId String DEFAULT '';

-- resourceId was polymorphic on resourceType; synchronous so the column can
-- be dropped right after.
ALTER TABLE usageEvent UPDATE
  agentId = if(resourceType = 'AI', resourceId, agentId),
  workflowId = if(resourceType = 'WORKFLOW', resourceId, workflowId),
  logicFunctionId = if(resourceType = 'LOGIC_FUNCTION', resourceId, logicFunctionId),
  applicationId = if(resourceType = 'APP', resourceId, applicationId)
WHERE resourceId != '' SETTINGS mutations_sync = 2;

ALTER TABLE usageEvent DROP COLUMN IF EXISTS resourceId;

ALTER TABLE usageEvent ADD PROJECTION IF NOT EXISTS consumption_by_scope (
    SELECT
        workspaceId,
        periodStart,
        resourceType,
        operationType,
        userWorkspaceId,
        apiKeyId,
        applicationId,
        agentId,
        workflowId,
        logicFunctionId,
        sum(creditsUsedMicro) AS totalCreditsUsedMicro,
        sum(quantity) AS totalQuantity
    GROUP BY
        workspaceId, periodStart, resourceType, operationType, userWorkspaceId, apiKeyId, applicationId, agentId, workflowId, logicFunctionId
);

ALTER TABLE usageEvent MATERIALIZE PROJECTION consumption_by_scope;
