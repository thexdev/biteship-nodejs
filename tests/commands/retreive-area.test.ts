import { server, rest } from '../fixtures/server';
import Command from '../../src/commands/command';
import RetrieveArea from '../../src/commands/retrieve-area';
import { baseUrl } from '../fixtures/base-url';

describe('retrieve-area.ts', () => {
  it('should be able to instantiated', () => {
    const command = new RetrieveArea();
    expect(command).toBeInstanceOf(Command);
  });

  describe('when `input` keyword is not given or areas not found', () => {
    it('should returns empty `areas`', async () => {
      const handler = rest.get(baseUrl('maps/areas'), (_, res, ctx) => {
        return res(ctx.json({ success: true, areas: [] }));
      });

      server.use(handler);

      const command = new RetrieveArea();
      const response = await command.credential('fake_api_key').execute();

      expect(response).toEqual({ success: true, areas: [] });
    });
  });

  describe('when `input` keyword given and areas found', () => {
    it('should returns array of match `areas`', async () => {
      const json = {
        id: 'IDNP10IDNC243IDND2489IDZ56111',
        name: 'Magelang Tengah, Magelang, Jawa Tengah. 56111',
        country_name: 'Indonesia',
        country_code: 'ID',
        administrative_division_level_1_name: 'Jawa Tengah',
        administrative_division_level_1_type: 'province',
        administrative_division_level_2_name: 'Magelang',
        administrative_division_level_2_type: 'city',
        administrative_division_level_3_name: 'Magelang Tengah',
        administrative_division_level_3_type: 'district',
        postal_code: 56111,
      };

      const handler = rest.get(baseUrl('maps/areas'), (_, res, ctx) => {
        return res(ctx.json(json));
      });

      server.use(handler);

      const command = new RetrieveArea();
      const response = await command.credential('fake_api_key').execute();

      expect(response).toEqual(json);
    });
  });
});
