"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyValueStoreClient = void 0;
const tslib_1 = require("tslib");
const ow_1 = tslib_1.__importDefault(require("ow"));
const log_1 = tslib_1.__importDefault(require("@apify/log"));
const utilities_1 = require("@apify/utilities");
const resource_client_1 = require("../base/resource_client");
const utils_1 = require("../utils");
class KeyValueStoreClient extends resource_client_1.ResourceClient {
    /**
     * @hidden
     */
    constructor(options) {
        super({
            resourcePath: 'key-value-stores',
            ...options,
        });
    }
    /**
     * https://docs.apify.com/api/v2#/reference/key-value-stores/store-object/get-store
     */
    async get() {
        return this._get({}, resource_client_1.SMALL_TIMEOUT_MILLIS);
    }
    /**
     * https://docs.apify.com/api/v2#/reference/key-value-stores/store-object/update-store
     */
    async update(newFields) {
        (0, ow_1.default)(newFields, ow_1.default.object);
        return this._update(newFields, resource_client_1.DEFAULT_TIMEOUT_MILLIS);
    }
    /**
     * https://docs.apify.com/api/v2#/reference/key-value-stores/store-object/delete-store
     */
    async delete() {
        return this._delete(resource_client_1.SMALL_TIMEOUT_MILLIS);
    }
    /**
     * https://docs.apify.com/api/v2#/reference/key-value-stores/key-collection/get-list-of-keys
     */
    async listKeys(options = {}) {
        (0, ow_1.default)(options, ow_1.default.object.exactShape({
            limit: ow_1.default.optional.number,
            exclusiveStartKey: ow_1.default.optional.string,
            collection: ow_1.default.optional.string,
            prefix: ow_1.default.optional.string,
        }));
        const response = await this.httpClient.call({
            url: this._url('keys'),
            method: 'GET',
            params: this._params(options),
            timeout: resource_client_1.MEDIUM_TIMEOUT_MILLIS,
        });
        return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
    }
    /**
     * Generates a URL that can be used to access key-value store record.
     *
     * If the client has permission to access the key-value store's URL signing key,
     * the URL will include a signature to verify its authenticity.
     */
    async getRecordPublicUrl(key) {
        (0, ow_1.default)(key, ow_1.default.string.nonEmpty);
        const store = await this.get();
        const recordPublicUrl = new URL(this._publicUrl(`records/${key}`));
        if (store === null || store === void 0 ? void 0 : store.urlSigningSecretKey) {
            const signature = (0, utilities_1.createHmacSignature)(store.urlSigningSecretKey, key);
            recordPublicUrl.searchParams.append('signature', signature);
        }
        return recordPublicUrl.toString();
    }
    /**
     * Generates a URL that can be used to access key-value store keys.
     *
     * If the client has permission to access the key-value store's URL signing key,
     * the URL will include a signature which will allow the link to work even without authentication.
     *
     * You can optionally control how long the signed URL should be valid using the `expiresInSecs` option.
     * This value sets the expiration duration in seconds from the time the URL is generated.
     * If not provided, the URL will not expire.
     *
     * Any other options (like `limit` or `prefix`) will be included as query parameters in the URL.
     */
    async createKeysPublicUrl(options = {}) {
        (0, ow_1.default)(options, ow_1.default.object.exactShape({
            limit: ow_1.default.optional.number,
            exclusiveStartKey: ow_1.default.optional.string,
            collection: ow_1.default.optional.string,
            prefix: ow_1.default.optional.string,
            expiresInSecs: ow_1.default.optional.number,
        }));
        const store = await this.get();
        const { expiresInSecs, ...queryOptions } = options;
        let createdPublicKeysUrl = new URL(this._publicUrl('keys'));
        if (store === null || store === void 0 ? void 0 : store.urlSigningSecretKey) {
            const signature = (0, utilities_1.createStorageContentSignature)({
                resourceId: store.id,
                urlSigningSecretKey: store.urlSigningSecretKey,
                expiresInMillis: expiresInSecs ? expiresInSecs * 1000 : undefined,
            });
            createdPublicKeysUrl.searchParams.set('signature', signature);
        }
        createdPublicKeysUrl = (0, utils_1.applyQueryParamsToUrl)(createdPublicKeysUrl, queryOptions);
        return createdPublicKeysUrl.toString();
    }
    /**
     * Tests whether a record with the given key exists in the key-value store without retrieving its value.
     *
     * https://docs.apify.com/api/v2#/reference/key-value-stores/record/get-record
     * @param key The queried record key.
     * @returns `true` if the record exists, `false` if it does not.
     */
    async recordExists(key) {
        const requestOpts = {
            url: this._url(`records/${key}`),
            method: 'HEAD',
            params: this._params(),
        };
        try {
            await this.httpClient.call(requestOpts);
            return true;
        }
        catch (err) {
            (0, utils_1.catchNotFoundOrThrow)(err);
        }
        return false;
    }
    async getRecord(key, options = {}) {
        (0, ow_1.default)(key, ow_1.default.string);
        (0, ow_1.default)(options, ow_1.default.object.exactShape({
            buffer: ow_1.default.optional.boolean,
            stream: ow_1.default.optional.boolean,
            disableRedirect: ow_1.default.optional.boolean,
        }));
        if (options.stream && !(0, utils_1.isNode)()) {
            throw new Error('The stream option can only be used in Node.js environment.');
        }
        if ('disableRedirect' in options) {
            log_1.default.deprecated('The disableRedirect option for getRecord() is deprecated. ' +
                'It has no effect and will be removed in the following major release.');
        }
        const requestOpts = {
            url: this._url(`records/${key}`),
            method: 'GET',
            params: this._params(),
            timeout: resource_client_1.DEFAULT_TIMEOUT_MILLIS,
        };
        if (options.buffer)
            requestOpts.forceBuffer = true;
        if (options.stream)
            requestOpts.responseType = 'stream';
        try {
            const response = await this.httpClient.call(requestOpts);
            return {
                key,
                value: response.data,
                contentType: response.headers['content-type'],
            };
        }
        catch (err) {
            (0, utils_1.catchNotFoundOrThrow)(err);
        }
        return undefined;
    }
    /**
     * The value in the record can be a stream object (detected by having the `.pipe`
     * and `.on` methods). However, note that in that case following redirects or
     * retrying the request if it fails (for example due to rate limiting) isn't
     * possible. If you want to keep that behavior, you need to collect the whole
     * stream contents into a Buffer and then send the full buffer. See [this
     * StackOverflow answer](https://stackoverflow.com/a/14269536/7292139) for
     * an example how to do that.
     *
     * https://docs.apify.com/api/v2#/reference/key-value-stores/record/put-record
     */
    async setRecord(record, options = {}) {
        (0, ow_1.default)(record, ow_1.default.object.exactShape({
            key: ow_1.default.string,
            value: ow_1.default.any(ow_1.default.null, ow_1.default.string, ow_1.default.number, ow_1.default.object, ow_1.default.boolean),
            contentType: ow_1.default.optional.string.nonEmpty,
        }));
        (0, ow_1.default)(options, ow_1.default.object.exactShape({
            timeoutSecs: ow_1.default.optional.number,
            doNotRetryTimeouts: ow_1.default.optional.boolean,
        }));
        const { key } = record;
        let { value, contentType } = record;
        const { timeoutSecs, doNotRetryTimeouts } = options;
        const isValueStreamOrBuffer = (0, utils_1.isStream)(value) || (0, utils_1.isBuffer)(value);
        // To allow saving Objects to JSON without providing content type
        if (!contentType) {
            if (isValueStreamOrBuffer)
                contentType = 'application/octet-stream';
            else if (typeof value === 'string')
                contentType = 'text/plain; charset=utf-8';
            else
                contentType = 'application/json; charset=utf-8';
        }
        const isContentTypeJson = /^application\/json/.test(contentType);
        if (isContentTypeJson && !isValueStreamOrBuffer && typeof value !== 'string') {
            try {
                value = JSON.stringify(value, null, 2);
            }
            catch (err) {
                const msg = `The record value cannot be stringified to JSON. Please provide other content type.\nCause: ${err.message}`;
                throw new Error(msg);
            }
        }
        const uploadOpts = {
            url: this._url(`records/${key}`),
            method: 'PUT',
            params: this._params(),
            data: value,
            headers: contentType ? { 'content-type': contentType } : undefined,
            doNotRetryTimeouts,
            timeout: timeoutSecs !== undefined ? timeoutSecs * 1000 : resource_client_1.DEFAULT_TIMEOUT_MILLIS,
        };
        await this.httpClient.call(uploadOpts);
    }
    /**
     * https://docs.apify.com/api/v2#/reference/key-value-stores/record/delete-record
     */
    async deleteRecord(key) {
        (0, ow_1.default)(key, ow_1.default.string);
        await this.httpClient.call({
            url: this._url(`records/${key}`),
            method: 'DELETE',
            params: this._params(),
            timeout: resource_client_1.SMALL_TIMEOUT_MILLIS,
        });
    }
}
exports.KeyValueStoreClient = KeyValueStoreClient;
//# sourceMappingURL=key_value_store.js.map