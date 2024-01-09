import { Request, Response } from 'express';
import { LeavesService } from './leaves.service';
import { FieldValidationError, validationResult } from 'express-validator';

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

export const LeavesController: any = {
  getLeaveList: async (req: Request, res: Response) => {
    LeavesService.getLeaveList(req, res);
  },

  getLeave: (req: Request, res: Response) => {
    const validationRes = validationResult(req);

    if (!validationRes.isEmpty()) {
      return res.status(404).json({ message: 'Leave not found'});
    }

    LeavesService.getLeave(req, res);
  },

  createLeave: (req: Request, res: Response) => {
    if (hasErrors(req, res)) {
      return;
    }

    LeavesService.createLeave(req, res);
  },

  updateLeave: (req: Request, res: Response) => {
    if (hasErrors(req, res)) {
      return;
    }

    LeavesService.updateLeave(req, res);
  },

  deleteLeave: (req: Request, res: Response) => {
    const validationRes = validationResult(req);

    if (!validationRes.isEmpty()) {
      return res.status(404).json({ message: 'Leave not found'});
    }

    LeavesService.deleteLeave(req, res);
  },
};