import { FsbStaticApiV2EventList, FsbStaticApiV2ProblemList, FsbStaticApiV2Schema, FsbStaticApiV2SchemaList } from './types';
type Options = {
    baseUrl?: string;
};
export declare class RestApiClient {
    readonly token: string;
    readonly options: Options;
    private baseUrl;
    private headers;
    constructor(token: string, options: Options);
    getPing(): import("axios").AxiosPromise<any>;
    readonly static: {
        getSchemas(): Promise<import("axios").AxiosResponse<FsbStaticApiV2SchemaList>>;
        getSchema(urn: string): Promise<import("axios").AxiosResponse<FsbStaticApiV2Schema>>;
        getProblems(): Promise<import("axios").AxiosResponse<FsbStaticApiV2ProblemList>>;
        getEvents(): Promise<import("axios").AxiosResponse<FsbStaticApiV2EventList>>;
    };
}
export {};
