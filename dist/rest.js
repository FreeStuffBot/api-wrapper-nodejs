// src/rest.ts
import axios from "axios";
var defaultOptions = {
  baseUrl: "https://api.freestuffbot.xyz/v2"
};

class RestApiClient {
  token;
  options;
  baseUrl;
  headers = {};
  constructor(token, options) {
    this.token = token;
    this.options = options;
    this.baseUrl = options.baseUrl || defaultOptions.baseUrl;
    this.headers["Authorization"] = `Bearer ${token}`;
    this.headers["User-Agent"] = "freestuff-js/2.0.0-rc.1 (https://docs.freestuffbot.xyz/libraries/node/)";
    this.headers["Content-Type"] = "application/json";
    this.headers["X-Set-Compatibility-Date"] = "2025-07-01";
  }
  getPing() {
    return axios({
      method: "GET",
      headers: this.headers,
      baseURL: this.baseUrl,
      url: "/ping"
    });
  }
  static = {
    getSchemas() {
      return axios.get("/schemas", {
        headers: this.headers,
        baseURL: this.baseUrl
      });
    },
    getSchema(urn) {
      return axios.get(`/schemas/${urn}`, {
        headers: this.headers,
        baseURL: this.baseUrl
      });
    },
    getProblems() {
      return axios.get("/problems", {
        headers: this.headers,
        baseURL: this.baseUrl
      });
    },
    getEvents() {
      return axios.get("/events", {
        headers: this.headers,
        baseURL: this.baseUrl
      });
    }
  };
}
export {
  RestApiClient
};

export { RestApiClient };

//# debugId=489828091226187464756E2164756E21
//# sourceMappingURL=rest.js.map
