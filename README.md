# biteship-nodejs

> 🚧 WORKING IN PROGRESS 🚧

`@thexdev/biteship-nodejs` is unofficial NodeJS client for interacting with
[Biteship API](https://biteship.com/en). Since Biteship does not provide package
to interact with their API, I created this simple wrapper for our convenient.
So, instead of calling the API and handle the request manually, we can do
something like this:

```ts
const response = await client.send(new RetrieveArea({ input: "Magelang" }))`;
```
