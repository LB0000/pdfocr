// src/backend/types/express/index.d.ts
import { User } from '../../entities/User';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}
