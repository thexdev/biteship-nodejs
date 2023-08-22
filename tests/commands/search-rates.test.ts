import Command from '../../src/commands/command';
import { SearchRates } from '../../src';
import { rest } from 'msw';
import { baseUrl } from '../fixtures/base-url';
import {
  invokerWithApiKey,
  invokerWithInvalidApiKey,
  invokerWithMissingApiKey,
} from '../fixtures/invoker';
import { server } from '../fixtures/server';

describe('search-rates.ts', () => {
  it('should be able to instantiated', async () => {
    const command = new SearchRates();
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
        rest.post(baseUrl('rates/couriers'), (_, res, ctx) => {
          return res(ctx.status(401), ctx.json(payload));
        }),
      );

      const command = new SearchRates();

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
        rest.post(baseUrl('rates/couriers'), (_, res, ctx) => {
          return res(ctx.status(400), ctx.json(payload));
        }),
      );

      const command = new SearchRates();

      const response = await invokerWithInvalidApiKey.send(command);

      expect(response).toEqual(payload);
    });
  });

  describe('when rates found', () => {
    it('should returns list of available rates', async () => {
      const params = {
        origin_area_id: 'IDNP6IDNC147IDND832IDZ10340',
        destination_area_id: 'IDNP10IDNC243IDND2488IDZ56123',
        couriers: 'jnt,jne',
        items: [
          {
            name: 'Baju baru',
            description: 'Hehe',
            value: 100_000,
            length: 10,
            width: 10,
            height: 20,
            weigth: 100,
            quantity: 1,
          },
        ],
      };

      const payload = {
        success: true,
        object: 'courier_pricing',
        message: 'Success to retrieve courier pricing',
        code: 20001003,
        origin: {
          location_id: null,
          latitude: null,
          longitude: null,
          postal_code: 10340,
          country_name: 'Indonesia',
          country_code: 'ID',
          administrative_division_level_1_name: 'DKI Jakarta',
          administrative_division_level_1_type: 'province',
          administrative_division_level_2_name: 'Jakarta Pusat',
          administrative_division_level_2_type: 'city',
          administrative_division_level_3_name: 'Menteng',
          administrative_division_level_3_type: 'district',
          administrative_division_level_4_name: 'Kebon Sirih',
          administrative_division_level_4_type: 'subdistrict',
          address: null,
        },
        destination: {
          location_id: null,
          latitude: null,
          longitude: null,
          postal_code: 56123,
          country_name: 'Indonesia',
          country_code: 'ID',
          administrative_division_level_1_name: 'Jawa Tengah',
          administrative_division_level_1_type: 'province',
          administrative_division_level_2_name: 'Magelang',
          administrative_division_level_2_type: 'city',
          administrative_division_level_3_name: 'Magelang Selatan',
          administrative_division_level_3_type: 'district',
          administrative_division_level_4_name: 'Jurangombo Selatan',
          administrative_division_level_4_type: 'subdistrict',
          address: null,
        },
        pricing: [
          {
            available_for_cash_on_delivery: true,
            available_for_proof_of_delivery: false,
            available_for_instant_waybill_id: true,
            available_for_insurance: true,
            company: 'jne',
            courier_name: 'JNE',
            courier_code: 'jne',
            courier_service_name: 'Reguler',
            courier_service_code: 'reg',
            description: 'Layanan reguler',
            duration: '1 - 2 days',
            shipment_duration_range: '1 - 2',
            shipment_duration_unit: 'days',
            service_type: 'standard',
            shipping_type: 'parcel',
            price: 21000,
            type: 'reg',
          },
        ],
      };

      server.use(
        rest.post(baseUrl('rates/couriers'), (_, res, ctx) => {
          return res(ctx.json(payload));
        }),
      );

      const command = new SearchRates(params);

      const response = await invokerWithApiKey.send(command);

      expect(response).toEqual(payload);
    });
  });
});
