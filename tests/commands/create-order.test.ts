import Command from '../../src/commands/command';
import { CreateOrder } from '../../src';
import { rest } from 'msw';
import { baseUrl } from '../fixtures/base-url';
import {
  invokerWithApiKey,
  invokerWithInvalidApiKey,
  invokerWithMissingApiKey,
} from '../fixtures/invoker';
import { server } from '../fixtures/server';

describe('create-order.ts', () => {
  it('should be able to instantiated', async () => {
    const command = new CreateOrder();
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
        rest.post(baseUrl('orders'), (_, res, ctx) => {
          return res(ctx.status(401), ctx.json(payload));
        }),
      );

      const command = new CreateOrder();

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
        rest.post(baseUrl('orders'), (_, res, ctx) => {
          return res(ctx.status(400), ctx.json(payload));
        }),
      );

      const command = new CreateOrder();

      const response = await invokerWithInvalidApiKey.send(command);

      expect(response).toEqual(payload);
    });
  });

  describe('when rates found', () => {
    it('should returns list of available rates', async () => {
      const params = {
        origin_contact_name: 'Satrio',
        origin_contact_phone: '08256786543',
        origin_address: 'Jl. sana sini suka',
        origin_area_id: 'IDNP6IDNC147IDND832IDZ10340',

        destination_contact_name: 'Akbar',
        destination_contact_phone: '08125431687',
        destination_address: 'Jl menuju bahagia',
        destination_area_id: 'IDNP10IDNC243IDND2488IDZ56123',

        courier_company: 'jne',
        courier_type: 'reg',
        delivery_type: 'later',
        delivery_date: '2023-08-25',
        delivery_time: '10:00',
        items: [
          {
            name: 'Kaos polos',
            description: 'yeyeye',
            value: 100_000,
            quantity: 1,
            weight: 100,
            height: 10,
            width: 10,
            length: 10,
          },
        ],
      };

      const payload = {
        success: true,
        message: 'Order successfully created',
        object: 'order',
        id: '5dd599ebdefcd4158eb8470b',
        shipper: {
          name: 'Biteship Indonesia',
          email: 'Biteship@gmail.com',
          phone: '08170078120',
          organization: 'Biteship',
        },
        origin: {
          coordinate: {
            latitude: -6.2253114,
            longitude: 106.7993735,
          },
          postal_code: 12440,
          contact_name: 'Akbar',
          address: 'Plaza Senayan, Jalan Asia Afrika, RT.1/RW.3',
          contact_phone: '08170078120',
          note: 'Deket pintu masuk STC',
        },
        destination: {
          coordinate: {
            latitude: -6.28927,
            longitude: 106.77492000000007,
          },
          postal_code: 12950,
          contact_name: 'Bambang',
          contact_phone: '08170032123',
          contact_email: 'mirsa@biteship.com',
          address: 'Lebak Bulus MRT, Jalan R.A.Kartini',
          note: 'Di deket pintu MRT',
        },
        courier: {
          tracking_id: null,
          waybill_id: null,
          company: 'anteraja',
          name: null,
          phone: null,
          type: 'reg',
          link: null,
        },
        items: [
          {
            id: '5db7ee67382e185bd6a14608',
            name: 'Black L',
            image: '',
            description: "Feast/Bangkok'19 Invasion",
            value: 165000,
            quantity: 1,
            height: 1,
            length: 72,
            weight: 200,
            width: 54,
          },
        ],
        price: 48000,
        note: 'Oke saya siap kirim',
        status: 'placed',
      };

      server.use(
        rest.post(baseUrl('orders'), (_, res, ctx) => {
          return res(ctx.json(payload));
        }),
      );

      const command = new CreateOrder(params);

      const response = await invokerWithApiKey.send(command);

      expect(response).toEqual(payload);
    });
  });
});
