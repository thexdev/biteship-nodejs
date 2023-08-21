import { Http } from '../http';
import { ApiKey } from '../types';

abstract class Command {
  protected http: Http = new Http();

  protected extra: Record<string, unknown> = {};

  constructor(extra: Record<string, unknown> = {}) {
    this.extra = extra;
  }

  credential(apiKey: ApiKey): Command {
    this.http.setToken(apiKey);
    return this;
  }

  abstract execute(): Promise<Response>;
}

export = Command;
