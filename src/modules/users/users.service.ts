import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../../entities/user';
import { FilterQuery, MikroORM } from '@mikro-orm/postgresql';
const saltRounds = 10;

export const UsersService = {
  getUserList: async (req: Request, res: Response) => {
    const orm: MikroORM = req.app.get('orm');

    try {
      const users = await orm.em.findAll(User, {
        fields: ['id', 'firstName', 'lastName', 'username', 'active', 'createdAt', 'updatedAt'],
      });

      res.json(users);
    } catch(e: any) {
      console.log(e);
      res.status(500).send({ message: e.message });
    }
  },

  getUser: async (req: Request, res: Response) => {
    const orm: MikroORM = req.app.get('orm');

    const userId = req.params.userId as FilterQuery<User>;

    try {
      const user = await orm.em.findOne(User, userId, {
        fields: ['id', 'firstName', 'lastName', 'username', 'active', 'createdAt', 'updatedAt'],
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found'});
      }

      res.json(user);
      return;
    } catch(e: any) {
      console.log(e);
      return res.status(500).send({ message: e.message });
    }
  },

  createUser: async (req: Request, res: Response) => {
    const orm: MikroORM = req.app.get('orm');

    const { firstName, lastName, username, password, active } = req.body;

    const hash = await bcrypt.hash(password, saltRounds);

    const userExists = await orm.em.findOne(User, {
      username,
    }, {
      fields: ['id'],
    });

    if (userExists) {
      return res.status(409).json({ 'message': 'Username already in use.'});
    }

    try {
      const user = new User();

      user.firstName = firstName;
      user.lastName = lastName;
      user.username = username;
      user.password = hash;
      user.isEmployee = false;
      user.active = active || true;

      await orm.em.persist(user).flush();

      return res.status(201).json(user);
    } catch (e: any) {
      return res.status(500).send({ message: e.message });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    const orm: MikroORM = req.app.get('orm');

    const userId = req.params.userId as FilterQuery<User>;

    const { firstName, lastName, username, password, active } = req.body;

    const user = await orm.em.findOne(User, userId);

    if (!user) {
      return res.status(404).json({ 'message': 'User not found.'})
    }

    const userExists = await orm.em.findOne(User, {
      username,
      id: { $ne: Number(req.params.userId) }
    }, {
      fields: ['id'],
    });

    if (userExists) {
      return res.status(409).json({ 'message': 'Username already in use.'});
    }

    try {
      user.firstName = firstName;
      user.lastName = lastName;
      user.username = username;
      if (password) {
        const hash = await bcrypt.hash(password, saltRounds);
        user.password = hash;
      }
      user.active = active || true;

      await orm.em.flush();

      res.status(201).json(user);
    } catch (e: any) {
      res.status(500).send({ message: e.message });
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    const orm: MikroORM = req.app.get('orm');

    const userId = Number(req.params.userId);

    const user = orm.em.getReference(User, userId);
    await orm.em.remove(user).flush();

    res.status(200).json({});
  },
}