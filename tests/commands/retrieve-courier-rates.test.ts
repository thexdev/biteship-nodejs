import { server, rest } from '../fixtures/server';
import Command from '../../src/commands/command';
import { RetrieveCourierRates } from '../../src/commands/retrieve-courier-rates';
import { baseUrl } from '../fixtures/base-url';
import {
  invokerWithApiKey,
  invokerWithInvalidApiKey,
  invokerWithMissingApiKey,
} from '../fixtures/invoker';

describe('retrieve-courier-rates.ts', () => {
  it('should be able to instantiated', () => {
    const command = new RetrieveCourierRates();
    expect(command).toBeInstanceOf(Command);
  });

  describe('when API_KEY is not provided', () => {
    it('should returns authorization failure', async () => {
      const payload = {
        success: true,
        error: 'Authorization failed',
        code: 40101001,
      };

      server.use(
        rest.get(baseUrl('couriers'), (_, res, ctx) => {
          return res(ctx.status(401), ctx.json(payload));
        }),
      );

      const command = new RetrieveCourierRates();

      const response = await invokerWithMissingApiKey.send(command);

      expect(response).toEqual(payload);
    });
  });

  describe('when API_KEY is invalid', () => {
    it('should return invalid api key warnings', async () => {
      const payload = {
        success: false,
        error:
          'Authentication for your key is failed. Please make sure input the right key or contact info@biteship.com for more information.',
        code: 40000001,
      };

      server.use(
        rest.get(baseUrl('couriers'), (_, res, ctx) => {
          return res(ctx.status(400), ctx.json(payload));
        }),
      );

      const command = new RetrieveCourierRates();

      const response = await invokerWithInvalidApiKey.send(command);

      expect(response).toEqual(payload);
    });
  });

  describe('when couriers found', () => {
    it('should returns list of available couriers', async () => {
      const payload = {
        success: true,
        object: 'courier',
        couriers: [
          {
            available_for_cash_on_delivery: false,
            available_for_proof_of_delivery: false,
            available_for_instant_waybill_id: true,
            courier_name: 'Gojek',
            courier_code: 'gojek',
            courier_service_name: 'Instant',
            courier_service_code: 'instant',
            tier: 'premium',
            description: 'On Demand Instant (bike)',
            service_type: 'same_day',
            shipping_type: 'parcel',
            shipment_duration_range: '1 - 3',
            shipment_duration_unit: 'hours',
          },
        ],
      };

      server.use(
        rest.get(baseUrl('couriers'), (_, res, ctx) => {
          return res(ctx.json(payload));
        }),
      );

      const command = new RetrieveCourierRates();

      const response = await invokerWithApiKey.send(command);

      expect(response).toEqual(payload);
    });
  });
});
