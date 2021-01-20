"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameFlag = exports.PartnerEndpoint = exports.Endpoint = void 0;
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
//# sourceMappingURL=types.js.map