import Command from './commands/command';
import { ApiKey } from './types';

class Biteship {
  protected apiKey: ApiKey;

  constructor(apiKey: ApiKey) {
    this.apiKey = apiKey;
  }

  send(command: Command) {
    return command.credential(this.apiKey).execute();
  }
}

export default Biteship;
