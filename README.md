# biteship-nodejs

> 🚧 WORKING IN PROGRESS 🚧

`@thexdev/biteship-nodejs` is unofficial NodeJS client for interacting with
[Biteship API](https://biteship.com/en). Since Biteship does not provide package
to interact with their API so, I created this simple wrapper for our convenient.
Enjoy! 🚀 🚚

## Getting Started

Before we go, let's ensure you are ready. First, you
must ensure your node version is `^18.x` because this package is internally use
[Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers?retiredLocale=id)
object. After that, please [setup your Biteship API Key](https://biteship.com/en/docs/intro).
Finish? Then, we are ready to go.

## Installation

The installation is simple! Just run this command.

```bash
npm i @thexdev/biteship-node
```

## How to Use

> 💡 You can also find useful example [here](https://github.com/thexdev/biteship-nodejs/tree/main/examples).

We need to use the `Biteship` and command class to perform a specific task. For
example if we want to search some areas we can use the `RetreiveArea` command.

```js
// Using TypeScript
import { Biteship, RetreiveArea } from '@thexdev/biteship-nodejs';

// or using CommonJS
const { Biteship, RetrieveArea } = require('@thexdev/biteship-nodejs');

const biteship = new Biteship(process.env.BITESHIP_API_KEY);

biteship.send(new RetriveArea({ input: 'Jakarta' })).then(console.log);
// See the example result: https://biteship.com/en/docs/api/maps/retrieve_area_single
```

I though this way looks better instead of calling the raw API using `fetch` or
`axios` and handle each request manually 😅. For the command arguments, you can
find it all on Biteship official documentation.

## List of Commands

- `CreateOrder`
- `RetrieveArea`
- `RetrieveCourierRates`
- `RetrieveOrder`
- `SearchRates`
- More commands (soon)

## Want to Support Me?

All your support is much appreciated 🙏

- [Buy Me Coffee](https://www.buymeacoffee.com/thexdev)
