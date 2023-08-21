import { Biteship } from '../../src/biteship';

//@ts-ignore
export const invokerWithMissingApiKey = new Biteship();

export const invokerWithApiKey = new Biteship('example_valid_api_key');

export const invokerWithInvalidApiKey = new Biteship('example_invalid_api');
