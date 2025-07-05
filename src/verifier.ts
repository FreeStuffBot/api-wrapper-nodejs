import { createPublicKey, verify, type KeyObject } from 'node:crypto';
import { parseEpochTimestamp } from './parser'


export type VerifierOptions = {
  /** the public key to verify the message payload against */
  publicKey: string | KeyObject
  /** controls the timestamp check and for how long messageIds are stored */
  maxMessageAge?: number
  /** skip storing and comparing messageIds for replay attacks, not recommended */
  skipDuplicateCheck?: boolean
  /** skip checking the timestamp for dates in the past, not recommended */
  skipTimestampCheck?: boolean
};

export type VerificationInput = {
  /** the raw message body as a buffer (http body, **not parsed**) */
  data: Buffer,
  /** the payload signature (webhook-signature header) */
  signature: string,
  /** the message id (webhook-id header) */
  messageId: string,
  /** the string timestamp of this message's delivery (webhook-timestamp header) */
  timestamp: string,
};

export type VerificationStatus
  /** the input was verified and is valid */
  = 'valid'
  /** some of the input parameters are missing */
  | 'missing-parameters'
  /** the signature was not matching the input */
  | 'invalid-signature'
  /** the timestamp was invalid, e.g. too old */
  | 'invalid-timestamp'
  /** the signature was created using an unsupported algorithm */
  | 'unsupported-algorithm'
  /** this message has already been received before */
  | 'duplicate';

export type VerificationOutput = {
  success: true
  status: 'valid'
  payloadJson: Record<string, unknown> | null
  payloadRaw: Buffer
} | {
  success: false
  status: Omit<VerificationStatus, 'valid'>
  payloadJson: null
  payloadRaw: null
};

export type SignedMessageVerifier = (input: VerificationInput) => VerificationOutput;

export function newSignedMessageVerifier(options: VerifierOptions) {
  const key = (typeof options.publicKey === 'string')
    ? createPublicKey({
      key: Buffer.from(options.publicKey, 'base64'),
      format: 'der',
      type: 'spki',
    })
    : options.publicKey;

  const maxMessageAge = options.maxMessageAge ?? 5 * 60 * 1000; // default to 5 minutes
  const skipDuplicateCheck = options.skipDuplicateCheck ?? false;
  const skipTimestampCheck = options.skipTimestampCheck ?? false;

  const storedMessageIds: Set<string> = new Set();
  const deleteMessageIdsAfter = maxMessageAge + 1 * 60 * 1000; // keep for 1 minute longer to be sure

  const isDateOlderThanMaxAge = (date: Date): boolean => {
    const now = new Date();
    return (now.getTime() - date.getTime()) > maxMessageAge;
  };

  return (input: VerificationInput): VerificationOutput => {
    if (!input.data || !input.signature || !input.messageId || !input.timestamp) {
      return {
        success: false,
        status: 'missing-parameters',
        payloadJson: null,
        payloadRaw: null,
      };
    }

    const asDate = parseEpochTimestamp(input.timestamp);
    if (!skipTimestampCheck && (!asDate || isNaN(asDate.getTime()) || isDateOlderThanMaxAge(asDate))) {
      return {
        success: false,
        status: 'invalid-timestamp',
        payloadJson: null,
        payloadRaw: null,
      };
    }

    if (!skipDuplicateCheck && storedMessageIds.has(input.messageId)) {
      return {
        success: false,
        status: 'duplicate',
        payloadJson: null,
        payloadRaw: null,
      };
    }

    if (skipDuplicateCheck) {
      storedMessageIds.add(input.messageId);
      setTimeout(() => {
        storedMessageIds.delete(input.messageId);
      }, deleteMessageIdsAfter);
    }

    const [version, sigB64] = String(input.signature).split(',');
    if (version !== 'v1a') {
      return {
        success: false,
        status: 'unsupported-algorithm',
        payloadJson: null,
        payloadRaw: null,
      };
    }

    const sigBuff = Buffer.from(sigB64!, 'base64');
    const contentBuff = Buffer.from(`$Sinput.messageId}.${input.timestamp}.${input.data.toString()}`, 'utf8');

    const valid = verify(null, new Uint8Array(contentBuff), key, sigBuff);
    if (!valid) {
      return {
        success: false,
        status: 'invalid-signature',
        payloadJson: null,
        payloadRaw: null,
      };
    }

    return {
      success: true,
      status: 'valid',
      payloadJson: input.data.toString()
        ? JSON.parse(input.data.toString())
        : null,
      payloadRaw: input.data,
    }
  };
}
