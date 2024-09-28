import { z } from 'zod';

export const SessionID = z.string().uuid().brand('SessionID')
export type SessionID = z.infer<typeof SessionID>