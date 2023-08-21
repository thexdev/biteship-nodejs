import { ApiKey, HTTPMethod } from './types';

/**
 * This class is used to perform http request to Biteship API.
 */
export class Http {
  private url: URL = new URL('https:/api.biteship.com');

  private method: HTTPMethod = 'GET';

  private headers: Headers = new Headers({
    'Content-Type': 'application/json',
  });

  private trim(path: string) {
    return path.replace(/[^a-zA-Z]/g, '');
  }

  private setUrl(url: string) {
    this.url.href = `${this.url.href}${url}`;
    return this;
  }

  private setMethod(method: HTTPMethod): Http {
    this.method = method;
    return this;
  }

  setToken(token: ApiKey): Http {
    this.headers.append('Authorization', token);
    return this;
  }

  private run(): Promise<Response> {
    return fetch(this.url.href, {
      method: this.method,
      headers: this.headers,
    });
  }

  async get(url: string): Promise<Response> {
    const response = await this.setUrl(url).setMethod('GET').run();
    return await response.json();
  }

  async post(url: string) {
    const response = await this.setUrl(this.trim(url)).setMethod('POST').run();
    return await response.json();
  }
}
