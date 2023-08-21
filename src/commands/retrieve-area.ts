import Command from './command';

class RetriveArea extends Command {
  execute(): Promise<Response> {
    const query = new URLSearchParams({
      countries: 'ID',
      input: String(this.extra.input),
      type: 'single',
    });

    return this.http.get(`v1/maps/areas?${query.toString()}`);
  }
}

export = RetriveArea;
