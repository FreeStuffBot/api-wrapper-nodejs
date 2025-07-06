import { getCompatibility, getUa } from './const' with { type: 'macro' };

import axios, { AxiosInstance } from 'axios';
import { Problem } from './problem';
import { FsbStaticApiV2EventList, FsbStaticApiV2ProblemList, FsbStaticApiV2Schema, FsbStaticApiV2SchemaList } from './types';


type Options = {
  baseUrl?: string,
};

const defaultOptions: Options = {
  baseUrl: 'https://api.freestuffbot.xyz/v2', 
};

function handleError(err: any): never {
  if (!axios.isAxiosError(err)) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error('An unknown error occurred', { cause: err });
  }

  if (err.response) {
    console.error('API Error:', err.response.status, err.response.data);
    if (err.response.data
      && typeof err.response.data === 'object'
      && err.response.data.type
      && String(err.response.data.type).startsWith('fsb:problem:')
    ) {
      throw new Problem(err.response.data as Record<string, unknown>);
    }
    throw new Problem({
      type: 'fsb:problem:internal:api_error',
      title: 'API Error',
      detail: `Received an error response from the API: ${err.response.status} - ${err.response.statusText}`,
      raw: err.response.data,
    });
  } else if (err.request) {
    throw new Problem({
      type: 'fsb:problem:internal:request_failed',
      title: 'Request Failed',
      detail: `No response received from the server. Request details: ${JSON.stringify(err.request)}`,
    });
  } else {
    throw new Problem({
      type: 'fsb:problem:internal:request_setup_failed',
      title: 'Request Setup Failed',
      detail: `An error occurred while setting up the request: ${err.message}`,
    });
  }
}

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
    return this.client
      .get('/ping')
      .then(res => res.data)
      .catch(handleError)
  }

  public readonly static = {
    getSchemas: () => this.client
      .get<FsbStaticApiV2SchemaList>('/static/schemas')
      .then(res => res.data)
      .catch(handleError),
    getSchema: (urn: string) => this.client
      .get<FsbStaticApiV2Schema>(`/static/schemas/${urn}`)
      .then(res => res.data)
      .catch(handleError),
    getProblems: () => this.client
      .get<FsbStaticApiV2ProblemList>('/static/problems')
      .then(res => res.data)
      .catch(handleError),
    getEvents: () => this.client
      .get<FsbStaticApiV2EventList>('/static/events')
      .then(res => res.data)
      .catch(handleError),
  }

}
