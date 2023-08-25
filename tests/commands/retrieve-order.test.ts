import { server, rest } from '../fixtures/server';
import Command from '../../src/commands/command';
import { RetrieveOrder } from '../../src';
import { baseUrl } from '../fixtures/base-url';
import {
  invokerWithMissingApiKey,
  invokerWithInvalidApiKey,
  invokerWithApiKey,
} from '../fixtures/invoker';

describe('retrieve-order.ts', () => {
  it('should be able to instantiated', () => {
    const command = new RetrieveOrder();
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
        rest.get(baseUrl('orders/123'), (_, res, ctx) => {
          return res(ctx.status(401), ctx.json(payload));
        }),
      );

      const command = new RetrieveOrder({ id: 123 });

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
        rest.get(baseUrl('orders/123'), (_, res, ctx) => {
          return res(ctx.status(400), ctx.json(payload));
        }),
      );

      const command = new RetrieveOrder({id: 123});

      const response = await invokerWithInvalidApiKey.send(command);

      expect(response).toEqual(payload);
    });
  });

  describe('when order found', () => {
    it('should returns order detail', async () => {
      const payload = {
        success: true,
        message: 'Order successfully retrieved',
        object: 'order',
        id: '5dd599ebdefcd4158eb8470b',
        destination: {
          coordinate: {
            latitude: -6.28927,
            longitude: 106.77492000000007,
          },
          contact_name: 'Mamang',
          contact_phone: '08170032123',
          contact_email: 'mirsa@biteship.com',
          location: 'Lebak Bulus MRT, Jalan R.A.Kartini...',
          postal_code: 12950,
          note: 'Di deket pintu MRT',
        },
        delivery: {
          type: 'later',
          datetime: '2019-09-24T12:00:00+07:00',
          distance: 15.2,
          distance_unit: 'kilometer',
          note: null,
        },
        courier: {
          tracking_id: null,
          waybill_id: null,
          company: 'jne',
          history: [
            {
              service_type: 'reg',
              status: 'placed',
              note: 'Courier order is placed. jne has been notified to pick up',
              updated_at: '2021-01-11T13:44:26+07:00',
            },
            {
              service_type: '-',
              status: 'confirmed',
              note: 'Order has been confirmed. Locating nearest driver to pick up.',
              updated_at: '2021-01-11T14:03:41+07:00',
            },
            {
              service_type: '-',
              status: 'picking_up',
              note: 'Courier is on the way to pick up item.',
              updated_at: '2021-01-11T14:06:35+07:00',
            },
            {
              service_type: '-',
              status: 'picked',
              note: 'Item has been picked and ready to ship.',
              updated_at: '2021-01-11T15:49:25+07:00',
            },
          ],
          link: null,
          name: null,
          phone: null,
          status: null,
          type: 'reg',
        },
        items: [
          {
            id: '5db7ee67382e185bd6a14608',
            name: 'Black L',
            image: 'http://api.biteship.com',
            description: "Feast/Bangkok'19 Invasion",
            value: 165000,
            quantity: 1,
            height: 1,
            length: 72,
            weight: 200,
            width: 54,
          },
          {
            id: '5db7fd6f382e185bd6a1461a',
            name: 'Sticker Pack',
            image: '',
            description: 'Sticker Pack Sun Eater',
            value: 25000,
            quantity: 1,
            height: 1,
            length: 29,
            weight: 50,
            width: 21,
          },
        ],
        note: 'Oke saya siap kirim',
        origin: {
          coordinate: {
            latitude: -6.2253114,
            longitude: 106.7993735,
          },
          contact_name: 'Plaza Senayan',
          address: 'Plaza Senayan, Jalan Asia Afrika...',
          postal_code: 12950,
          contact_phone: '08170078120',
          note: 'Deket pintu masuk STC',
        },
        price: 100000,
        shipper: {
          name: 'Akbar nugraha',
          email: 'akbar.nugraha@biteship.com',
          phone: '08123881021',
          organization: 'Toko Emas',
        },
        status: 'placed',
      };

      server.use(
        rest.get(baseUrl('orders/123'), (_, res, ctx) => {
          return res(ctx.json(payload));
        }),
      );

      const command = new RetrieveOrder({ id: '123' });

      const response = await invokerWithApiKey.send(command);

      expect(response).toEqual(payload);
    });
  });
});
