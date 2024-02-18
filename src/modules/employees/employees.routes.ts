import express from 'express';
import { EmployeesController } from './employees.controller';
import { body } from 'express-validator';
import leaveRoutes from './leaves/leaves.routes';

const employeeRouter = express.Router();

employeeRouter.get("/", EmployeesController.getEmployeeList);
employeeRouter.get("/:employeeId", EmployeesController.getEmployee);
employeeRouter.get("/:employeeId/salary-report", EmployeesController.getEmployeeSalaryReport);

employeeRouter.post("/",
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('salary').trim().notEmpty().isDecimal(),
  body('dayOffPerMonth').notEmpty().isInt(),
  body('username').trim().optional(),
  body('password').trim().optional(),
  body('cpassword').custom((value, {req}) => {
    return value === req.body.password;
  }).withMessage('Password does not match'),
  body('active').isBoolean().withMessage('active must be boolean'),
  EmployeesController.createEmployee
);

employeeRouter.put("/:employeeId",
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('salary').trim().notEmpty().isDecimal(),
  body('dayOffPerMonth').notEmpty().isInt(),
  body('username').trim().notEmpty().withMessage('username is required'),
  body('password').trim().optional(),
  body('cpassword').custom((value, {req}) => {
    return value === req.body.password;
  }).withMessage('Password does not match'),
  body('active').isBoolean(),
  EmployeesController.updateEmployee
);

employeeRouter.delete("/:employeeId", EmployeesController.deleteEmployee);

employeeRouter.use('/:employeeId/leaves', leaveRoutes)


export default employeeRouter;