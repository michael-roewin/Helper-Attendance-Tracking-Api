import { Request, Response } from 'express';
import { FilterValue, MikroORM } from '@mikro-orm/postgresql';
import { Employee } from '../../../entities/employee';
import { EmployeeLeave } from '../../../entities/employee-leave';
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export const LeavesService = {
  getLeaveList: async (req: Request, res: Response) => {
    const orm: MikroORM = req.app.get('orm');

    try {
      const users = await orm.em.findAll(EmployeeLeave, {
        fields: ['id', 'startDate', 'endDate', 'numDays', 'type', 'createdAt', 'updatedAt'],
      });

      res.json(users);
    } catch(e: any) {
      console.log(e);
      res.status(500).send({ message: e.message });
    }
  },

  getLeave: async (req: Request, res: Response) => {
    const orm: MikroORM = req.app.get('orm');

    const employeeId = req.params.employeeId as FilterValue<number>;
    const leaveId = req.params.leaveId as FilterValue<number>;

    try {
      const leave = await orm.em.findOne(
        EmployeeLeave,
        {
          id: leaveId,
          employee: employeeId
        },
        {
          fields: ['id', 'startDate', 'endDate', 'numDays', 'type', 'createdAt', 'updatedAt'],
        }
      );

      if (!leave) {
        return res.status(404).json({ message: 'Leave not found'});
      }

      res.json(leave);
      return;
    } catch(e: any) {
      console.log(e);
      return res.status(500).send({ message: e.message });
    }
  },

  createLeave: async (req: Request, res: Response) => {
    const orm: MikroORM = req.app.get('orm');

    const employeeId = Number(req.params.employeeId);

    const { startDate, endDate, type } = req.body;

    const employee = orm.em.getReference(Employee, employeeId);

    if (!employee) {
      return res.status(404).json({ 'message': 'Employee not found.'})
    }

    try {
      const leave = new EmployeeLeave();

      leave.startDate = startDate;
      leave.endDate = endDate;
      leave.type = type;
      leave.employee = employee;
      leave.numDays = 2;

      await orm.em.persist(leave).flush();

      return res.status(201).json(leave);
    } catch (e: any) {
      return res.status(500).send({ message: e.message });
    }
  },

  updateLeave: async (req: Request, res: Response) => {
    const orm: MikroORM = req.app.get('orm');

    const employeeId = Number(req.params.employeeId);
    const leaveId = Number(req.params.leaveId);

    const { startDate, endDate, type } = req.body;

    const leave = await orm.em.findOne(
      EmployeeLeave,
      {
        id: leaveId,
        employee: employeeId
      },
      {
        fields: ['id', 'startDate', 'endDate', 'numDays', 'type', 'createdAt', 'updatedAt'],
      }
    );

    if (!leave) {
      return res.status(404).json({ 'message': 'Employee not found.'})
    }

    try {
      leave.startDate = startDate;
      leave.endDate = endDate;
      leave.type = type;

      await orm.em.flush();

      res.status(201).json(leave);
    } catch (e: any) {
      res.status(500).send({ message: e.message });
    }
  },

  deleteLeave: async (req: Request, res: Response) => {
    const orm: MikroORM = req.app.get('orm');

    const employeeId = Number(req.params.employeeId);
    const leaveId = Number(req.params.leaveId);

    const leave = await orm.em.findOne(
      EmployeeLeave,
      {
        id: leaveId,
        employee: employeeId
      },
      { fields: ['id'] }
    );

    if (!leave) {
      return res.json({ 'message': 'Leave not found'});
    }

    await orm.em.remove(leave).flush();

    res.status(200).json({});
  },
}