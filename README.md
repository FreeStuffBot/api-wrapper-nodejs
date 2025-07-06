# FreeStuff API Wrapper

This is the official Node+Bun API wrapper for the FreeStuff API. For more information see https://docs.freestuffbot.xyz/

## Install

```bash
npm install freestuff
```

or

```bash
bun install freestuff
```

## How to use

Start a simple express server to receive webhooks

```ts
import { createExpressServer, on } from 'freestuff';

on('fsb:event:ping', event => {
  console.log(ping);
});

createExpressServer({ publicKey: 'YOUR PUBLIC KEY HERE' })
  .then(({ port }) => console.log(`Server is running on port ${port}`));
```

Or add to an existing express server

```ts
import express from 'express';
import { createExpressHandler, on } from 'freestuff';

on('fsb:event:ping', event => {
  console.log(event);
});

const app = express();
app.use('/api/freestuff-webhook-route', createExpressHandler('YOUR PUBLIC KEY HERE'));
app.listen(3000);
```

Or verify webhooks manually for use with other frameworks

```ts
import { newSignedMessageVerifier } from 'freestuff';

const verify = newSignedMessageVerifier({
  publicKey: 'YOUR PUBLIC KEY HERE',
  maxMessageAge: 1000 * 60 * 5
});

const { success, status, payloadJson } = verify({
  data: Buffer.from('...'),
  signature: '...',
  messageId: '...',
  timestamp: '...'
});
```

Or use the rest api client for typed responses, problem parsing and automatic compatibility dates

```ts
import { Problem, RestApiClient } from 'freestuff';

const client = new RestApiClient('fsb_api_token_here');

client.static.getSchemas()
  .then(({ list }) => console.log(list))
  .catch(err => {
    if (err instanceof Problem)
      console.log(err.message, err.detail);
  }),
```
