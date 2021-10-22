import { GameAnalytics, GameInfo } from './games';
export declare type FreeStuffApiSettings = ({
    type?: 'basic';
} | {
    type: 'partner';
    sid: string;
    version?: string;
}) & {
    key: string;
    baseUrl?: string;
    webhookSecret?: string;
    cacheTtl?: {
        gameList?: number;
        gameDetails?: number;
    };
};
export declare enum Endpoint {
    PING = "GET /ping",
    GAME_LIST = "GET /games/%s",
    GAME_DETAILS = "GET /game/%s/%s"
}
export declare enum PartnerEndpoint {
    STATUS = "POST /status",
    GAME_ANALYTICS = "POST /game/%s/analytics"
}
export interface RawApiResponse {
    success: boolean;
    error?: string;
    message?: string;
    data?: Array<any> | Object;
    _headers: Object;
    _status: number;
}
export declare class FreeStuffApi {
    private settings;
    constructor(settings: FreeStuffApiSettings);
    private getHeaders;
    makeRequest(endpoint: Endpoint | PartnerEndpoint | string, body?: any, query?: any, ...args: string[]): Promise<RawApiResponse>;
    private rateLimitMeta;
    ping(): Promise<RawApiResponse>;
    private gameList_cacheData;
    private gameList_cacheUpdate;
    private gameList_ratesRemaining;
    private gameList_ratesReset;
    getGameList(category: 'all' | 'free', useCache?: boolean): Promise<number[]>;
    private gameDetails_cacheData;
    private gameDetails_cacheUpdate;
    private gameDetails_ratesRemaining;
    private gameDetails_ratesReset;
    /** @access PUBLIC */
    getGameDetails(games: number[], lookup: 'info', settings?: {
        language?: string[];
    }, useCache?: boolean): Promise<{
        [id: string]: GameInfo;
    }>;
    /** @access PARTNER ONLY */
    postGameAnalytics(game: number, service: 'discord', data: GameAnalytics['discord']): Promise<RawApiResponse>;
    postGameAnalytics(game: number, service: string, data: any): Promise<RawApiResponse>;
    private listener;
    on(event: 'webhook_test', handler: () => any): any;
    on(event: 'free_games', handler: (ids: number[]) => any): any;
    unregisterEventHandler(event?: string): void;
    emitEvent(event: string, ...data: any): void;
    emitRawEvent(event: {
        event: string;
        data: any;
    }, orElse?: (event: {
        event: string;
        data: any;
    }) => any): void;
    webhook(): (req: any, res: any) => any;
}
