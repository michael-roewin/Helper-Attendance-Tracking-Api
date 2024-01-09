import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { FieldValidationError, ValidationError, validationResult } from 'express-validator';

const hasErrors = (req: Request, res: Response) => {
  const validationRes = validationResult(req);

  if (!validationRes.isEmpty()) {
    const errors = validationRes.array() as FieldValidationError[];

    const errorResponse = errors.reduce((accum, field) => {
      accum[field.path] = field.msg;
      return accum
    }, {} as { [index: string]: string});

      res.status(422).json(errorResponse);
      return true;
  }
}

export const UsersController: any = {
  getUserList: async (req: Request, res: Response) => {
    UsersService.getUserList(req, res);
  },

  getUser: (req: Request, res: Response) => {
    const validationRes = validationResult(req);

    if (!validationRes.isEmpty()) {
      return res.status(404).json({ message: 'User not found'});
    }

    UsersService.getUser(req, res);
  },

  createUser: (req: Request, res: Response) => {
    if (hasErrors(req, res)) {
      return;
    }

    UsersService.createUser(req, res);
  },

  updateUser: (req: Request, res: Response) => {
    if (hasErrors(req, res)) {
      return;
    }

    UsersService.updateUser(req, res);
  },

  deleteUser: (req: Request, res: Response) => {
    const validationRes = validationResult(req);

    if (!validationRes.isEmpty()) {
      return res.status(404).json({ message: 'User not found'});
    }

    UsersService.deleteUser(req, res);
  },
};