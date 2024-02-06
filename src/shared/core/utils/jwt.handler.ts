import config from '@setup/config';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { NotAuthorizedError } from './errors';

export default function verifyJwt(jwtToken: string): jwt.IJwtPayload {
  const SECRET: string = config.secretKey
  try {
    const decodedData = <jwt.IJwtPayload>jwt.verify(jwtToken, SECRET);
    return decodedData;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw  NotAuthorizedError('Invalid token!');
    } else if (error instanceof JsonWebTokenError) {
      throw  NotAuthorizedError('Invalid token');
    }
    throw error;
  }
}