"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreeStuffApi = exports.GameFlag = exports.PartnerEndpoint = exports.Endpoint = void 0;
const axios_1 = require("axios");
const os_1 = require("os");
var Endpoint;
(function (Endpoint) {
    Endpoint["PING"] = "GET /ping";
    Endpoint["GAME_LIST"] = "GET /games/%s";
    Endpoint["GAME_DETAILS"] = "GET /game/%s/%s";
})(Endpoint = exports.Endpoint || (exports.Endpoint = {}));
var PartnerEndpoint;
(function (PartnerEndpoint) {
    PartnerEndpoint["STATUS"] = "POST /status";
    PartnerEndpoint["GAME_ANALYTICS"] = "POST /game/%s/analytics";
})(PartnerEndpoint = exports.PartnerEndpoint || (exports.PartnerEndpoint = {}));
var GameFlag;
(function (GameFlag) {
    GameFlag[GameFlag["TRASH"] = 1] = "TRASH";
    GameFlag[GameFlag["THIRDPARTY"] = 2] = "THIRDPARTY";
})(GameFlag = exports.GameFlag || (exports.GameFlag = {}));
//#endregion
class FreeStuffApi {
    //#region constructor
    constructor(settings) {
        this.settings = settings;
        //#endregion
        //#region GET game list
        this.gameList_cacheData = {};
        this.gameList_cacheUpdate = {};
        this.gameList_ratesRemaining = 5;
        this.gameList_ratesReset = 0;
        //#endregion
        //#region GET game details
        this.gameDetails_cacheData = {};
        this.gameDetails_cacheUpdate = {};
        this.gameDetails_ratesRemaining = 5;
        this.gameDetails_ratesReset = 0;
        //#endregion
        //#region event system
        this.listener = new Map();
        if (!this.settings.type)
            this.settings.type = 'basic';
        if (!this.settings.baseUrl)
            this.settings.baseUrl = 'https://api.freestuffbot.xyz/v1';
        if (!this.settings.cacheTtl) {
            this.settings.cacheTtl = {
                gameDetails: 1000 * 60 * 60 * 24,
                gameList: 1000 * 60 * 5
            };
        }
        if (!this.settings.cacheTtl.gameDetails)
            this.settings.cacheTtl.gameDetails = 1000 * 60 * 60 * 24;
        if (!this.settings.cacheTtl.gameList)
            this.settings.cacheTtl.gameList = 1000 * 60 * 5;
    }
    //#endregion
    //#region http core
    getHeaders() {
        return {
            'Authorization': this.settings.type == 'basic'
                ? `Basic ${this.settings.key}`
                : `Partner ${this.settings.key} ${this.settings.sid}`
        };
    }
    makeRequest(endpoint, body, query, ...args) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let url = this.settings.baseUrl;
            let method = 'GET';
            if (endpoint.includes(' ')) {
                method = endpoint.split(' ')[0];
                url += endpoint.substr(method.length + 1);
            }
            else {
                url += endpoint;
            }
            for (const arg of args)
                url = url.replace('%s', arg);
            if (query && Object.keys(query).length) {
                const append = [];
                for (const key in query)
                    append.push(`${key}=${query[key]}`);
                url += `?${append.join('=')}`;
            }
            if (!['GET', 'POST', 'PUT', 'DELETE'].includes(method.toUpperCase()))
                throw new Error(`FreeStuffApi Error. ${method} is not a valid http request method.`);
            let conf = [{ headers: this.getHeaders() }];
            if (['POST', 'PUT'].includes(method.toUpperCase()))
                conf = [body || null, ...conf];
            let raw;
            try {
                raw = yield axios_1.default[method.toLowerCase()](url, ...conf);
            }
            catch (err) {
                raw = err.response;
                if ((raw === null || raw === void 0 ? void 0 : raw.status) == 403)
                    throw new Error('FreeStuffApi Error. Invalid authorization key.');
            }
            if ((raw === null || raw === void 0 ? void 0 : raw.status) == 200)
                return Object.assign(Object.assign({}, raw.data), { _headers: raw.headers, _status: raw.status });
            if (raw === null || raw === void 0 ? void 0 : raw.data.error)
                return Object.assign(Object.assign({}, raw.data), { _headers: raw.headers, _status: raw.status });
            return { success: false, error: (raw === null || raw === void 0 ? void 0 : raw.statusText) || 'error', message: `ApiWrapper Request failed. [http ${(raw === null || raw === void 0 ? void 0 : raw.status) || '?'}]`, _headers: (_a = raw === null || raw === void 0 ? void 0 : raw.headers) !== null && _a !== void 0 ? _a : {}, _status: (_b = raw === null || raw === void 0 ? void 0 : raw.status) !== null && _b !== void 0 ? _b : 0 };
        });
    }
    rateLimitMeta(headers) {
        var _a;
        return {
            remaining: (_a = parseInt(headers['X-RateLimit-Remaining'], 10)) !== null && _a !== void 0 ? _a : -1,
            reset: Date.now() + (parseInt(headers['X-RateLimit-Reset'], 10) * 1000 - parseInt(headers['X-Server-Time'], 10))
        };
    }
    //#endregion
    //#region PING
    ping() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Endpoint.PING);
        });
    }
    getGameList(category, useCache = true) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.gameList_ratesRemaining == 0 && (Date.now() - this.gameList_ratesReset < 0)) {
                return new Promise((res) => setTimeout(() => res(this.getGameList(category)), this.gameList_ratesReset - Date.now()));
            }
            if (useCache) {
                if (this.gameList_cacheData[category] && (Date.now() - this.gameList_cacheUpdate[category] < this.settings.cacheTtl.gameList))
                    return this.gameList_cacheData[category];
            }
            const data = yield this.makeRequest(Endpoint.GAME_LIST, null, {}, category);
            const rlm = this.rateLimitMeta(data._headers);
            this.gameList_ratesRemaining = rlm.remaining;
            this.gameList_ratesReset = rlm.reset;
            this.gameList_cacheData[category] = data.data || this.gameList_cacheData[category];
            this.gameList_cacheUpdate[category] = Date.now();
            return (_a = data.data) !== null && _a !== void 0 ? _a : [];
        });
    }
    getGameDetails(games, lookup, settings = {}, useCache = true) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const out = {};
            const query = {};
            if (settings.language) {
                query.lang = settings.language.join('+');
            }
            if (!games.length)
                return out;
            if (lookup != 'info' && this.settings.type != 'partner')
                throw new Error(`FreeStuffApi Error. Tried to request partner only information. Get game details, lookup: ${lookup}. Allowed lookups: [ 'info' ]`);
            if (useCache) {
                for (const game of games) {
                    const cid = `${game}/${lookup}`;
                    if (this.gameDetails_cacheData[cid] && (Date.now() - this.gameDetails_cacheUpdate[cid] < this.settings.cacheTtl.gameDetails)) {
                        out[game + ''] = this.gameDetails_cacheData[cid];
                        games.splice(games.indexOf(game), 1);
                    }
                }
            }
            if (!games.length)
                return out;
            if (this.gameDetails_ratesRemaining == 0 && (Date.now() - this.gameDetails_ratesReset < 0)) {
                return new Promise((res) => setTimeout(() => res(this.getGameDetails(games, lookup, settings, useCache)), this.gameDetails_ratesReset - Date.now()));
            }
            const requestStack = [[]];
            for (const game of games) {
                if (requestStack[requestStack.length - 1].length < 5)
                    requestStack[requestStack.length - 1].push(game);
                else
                    requestStack.push([game]);
            }
            const raw = (yield Promise.all(requestStack.map(q => this.makeRequest(Endpoint.GAME_DETAILS, null, query, q.join('+'), lookup))));
            for (const res of raw) {
                for (const id of Object.keys(res.data || {})) {
                    let object = (_a = (res.data && res.data[id])) !== null && _a !== void 0 ? _a : null;
                    if (object) {
                        object.until = object.until ? new Date(object.until * 1000) : null;
                        object.id = parseInt(id, 10);
                    }
                    out[id] = object;
                    const cid = `${id}/${lookup}`;
                    this.gameDetails_cacheData[cid] = object;
                    this.gameDetails_cacheUpdate[cid] = Date.now();
                }
            }
            const rlm = this.rateLimitMeta(raw[raw.length - 1]._headers);
            this.gameDetails_ratesRemaining = rlm.remaining;
            this.gameDetails_ratesReset = rlm.reset;
            return out;
        });
    }
    //#endregion
    //#region POST status
    /** @access PARTNER ONLY */
    postStatus(service, status, data, version, servername, suid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.settings.type != 'partner')
                throw new Error('FreeStuffApi Error. Tried using partner-only endpoint "postStatus" as non-partner.');
            data = data || {};
            servername = servername || (yield os_1.hostname());
            suid = suid || this.settings.sid;
            version = version || this.settings.version || 'unknown';
            const body = {
                data, suid, status, service, version,
                server: servername
            };
            const res = yield this.makeRequest(PartnerEndpoint.STATUS, body);
            if ((res === null || res === void 0 ? void 0 : res.data) && (res === null || res === void 0 ? void 0 : res.data['events']))
                res.data['events'].forEach(e => this.emitRawEvent(e));
            return res;
        });
    }
    postGameAnalytics(game, service, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.settings.type != 'partner')
                throw new Error('FreeStuffApi Error. Tried using partner-only endpoint "postGameAnalytics" as non-partner.');
            const body = {
                service,
                suid: this.settings.sid,
                data
            };
            return this.makeRequest(PartnerEndpoint.GAME_ANALYTICS, body, {}, game + '');
        });
    }
    on(event, handler) {
        if (this.listener.has(event))
            this.listener.get(event).push(handler);
        else
            this.listener.set(event, [handler]);
    }
    unregisterEventHandler(event) {
        if (event)
            this.listener.delete(event);
        else
            this.listener = new Map();
    }
    emitEvent(event, ...data) {
        if (this.listener.has(event))
            this.listener.get(event).forEach(handler => handler(...data));
    }
    emitRawEvent(event, orElse) {
        switch (event.event) {
            case 'free_games':
                this.emitEvent('free_games', event.data);
                break;
            case 'webhook_test':
                this.emitEvent('webhook_test');
                break;
            default: orElse && orElse(event);
        }
    }
    webhook() {
        const api = this;
        return (req, res) => {
            var _a;
            if (api.settings.webhookSecret) {
                if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.secret) || req.body.secret !== api.settings.webhookSecret)
                    return res.status(400).end();
            }
            api.emitRawEvent(req.body);
            res.status(200).end();
        };
    }
}
exports.FreeStuffApi = FreeStuffApi;
//# sourceMappingURL=index.js.map