import type { ApiClientSubResourceOptions } from '../base/api_client';
import { ResourceCollectionClient } from '../base/resource_collection_client';
import type { PaginatedList } from '../utils';
import type { ActorEnvironmentVariable } from './actor_version';
export declare class ActorEnvVarCollectionClient extends ResourceCollectionClient {
    /**
     * @hidden
     */
    constructor(options: ApiClientSubResourceOptions);
    /**
     * https://docs.apify.com/api/v2#/reference/actors/environment-variable-collection/get-list-of-environment-variables
     */
    list(options?: ActorEnvVarCollectionListOptions): Promise<ActorEnvVarListResult>;
    /**
     * https://docs.apify.com/api/v2#/reference/actors/environment-variable-collection/create-environment-variable
     */
    create(actorEnvVar: ActorEnvironmentVariable): Promise<ActorEnvironmentVariable>;
}
export interface ActorEnvVarCollectionListOptions {
    limit?: number;
    offset?: number;
    desc?: boolean;
}
export type ActorEnvVarListResult = Pick<PaginatedList<ActorEnvironmentVariable>, 'total' | 'items'>;
//# sourceMappingURL=actor_env_var_collection.d.ts.map