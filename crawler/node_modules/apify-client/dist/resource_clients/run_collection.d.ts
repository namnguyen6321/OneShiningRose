import { ACTOR_JOB_STATUSES } from '@apify/consts';
import type { ApiClientOptionsWithOptionalResourcePath } from '../base/api_client';
import { ResourceCollectionClient } from '../base/resource_collection_client';
import type { PaginatedList } from '../utils';
import type { ActorRunListItem } from './actor';
export declare class RunCollectionClient extends ResourceCollectionClient {
    /**
     * @hidden
     */
    constructor(options: ApiClientOptionsWithOptionalResourcePath);
    /**
     * https://docs.apify.com/api/v2#/reference/actors/run-collection/get-list-of-runs
     */
    list(options?: RunCollectionListOptions): Promise<PaginatedList<ActorRunListItem>>;
}
export interface RunCollectionListOptions {
    limit?: number;
    offset?: number;
    desc?: boolean;
    status?: (typeof ACTOR_JOB_STATUSES)[keyof typeof ACTOR_JOB_STATUSES] | (typeof ACTOR_JOB_STATUSES)[keyof typeof ACTOR_JOB_STATUSES][];
}
//# sourceMappingURL=run_collection.d.ts.map