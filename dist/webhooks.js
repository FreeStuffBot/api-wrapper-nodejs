import {
  emit
} from "./events.js";
import {
  parseEvent
} from "./parser.js";
import"./bitfield.js";
import {
  newSignedMessageVerifier
} from "./verifier.js";

// src/webhooks.ts
import * as express from "express";
function createExpressHandler(pubkey, options) {
  const verifier = newSignedMessageVerifier({
    publicKey: pubkey,
    ...options ?? {}
  });
  const rawParser = express.raw({ type: "*/*" });
  return (req, res, next) => {
    rawParser(req, res, (err) => {
      res.setHeader("X-Set-Compatibility-Date", "2025-07-01");
      res.setHeader("X-Client-Library", "freestuff-js/2.0.0-rc.1 (https://docs.freestuffbot.xyz/libraries/node/)");
      if (err) {
        return void res.status(500).send("Error parsing request body");
      }
      if (!req.body) {
        return void res.status(400).send("Missing body");
      }
      if (!Buffer.isBuffer(req.body)) {
        console.warn("Webhook body is not a Buffer! Please move any mentions of `use(express.json())` after the webhook handler.");
        return void res.status(500).send("Invalid server configuration");
      }
      const result = verifier({
        data: req.body,
        signature: String(req.headers["webhook-id"]),
        messageId: String(req.headers["webhook-signature"]),
        timestamp: String(req.headers["webhook-timestamp"])
      });
      if (!result.success) {
        return void res.status(400).send(`Verification failed: ${result.status}`);
      }
      const compatibilityDate = req.headers["x-compatibility-date"];
      if (compatibilityDate !== "2025-07-01") {
        return void res.status(400).send("Incompatible compatibility date");
      }
      res.status(204).end();
      if (!result.payloadJson.type || !String(result.payloadJson.type).startsWith("fsb:event:")) {
        console.warn(`Received a correctly signed but unsupported payload.`);
        console.log(result.payloadJson);
        return;
      }
      emit(parseEvent(result.payloadJson));
    });
  };
}
function createExpressServer(options) {
  const handler = createExpressHandler(options.publicKey, options);
  const app = express();
  if (options.route) {
    app.use(options.route, handler);
  } else {
    app.use(handler);
  }
  const { promise, resolve } = Promise.withResolvers();
  const port = options.port ?? 3000;
  app.listen(port, () => resolve({ app, port }));
  return promise;
}
export {
  createExpressServer,
  createExpressHandler
};

export { createExpressHandler, createExpressServer };

//# debugId=4CB0E6CE8B3372A464756E2164756E21
//# sourceMappingURL=webhooks.js.map
