import Command from './command';

export class DeleteOrder extends Command {
  execute(): Promise<Response> {
    return this.http
      .setBody({
        cancellation_reason: this.extra.cancellation_reason,
      })
      .delete(`v1/orders/${this.extra.id}`);
  }
}
