import * as jwt from 'jsonwebtoken';

declare module 'jsonwebtoken' {
  export interface IJwtPayload extends jwt.JwtPayload {
    id: string;
    email?: string;
    name?: string;
  }
}