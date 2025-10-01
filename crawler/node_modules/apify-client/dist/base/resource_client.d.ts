import type { ACT_JOB_STATUSES } from '@apify/consts';
import { ApiClient } from './api_client';
export declare const SMALL_TIMEOUT_MILLIS: number;
export declare const MEDIUM_TIMEOUT_MILLIS: number;
export declare const DEFAULT_TIMEOUT_MILLIS: number;
/**
 * Resource client.
 * @private
 */
export declare class ResourceClient extends ApiClient {
    protected _get<T, R>(options?: T, timeoutMillis?: number): Promise<R | undefined>;
    protected _update<T, R>(newFields: T, timeoutMillis?: number): Promise<R>;
    protected _delete(timeoutMillis?: number): Promise<void>;
    /**
     * This function is used in Build and Run endpoints so it's kept
     * here to stay DRY.
     */
    protected _waitForFinish<R extends {
        status: (typeof ACT_JOB_STATUSES)[keyof typeof ACT_JOB_STATUSES];
    }>(options?: WaitForFinishOptions): Promise<R>;
}
export interface WaitForFinishOptions {
    waitSecs?: number;
}
//# sourceMappingURL=resource_client.d.ts.map