import { getCompatibility, getUa } from './const' with { type: 'macro' };

import axios, { AxiosInstance } from 'axios';
import { FsbStaticApiV2EventList, FsbStaticApiV2ProblemList, FsbStaticApiV2Schema, FsbStaticApiV2SchemaList } from './types';


type Options = {
  baseUrl?: string,
};

const defaultOptions: Options = {
  baseUrl: 'https://api.freestuffbot.xyz/v2', 
};

export class RestApiClient {

  private client: AxiosInstance;

  constructor(
    token: string,
    options?: Options,
  ) {
    this.client = axios.create({
      baseURL: options?.baseUrl || defaultOptions.baseUrl,
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': getUa(),
        'Content-Type': 'application/json',
        'X-Set-Compatibility-Date': getCompatibility(),
      },
    });
  }

  public getPing() {
    return this.client.get('/ping')
  }

  public readonly static = {
    getSchemas: () => this.client
      .get<FsbStaticApiV2SchemaList>('/static/schemas'),
    getSchema: (urn: string) => this.client
      .get<FsbStaticApiV2Schema>(`/static/schemas/${urn}`),
    getProblems: () => this.client
      .get<FsbStaticApiV2ProblemList>('/static/problems'),
    getEvents: () => this.client
      .get<FsbStaticApiV2EventList>('/static/events'),
  }

}
