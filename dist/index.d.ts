export declare type FreeStuffApiSettings = ({
    type?: 'basic';
} | {
    type: 'partner';
    sid: string;
    version?: string;
}) & {
    key: string;
    baseUrl?: string;
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
export interface LocalizedGameInfo {
    lang_name: string;
    lang_name_en: string;
    lang_flag_emoji: string;
    platform: string;
    claim_long: string;
    claim_short: string;
    free: string;
    header: string;
    footer: string;
    org_price_eur: string;
    org_price_usd: string;
    until: string;
    until_alt: string;
    flags: string[];
}
export interface GameInfo {
    id: number;
    url: string;
    org_url: string;
    title: string;
    org_price: {
        euro: number;
        dollar: number;
    };
    price: {
        euro: number;
        dollar: number;
    };
    thumbnail: string;
    until: Date;
    store: Store;
    flags: GameFlags;
    type: AnnouncementType;
    store_meta: {
        steam_subids: string;
    };
    localized?: {
        'en-US': LocalizedGameInfo;
        [key: string]: LocalizedGameInfo;
    };
}
export declare enum GameFlag {
    TRASH = 1,
    THIRDPARTY = 2
}
/** @see GameFlag */
export declare type GameFlags = number;
export declare type Store = 'steam' | 'epic' | 'humble' | 'gog' | 'origin' | 'uplay' | 'twitch' | 'itch' | 'discord' | 'apple' | 'google' | 'switch' | 'ps' | 'xbox' | 'other';
export declare type AnnouncementType = 'free' | 'weekend' | 'discount' | 'ad' | 'unknown';
export interface GameAnalytics {
    discord: GameAnalyticsDiscord;
    telegram: GameAnalyticsTelegram;
}
export interface GameAnalyticsDiscord {
    reach: number;
    clicks: number;
}
export interface GameAnalyticsTelegram {
    reach: {
        users: number;
        groups: number;
        supergroups: number;
        groupUsers: number;
        channels: number;
        channelUsers: number;
    };
    clicks: number;
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
    getGameDetails(games: number[], lookup: 'analytics', settings?: any, useCache?: boolean): Promise<{
        [id: string]: GameAnalytics;
    }>;
    /** @access PARTNER ONLY */
    getGameDetails(games: number[], lookup: 'all', settings?: any, useCache?: boolean): Promise<{
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
