import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { auth } from '../../../../config/auth';

interface Payload {
  sub: string;
}
export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error('Token missing');
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: user_id } = verify(token, auth.secret_token) as Payload;

    req.user = {
      id: user_id,
    };

    next();
  } catch {
    throw new Error('Invalid token');
  }
}