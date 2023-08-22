import Command from './command';

export class SearchRates extends Command {
  execute(): Promise<Response> {
    return this.http.setBody(this.extra).post('v1/rates/couriers');
  }
}
