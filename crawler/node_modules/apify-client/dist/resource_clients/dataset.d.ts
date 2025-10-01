import type { STORAGE_GENERAL_ACCESS } from '@apify/consts';
import type { ApiClientSubResourceOptions } from '../base/api_client';
import { ResourceClient } from '../base/resource_client';
import type { PaginatedList } from '../utils';
export declare class DatasetClient<Data extends Record<string | number, any> = Record<string | number, unknown>> extends ResourceClient {
    /**
     * @hidden
     */
    constructor(options: ApiClientSubResourceOptions);
    /**
     * https://docs.apify.com/api/v2#/reference/datasets/dataset/get-dataset
     */
    get(): Promise<Dataset | undefined>;
    /**
     * https://docs.apify.com/api/v2#/reference/datasets/dataset/update-dataset
     */
    update(newFields: DatasetClientUpdateOptions): Promise<Dataset>;
    /**
     * https://docs.apify.com/api/v2#/reference/datasets/dataset/delete-dataset
     */
    delete(): Promise<void>;
    /**
     * https://docs.apify.com/api/v2#/reference/datasets/item-collection/get-items
     */
    listItems(options?: DatasetClientListItemOptions): Promise<PaginatedList<Data>>;
    /**
     * Unlike `listItems` which returns a {@link PaginationList} with an array of individual
     * dataset items, `downloadItems` returns the items serialized to the provided format.
     * https://docs.apify.com/api/v2#/reference/datasets/item-collection/get-items
     */
    downloadItems(format: DownloadItemsFormat, options?: DatasetClientDownloadItemsOptions): Promise<Buffer>;
    /**
     * https://docs.apify.com/api/v2#/reference/datasets/item-collection/put-items
     */
    pushItems(items: Data | Data[] | string | string[]): Promise<void>;
    /**
     * https://docs.apify.com/api/v2#tag/DatasetsStatistics/operation/dataset_statistics_get
     */
    getStatistics(): Promise<DatasetStatistics | undefined>;
    /**
     * Generates a URL that can be used to access dataset items.
     *
     * If the client has permission to access the dataset's URL signing key,
     * the URL will include a signature which will allow the link to work even without authentication.
     *
     * You can optionally control how long the signed URL should be valid using the `expiresInSecs` option.
     * This value sets the expiration duration in seconds from the time the URL is generated.
     * If not provided, the URL will not expire.
     *
     * Any other options (like `limit` or `prefix`) will be included as query parameters in the URL.
     */
    createItemsPublicUrl(options?: DatasetClientCreateItemsUrlOptions): Promise<string>;
    private _createPaginationList;
}
export interface Dataset {
    id: string;
    name?: string;
    title?: string;
    userId: string;
    createdAt: Date;
    modifiedAt: Date;
    accessedAt: Date;
    itemCount: number;
    cleanItemCount: number;
    actId?: string;
    actRunId?: string;
    stats: DatasetStats;
    fields: string[];
    generalAccess?: STORAGE_GENERAL_ACCESS | null;
    urlSigningSecretKey?: string | null;
    itemsPublicUrl: string;
}
export interface DatasetStats {
    readCount?: number;
    writeCount?: number;
    deleteCount?: number;
    storageBytes?: number;
}
export interface DatasetClientUpdateOptions {
    name?: string | null;
    title?: string;
    generalAccess?: STORAGE_GENERAL_ACCESS | null;
}
export interface DatasetClientListItemOptions {
    clean?: boolean;
    desc?: boolean;
    flatten?: string[];
    fields?: string[];
    omit?: string[];
    limit?: number;
    offset?: number;
    skipEmpty?: boolean;
    skipHidden?: boolean;
    unwind?: string | string[];
    view?: string;
}
export interface DatasetClientCreateItemsUrlOptions extends DatasetClientListItemOptions {
    expiresInSecs?: number;
}
export declare enum DownloadItemsFormat {
    JSON = "json",
    JSONL = "jsonl",
    XML = "xml",
    HTML = "html",
    CSV = "csv",
    XLSX = "xlsx",
    RSS = "rss"
}
export interface DatasetClientDownloadItemsOptions extends DatasetClientListItemOptions {
    attachment?: boolean;
    bom?: boolean;
    delimiter?: string;
    skipHeaderRow?: boolean;
    xmlRoot?: string;
    xmlRow?: string;
}
export interface DatasetStatistics {
    fieldStatistics: Record<string, FieldStatistics>;
}
export interface FieldStatistics {
    min?: number;
    max?: number;
    nullCount?: number;
    emptyCount?: number;
}
//# sourceMappingURL=dataset.d.ts.map