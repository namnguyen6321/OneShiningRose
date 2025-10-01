import type { ApiClientSubResourceOptions } from '../base/api_client';
import { ResourceCollectionClient } from '../base/resource_collection_client';
import type { PaginatedList } from '../utils';
import type { Schedule, ScheduleCreateOrUpdateData } from './schedule';
export declare class ScheduleCollectionClient extends ResourceCollectionClient {
    /**
     * @hidden
     */
    constructor(options: ApiClientSubResourceOptions);
    /**
     * https://docs.apify.com/api/v2#/reference/schedules/schedules-collection/get-list-of-schedules
     */
    list(options?: ScheduleCollectionListOptions): Promise<PaginatedList<Schedule>>;
    /**
     * https://docs.apify.com/api/v2#/reference/schedules/schedules-collection/create-schedule
     */
    create(schedule?: ScheduleCreateOrUpdateData): Promise<Schedule>;
}
export interface ScheduleCollectionListOptions {
    limit?: number;
    offset?: number;
    desc?: boolean;
}
//# sourceMappingURL=schedule_collection.d.ts.map