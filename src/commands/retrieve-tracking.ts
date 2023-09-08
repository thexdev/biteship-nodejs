import Command from './command';

export class RetrieveTracking extends Command {
  execute(): Promise<Response> {
    return this.http.get(`v1/trackings/${this.extra.id}`);
  }
}
