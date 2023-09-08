import Command from '../../src/commands/command';
import { DeleteOrder } from '../../src';
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
    const command = new DeleteOrder();
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
        rest.delete(baseUrl('orders/1'), (_, res, ctx) => {
          return res(ctx.status(401), ctx.json(payload));
        }),
      );

      const command = new DeleteOrder({ id: 1 });

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
        rest.delete(baseUrl('orders/1'), (_, res, ctx) => {
          return res(ctx.status(400), ctx.json(payload));
        }),
      );

      const command = new DeleteOrder({ id: 1 });

      const response = await invokerWithInvalidApiKey.send(command);

      expect(response).toEqual(payload);
    });
  });

  describe('when order successfully deleted', () => {
    it('should returns 200 OK', async () => {
      const payload = {
        success: true,
        message: 'Order successfully deleted',
        object: 'order',
        id: '5dd5a396248481164a225af4',
        status: 'cancelled',
        cancellation_reason: 'Ingin mengganti kurir',
      };

      server.use(
        rest.delete(baseUrl('orders/1'), (_, res, ctx) => {
          return res(ctx.status(200), ctx.json(payload));
        }),
      );

      const command = new DeleteOrder({
        id: 1,
        cancelllation_reason: 'Ingin mengganti kurir',
      });

      const response = await invokerWithApiKey.send(command);

      expect(response).toEqual(payload);
    });
  });
});
