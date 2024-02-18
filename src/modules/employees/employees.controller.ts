import { Request, Response } from 'express';
import { EmployeesService } from './employees.service';
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

export const EmployeesController: any = {
  getEmployeeList: async (req: Request, res: Response) => {
    EmployeesService.getEmployeeList(req, res);
  },

  getEmployee: (req: Request, res: Response) => {
    const validationRes = validationResult(req);

    if (!validationRes.isEmpty()) {
      return res.status(404).json({ message: 'Employee not found'});
    }

    EmployeesService.getEmployee(req, res);
  },

  getEmployeeSalaryReport: (req: Request, res: Response) => {
    const validationRes = validationResult(req);

    if (!validationRes.isEmpty()) {
      return res.status(404).json({ message: 'Employee not found'});
    }

    EmployeesService.getEmployeeSalaryReport(req, res);
  },

  createEmployee: (req: Request, res: Response) => {
    if (hasErrors(req, res)) {
      return;
    }

    EmployeesService.createEmployee(req, res);
  },

  updateEmployee: (req: Request, res: Response) => {
    if (hasErrors(req, res)) {
      return;
    }

    EmployeesService.updateEmployee(req, res);
  },

  deleteEmployee: (req: Request, res: Response) => {
    const validationRes = validationResult(req);

    if (!validationRes.isEmpty()) {
      return res.status(404).json({ message: 'User not found'});
    }

    EmployeesService.deleteEmployee(req, res);
  },
};