import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
const saltRounds = 10;
import { FilterQuery, MikroORM } from '@mikro-orm/postgresql';
import { User } from '../../entities/user';
import { Employee } from '../../entities/employee';

export const EmployeesService = {
  getEmployeeList: async (req: Request, res: Response) => {
    const orm: MikroORM = req.app.get('orm');

    try {
      const users = await orm.em.findAll(Employee, {
        fields: ['id', 'user.firstName', 'user.lastName', 'user.username', 'user.active', 'salary', 'dayOffPerMonth', 'createdAt', 'updatedAt'],
      });

      res.json(users);
    } catch(e: any) {
      console.log(e);
      res.status(500).send({ message: e.message });
    }
  },

  getEmployee: async (req: Request, res: Response) => {
    const orm: MikroORM = req.app.get('orm');

    const employeeId = req.params.employeeId as FilterQuery<Employee>;

    try {
      const user = await orm.em.findOne(Employee, employeeId, {
        fields: ['id', 'user.firstName', 'user.lastName', 'user.username', 'user.active', 'salary', 'dayOffPerMonth', 'createdAt', 'updatedAt'],
      });

      if (!user) {
        return res.status(404).json({ message: 'Employee not found'});
      }

      res.json(user);
      return;
    } catch(e: any) {
      console.log(e);
      return res.status(500).send({ message: e.message });
    }
  },

  createEmployee: async (req: Request, res: Response) => {
    const orm: MikroORM = req.app.get('orm');

    const { firstName, lastName, username, password, salary, dayOffPerMonth, active } = req.body;

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

      const employee = new Employee();

      employee.salary = salary,
      employee.dayOffPerMonth = dayOffPerMonth
      employee.user = user;

      await orm.em.persist(employee).flush();

      return res.status(201).json(employee);
    } catch (e: any) {
      return res.status(500).send({ message: e.message });
    }
  },

  updateEmployee: async (req: Request, res: Response) => {
    const orm: MikroORM = req.app.get('orm');

    const employeeId = req.params.employeeId as FilterQuery<Employee>;

    const { firstName, lastName, username, password, salary, dayOffPerMonth, active } = req.body;

    const employee = await orm.em.findOne(Employee, employeeId, { populate: ['user']});

    if (!employee) {
      return res.status(404).json({ 'message': 'Employee not found.'})
    }

    const userNameExists = await orm.em.findOne(User, {
      username,
      id: { $ne: Number(employee.user.id) }
    }, {
      fields: ['id'],
    });

    if (userNameExists) {
      return res.status(409).json({ 'message': 'Username already in use.'});
    }

    try {
      employee.salary = salary;
      employee.dayOffPerMonth = dayOffPerMonth;

      employee.user.firstName = firstName;
      employee.user.lastName = lastName;
      employee.user.username = username;
      if (password) {
        const hash = await bcrypt.hash(password, saltRounds);
        employee.user.password = hash;
      }
      employee.user.active = active || true;

      await orm.em.flush();

      res.status(201).json(employee);
    } catch (e: any) {
      res.status(500).send({ message: e.message });
    }
  },

  deleteEmployee: async (req: Request, res: Response) => {
    const orm: MikroORM = req.app.get('orm');

    const employeeId = Number(req.params.employeeId);

    const employee = await orm.em.findOne(Employee, employeeId, {
      fields: ['id'],
    });

    if (!employee) {
      return res.json({ 'message': 'Employee not found'});
    }

    await orm.em.remove(employee).flush();

    res.status(200).json({});
  },
}