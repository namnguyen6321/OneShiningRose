import type { ApiClientSubResourceOptions } from '../base/api_client';
import { ResourceClient } from '../base/resource_client';
import type { Webhook, WebhookEventType } from './webhook';
export declare class WebhookDispatchClient extends ResourceClient {
    /**
     * @hidden
     */
    constructor(options: ApiClientSubResourceOptions);
    /**
     * https://docs.apify.com/api/v2#/reference/webhook-dispatches/webhook-dispatch-object/get-webhook-dispatch
     */
    get(): Promise<WebhookDispatch | undefined>;
}
export interface WebhookDispatch {
    id: string;
    userId: string;
    webhookId: string;
    createdAt: Date;
    status: WebhookDispatchStatus;
    eventType: WebhookEventType;
    calls: WebhookDispatchCall[];
    webhook: Pick<Webhook, 'requestUrl' | 'isAdHoc'>;
    eventData: WebhookDispatchEventData | null;
}
export declare enum WebhookDispatchStatus {
    Active = "ACTIVE",
    Succeeded = "SUCCEEDED",
    Failed = "FAILED"
}
export interface WebhookDispatchCall {
    startedAt: Date;
    finishedAt: Date;
    errorMessage: string | null;
    responseStatus: number | null;
    responseBody: string | null;
}
export interface WebhookDispatchEventData {
    actorRunId?: string;
    actorId?: string;
    actorTaskId?: string;
    actorBuildId?: string;
}
//# sourceMappingURL=webhook_dispatch.d.ts.map