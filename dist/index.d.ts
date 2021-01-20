import { Endpoint, FreeStuffApiSettings, GameAnalytics, GameAnalyticsDiscord, GameAnalyticsTelegram, GameInfo, PartnerEndpoint, RawApiResponse } from "./types";
export default class FreeStuffApi {
    private settings;
    constructor(settings: FreeStuffApiSettings);
    private getHeaders;
    makeRequest(endpoint: Endpoint | PartnerEndpoint | string, body?: any, ...args: string[]): Promise<RawApiResponse>;
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
    getGameDetails(games: number[], lookup: 'info', useCache?: boolean): Promise<{
        [id: string]: GameInfo;
    }>;
    /** @access PARTNER ONLY */
    getGameDetails(games: number[], lookup: 'analytics', useCache?: boolean): Promise<{
        [id: string]: GameAnalytics;
    }>;
    /** @access PARTNER ONLY */
    getGameDetails(games: number[], lookup: 'all', useCache?: boolean): Promise<{
        [id: string]: any;
    }>;
    /** @access PARTNER ONLY */
    postStatus(service: string, status: 'ok' | 'partial' | 'offline' | 'rebooting' | 'fatal', data?: any, version?: string, servername?: string, suid?: string): Promise<RawApiResponse>;
    /** @access PARTNER ONLY */
    postGameAnalytics(game: number, service: 'discord', data: GameAnalyticsDiscord): Promise<RawApiResponse>;
    postGameAnalytics(game: number, service: 'telegram', data: GameAnalyticsTelegram): Promise<RawApiResponse>;
    postGameAnalytics(game: number, service: string, data: any): Promise<RawApiResponse>;
    private listener;
    on(event: 'free_games', handler: (ids: number[]) => any): any;
    on(event: 'operation', handler: (command: string, args: string[]) => any): any;
    unregisterEventHandler(event?: string): void;
    emitEvent(event: string, ...data: any): void;
    emitRawEvent(event: {
        event: string;
        data: any;
    }, orElse?: (event: {
        event: string;
        data: any;
    }) => any): void;
}
