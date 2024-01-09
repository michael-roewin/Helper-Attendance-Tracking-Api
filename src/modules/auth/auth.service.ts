import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jsonwebtoken, { Secret } from 'jsonwebtoken';

export const AuthService = {
  login: async (req: Request, res: Response) => {
    const pgPool = req.app.get('pgPool');

    const data = [req.body?.username];

    try {
      const result = await pgPool.query('SELECT id, first_name, last_name, username, password, is_employee, active FROM "hta".users WHERE username = $1', data)

      if (result.rows?.length) {
        const user = result.rows[0];
        const match = await bcrypt.compare(req.body?.password, user.password);

        const secret = process.env.SECRET_KEY as Secret;

        if (match) {
          const token = jsonwebtoken.sign({ userId: user.id }, secret, {
            expiresIn: '1h',
          });

          res.status(200).json({ token });
        }
      } else {
        res.status(401).json({ message: "Incorrect username/password"});
      }
    } catch(e: any) {
      res.status(500).send({ message: e.message });
    }

  },

  forgotPassword: async (req: Request, res: Response) => {
    res.send('forgot password');
  },
};