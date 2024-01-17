import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jsonwebtoken, { Secret } from 'jsonwebtoken';
import { MikroORM } from '@mikro-orm/postgresql';
import { User } from '../../entities/user';

export const AuthService = {
  login: async (req: Request, res: Response) => {
    const orm: MikroORM = req.app.get('orm');

    try {
      const user = await orm.em.findOne(User, {
        username: req.body?.username
      });

      if (!user) {
        return res.status(404).json({ message: 'Incorrect username/password'});
      }

      const match = await bcrypt.compare(req.body?.password, user.password);

      const secret = process.env.SECRET_KEY as Secret;

      if (match) {
        const token = jsonwebtoken.sign({ userId: user.id }, secret, {
          expiresIn: '1h',
        });

        delete (user as any).password;

        res.status(200).json({ user, token });
      }
    } catch(e: any) {
      res.status(500).send({ message: e.message });
    }

  },

  forgotPassword: async (req: Request, res: Response) => {
    res.send('forgot password');
  },
};