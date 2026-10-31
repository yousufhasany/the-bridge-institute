import type { AuthUser } from './auth.js';

declare global {
  namespace Express {
    interface Request {
      id: string;
      auth?: AuthUser;
    }
  }
}

export {};
