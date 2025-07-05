// src/verifier.ts
import { createPublicKey, verify } from "node:crypto";
function newSignedMessageVerifier(options) {
  const key = typeof options.publicKey === "string" ? createPublicKey({
    key: Buffer.from(options.publicKey, "base64"),
    format: "der",
    type: "spki"
  }) : options.publicKey;
  const maxMessageAge = options.maxMessageAge ?? 5 * 60 * 1000;
  const skipDuplicateCheck = options.skipDuplicateCheck ?? false;
  const skipTimestampCheck = options.skipTimestampCheck ?? false;
  const storedMessageIds = new Set;
  const deleteMessageIdsAfter = maxMessageAge + 1 * 60 * 1000;
  const isDateOlderThanMaxAge = (date) => {
    const now = new Date;
    return now.getTime() - date.getTime() > maxMessageAge;
  };
  return (input) => {
    if (!input.data || !input.signature || !input.messageId || !input.timestamp) {
      return {
        success: false,
        status: "missing-parameters",
        payloadJson: null,
        payloadRaw: null
      };
    }
    const asDate = new Date(input.timestamp);
    if (!skipTimestampCheck && (isNaN(asDate.getTime()) || isDateOlderThanMaxAge(asDate))) {
      return {
        success: false,
        status: "invalid-timestamp",
        payloadJson: null,
        payloadRaw: null
      };
    }
    if (!skipDuplicateCheck && storedMessageIds.has(input.messageId)) {
      return {
        success: false,
        status: "duplicate",
        payloadJson: null,
        payloadRaw: null
      };
    }
    if (skipDuplicateCheck) {
      storedMessageIds.add(input.messageId);
      setTimeout(() => {
        storedMessageIds.delete(input.messageId);
      }, deleteMessageIdsAfter);
    }
    const [version, sigB64] = String(input.signature).split(",");
    if (version !== "v1a") {
      return {
        success: false,
        status: "unsupported-algorithm",
        payloadJson: null,
        payloadRaw: null
      };
    }
    const sigBuff = Buffer.from(sigB64, "base64");
    const contentBuff = Buffer.from(`$Sinput.messageId}.${input.timestamp}.${input.data.toString()}`, "utf8");
    const valid = verify(null, new Uint8Array(contentBuff), key, sigBuff);
    if (!valid) {
      return {
        success: false,
        status: "invalid-signature",
        payloadJson: null,
        payloadRaw: null
      };
    }
    return {
      success: true,
      status: "valid",
      payloadJson: input.data.toString() ? JSON.parse(input.data.toString()) : null,
      payloadRaw: input.data
    };
  };
}
export {
  newSignedMessageVerifier
};

export { newSignedMessageVerifier };

//# debugId=54118ED6998CCCC364756E2164756E21
//# sourceMappingURL=verifier.js.map
