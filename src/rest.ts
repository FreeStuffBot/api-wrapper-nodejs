import { getCompatibility, getUa } from './const' with { type: 'macro' };

import axios from 'axios';
import { FsbStaticApiV2EventList, FsbStaticApiV2ProblemList, FsbStaticApiV2Schema, FsbStaticApiV2SchemaList } from './types';


type Options = {
  baseUrl?: string,
};

const defaultOptions: Options = {
  baseUrl: 'https://api.freestuffbot.xyz/v2', 
};

export class RestApiClient {

  private baseUrl: string;
  private headers: Record<string, string> = {}

  constructor(
    readonly token: string,
    readonly options: Options,
  ) {
    this.baseUrl = options.baseUrl || defaultOptions.baseUrl;
    this.headers['Authorization'] = `Bearer ${token}`;
    this.headers['User-Agent'] = getUa();
    this.headers['Content-Type'] = 'application/json';
    this.headers['X-Set-Compatibility-Date'] = getCompatibility();
  }

  public getPing() {
    return axios({
      method: 'GET',
      headers: this.headers,
      baseURL: this.baseUrl,
      url: '/ping',
    })
  }

  public readonly static = {
    getSchemas() {
      return axios.get<FsbStaticApiV2SchemaList>('/schemas', {
        headers: this.headers,
        baseURL: this.baseUrl,
      })
    },
    getSchema(urn: string) {
      return axios.get<FsbStaticApiV2Schema>(`/schemas/${urn}`, {
        headers: this.headers,
        baseURL: this.baseUrl,
      })
    },
    getProblems() {
      return axios.get<FsbStaticApiV2ProblemList>('/problems', {
        headers: this.headers,
        baseURL: this.baseUrl,
      })
    },
    getEvents() {
      return axios.get<FsbStaticApiV2EventList>('/events', {
        headers: this.headers,
        baseURL: this.baseUrl,
      })
    },
  }

}
