import Command from './command';

export class RetrieveCourierRates extends Command {
  async execute(): Promise<Response> {
    const response = await this.http.get('v1/couriers');
    return response;
  }
}
