import { Request, Response } from 'express';
import { FilterValue, MikroORM } from '@mikro-orm/postgresql';
import { Employee } from '../../../entities/employee';
import { EmployeeLeave, LeaveType } from '../../../entities/employee-leave';
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { getDaysBetween } from '../../../helpers/get-days-between';
import { EmployeeLeaveItem, LeaveItemType } from '../../../entities/employee-leave-item';
import { wrap } from '@mikro-orm/core';
dayjs.extend(customParseFormat);

export const LeavesService = {
  getLeaveList: async (req: Request, res: Response) => {
    const orm: MikroORM = req.app.get('orm');

    try {
      const leaves = await orm.em.findAll(EmployeeLeave, {
        fields: ['id', 'startDate', 'endDate', 'numDays', 'type', 'reason', 'createdAt', 'updatedAt'],
        where: {
          type: req.query.type as LeaveType
        },
        orderBy: [
          {
            startDate: 'DESC'
          }
        ]
      });

      res.json(leaves);
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
          populate: ['items']
        },

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

    const { startDate, endDate, type, reason, items } = req.body;

    const employee = orm.em.getReference(Employee, employeeId);

    if (!employee) {
      return res.status(404).json({ 'message': 'Employee not found.'})
    }

    const qb = orm.em.createQueryBuilder(EmployeeLeave, 'el');
    qb.select(['el.*'])
    .where('? <= el.end_date AND ? >= el.start_date', [startDate, endDate]);

    const count = await qb.getCount();

    if (count > 0) {
      return res.status(422).json({ 'message': 'Start date or End date overlaps with existing records'})
    }

    try {
      const leave = new EmployeeLeave();

      leave.employee = employee;
      leave.startDate = startDate;
      leave.endDate = endDate;
      leave.type = type;
      leave.reason = reason;

      const leaveItems = items.map((item: any) => {
        const leaveItem = new EmployeeLeaveItem();
        leaveItem.date = item.date;
        leaveItem.type = item.type;
        leaveItem.halfDayType = item?.halfDayType || null;
        return leaveItem;
      })

      leave.items = leaveItems;

      leave.numDays = leaveItems.reduce((accum: number, field: EmployeeLeaveItem) => {
        return accum + ((field.type === LeaveItemType.HALF_DAY) ? 0.5 : 1);
      }, 0),

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

    const { startDate, endDate, type, reason, items } = req.body;

    const leave = await orm.em.findOne(
      EmployeeLeave,
      {
        id: leaveId,
        employee: employeeId
      },
      {
        populate: ['items']
      },
    );

    if (!leave) {
      return res.status(404).json({ 'message': 'Employee not found.'})
    }

    try {
      wrap(leave).assign({
        startDate,
        endDate,
        type,
        reason,
        items,
        numDays: items.reduce((accum: number, field: EmployeeLeaveItem) => {
          return accum + ((field.type === LeaveItemType.HALF_DAY) ? 0.5 : 1);
        }, 0),
      })

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
      leaveId,
      {
        populate: ['items']
      }
    );

    if (!leave) {
      return res.json({ 'message': 'Leave not found'});
    }

    await orm.em.remove(leave).flush();

    res.status(200).json({});
  },
}