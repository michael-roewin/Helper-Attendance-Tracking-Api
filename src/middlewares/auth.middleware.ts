import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const bearerToken = req.header('Authorization');

  const bearerTokenArray = bearerToken?.split(' ') as string[];

  if (!bearerToken || (Array.isArray(bearerTokenArray) && bearerTokenArray[0] !== 'Bearer')) {
    return res.status(401).json({ error: 'Access denied' });
  }

  const token = bearerTokenArray[1];

  try {
    const secretKey = process.env.SECRET_KEY as string;

    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    req.app.set('userId', decoded.userId)
    next();
    } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
 };