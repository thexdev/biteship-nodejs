import Command from '../../src/commands/command';
import { RetrieveTracking } from '../../src';
import { rest } from 'msw';
import { baseUrl } from '../fixtures/base-url';
import {
  invokerWithApiKey,
  invokerWithInvalidApiKey,
  invokerWithMissingApiKey,
} from '../fixtures/invoker';
import { server } from '../fixtures/server';

describe('retrieve-tracking.ts', () => {
  it('should be able to instantiated', async () => {
    const command = new RetrieveTracking();
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
        rest.get(baseUrl('trackings/1'), (_, res, ctx) => {
          return res(ctx.status(401), ctx.json(payload));
        }),
      );

      const command = new RetrieveTracking({ id: 1 });

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
        rest.get(baseUrl('trackings/1'), (_, res, ctx) => {
          return res(ctx.status(400), ctx.json(payload));
        }),
      );

      const command = new RetrieveTracking({ id: 1 });

      const response = await invokerWithInvalidApiKey.send(command);

      expect(response).toEqual(payload);
    });
  });

  describe('when tracking found', () => {
    it('should returns list of current tracking histories', async () => {
      const payload = {
        success: true,
        messsage: 'Successfully get tracking info',
        object: 'tracking',
        id: '6051861741a37414e6637fab',
        waybill_id: '0123082100003094',
        courier: {
          company: 'jne',
          name: null,
          phone: null,
        },
        origin: {
          contact_name: '[INSTANT COURIER] BITESHIP/FIE',
          address:
            'JALAN TANJUNG 16 NO.5, RT.8/RW.2, WEST TANJUNG, SOUTH JAKARTA CITY, JAKARTA, IN',
        },
        destination: {
          contact_name: 'ADITARA MADJID',
          address:
            'THE PAKUBUWONO RESIDENCE, JALAN PAKUBUWONO VI, RW.1, GUNUNG, SOUTH JAKARTA CITY',
        },
        history: [
          {
            note: 'SHIPMENT RECEIVED BY JNE COUNTER OFFICER AT [JAKARTA]',
            updated_at: '2021-03-16T18:17:00+07:00',
            status: 'dropping_off',
          },
          {
            note: 'RECEIVED AT SORTING CENTER [JAKARTA]',
            updated_at: '2021-03-16T21:15:00+07:00',
            status: 'dropping_off',
          },
          {
            note: 'SHIPMENT FORWARDED TO DESTINATION [JAKARTA , HUB VETERAN BINTARO]',
            updated_at: '2021-03-16T23:12:00+07:00',
            status: 'dropping_off',
          },
          {
            note: 'RECEIVED AT INBOUND STATION [JAKARTA , HUB VETERAN BINTARO]',
            updated_at: '2021-03-16T23:43:00+07:00',
            status: 'dropping_off',
          },
          {
            note: 'WITH DELIVERY COURIER [JAKARTA , HUB VETERAN BINTARO]',
            updated_at: '2021-03-17T09:29:00+07:00',
            status: 'dropping_off',
          },
          {
            note: 'DELIVERED TO [ainul yakin | 17-03-2021 11:15 | JAKARTA ]',
            updated_at: '2021-03-17T11:15:00+07:00',
            status: 'delivered',
          },
        ],
        link: '-',
        order_id: '6251863341sa3714e6637fab',
        status: 'delivered',
      };

      const params = {
        id: 1,
      };

      server.use(
        rest.get(baseUrl('trackings/1'), (_, res, ctx) => {
          return res(ctx.json(payload));
        }),
      );

      const command = new RetrieveTracking(params);

      const response = await invokerWithApiKey.send(command);

      expect(response).toEqual(payload);
    });
  });
});
