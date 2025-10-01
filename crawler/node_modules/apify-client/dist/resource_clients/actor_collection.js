"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorListSortBy = exports.ActorCollectionClient = void 0;
const tslib_1 = require("tslib");
const ow_1 = tslib_1.__importDefault(require("ow"));
const resource_collection_client_1 = require("../base/resource_collection_client");
class ActorCollectionClient extends resource_collection_client_1.ResourceCollectionClient {
    /**
     * @hidden
     */
    constructor(options) {
        super({
            resourcePath: 'acts',
            ...options,
        });
    }
    /**
     * https://docs.apify.com/api/v2#/reference/actors/actor-collection/get-list-of-actors
     */
    async list(options = {}) {
        (0, ow_1.default)(options, ow_1.default.object.exactShape({
            my: ow_1.default.optional.boolean,
            limit: ow_1.default.optional.number,
            offset: ow_1.default.optional.number,
            desc: ow_1.default.optional.boolean,
            sortBy: ow_1.default.optional.string.oneOf(Object.values(ActorListSortBy)),
        }));
        return this._list(options);
    }
    /**
     * https://docs.apify.com/api/v2#/reference/actors/actor-collection/create-actor
     */
    async create(actor) {
        (0, ow_1.default)(actor, ow_1.default.optional.object);
        return this._create(actor);
    }
}
exports.ActorCollectionClient = ActorCollectionClient;
var ActorListSortBy;
(function (ActorListSortBy) {
    ActorListSortBy["CREATED_AT"] = "createdAt";
    ActorListSortBy["LAST_RUN_STARTED_AT"] = "stats.lastRunStartedAt";
})(ActorListSortBy || (exports.ActorListSortBy = ActorListSortBy = {}));
//# sourceMappingURL=actor_collection.js.map