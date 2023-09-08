import Command from './command';

export class UpdateOrder extends Command {
  execute(): Promise<Response> {
    return this.http.setBody(this.extra).post(`v1/orders/${this.extra.id}`);
  }
}
