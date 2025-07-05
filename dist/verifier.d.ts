import { type KeyObject } from 'node:crypto';
export type VerifierOptions = {
    /** the public key to verify the message payload against */
    publicKey: string | KeyObject;
    /** controls the timestamp check and for how long messageIds are stored */
    maxMessageAge?: number;
    /** skip storing and comparing messageIds for replay attacks, not recommended */
    skipDuplicateCheck?: boolean;
    /** skip checking the timestamp for dates in the past, not recommended */
    skipTimestampCheck?: boolean;
};
export type VerificationInput = {
    /** the raw message body as a buffer (http body, **not parsed**) */
    data: Buffer;
    /** the payload signature (webhook-signature header) */
    signature: string;
    /** the message id (webhook-id header) */
    messageId: string;
    /** the string timestamp of this message's delivery (webhook-timestamp header) */
    timestamp: string;
};
export type VerificationStatus = 'valid'
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
    success: true;
    status: 'valid';
    payloadJson: Record<string, unknown> | null;
    payloadRaw: Buffer;
} | {
    success: false;
    status: Omit<VerificationStatus, 'valid'>;
    payloadJson: null;
    payloadRaw: null;
};
export type SignedMessageVerifier = (input: VerificationInput) => VerificationOutput;
export declare function newSignedMessageVerifier(options: VerifierOptions): (input: VerificationInput) => VerificationOutput;
