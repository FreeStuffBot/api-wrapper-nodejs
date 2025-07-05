import type { Request, Response, NextFunction } from 'express';
import type { KeyObject } from 'node:crypto';
import { type VerifierOptions } from './verifier';
/** Add freestuff webhooks to any existing express app */
export declare function createExpressHandler(pubkey: string | KeyObject, options?: Partial<Omit<VerifierOptions, 'publicKey'>>): (req: Request, res: Response, next: NextFunction) => void;
/** Let us create an express server for you and already register everything you need. */
export declare function createExpressServer(options: VerifierOptions & {
    port?: number;
    route?: string;
}): Promise<{
    app: import("express-serve-static-core").Express;
    port: number;
}>;
