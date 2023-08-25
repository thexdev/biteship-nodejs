import Command from './command';

export class RetrieveOrder extends Command {
  execute(): Promise<Response> {
    return this.http.get(`v1/orders/${this.extra.id}`);
  }
}
