import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from './auth.service';

export const AuthController = {
  login: async (req: Request, res: Response) => {
    const validationRes = validationResult(req);

    if (!validationRes.isEmpty()) {
      return res.status(401).json({ message: 'Incorrect username/password'});
    }

    AuthService.login(req, res);
  },

  forgotPassword: (req: Request, res: Response) => {
    AuthService.forgotPassword(req, res);
  }
};