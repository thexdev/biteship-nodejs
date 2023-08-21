import { Biteship } from '../src';

describe('biteship.ts', () => {
  it('should be able to instantiated', () => {
    const client = new Biteship('fake_api_key');
    expect(client).toBeInstanceOf(Biteship);
  });
});
