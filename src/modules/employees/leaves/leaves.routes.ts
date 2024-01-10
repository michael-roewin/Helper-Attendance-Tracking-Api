import express from 'express';
import { LeavesController } from './leaves.controller';
import { body } from 'express-validator';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { getDaysBetween } from '../../../helpers/get-days-between';
dayjs.extend(customParseFormat);

const leaveRouter = express.Router({ mergeParams: true });

leaveRouter.get("/", LeavesController.getLeaveList);
leaveRouter.get("/:leaveId", LeavesController.getLeave);

leaveRouter.post("/",
  body('startDate').custom((value, {req}) => {
    return dayjs(value, 'YYYY-MM-DD', true).isValid();
  }).withMessage('Start Date is invalid'),
  body('endDate').custom((value, {req}) => {
    return dayjs(value, 'YYYY-MM-DD', true).isValid();
  }).withMessage('End Date is invalid'),
  body('type').trim().notEmpty().withMessage('type is required'),
  body('reason').trim().notEmpty().withMessage('reason is required'),
  body('items').custom((value, {req}) => {
    const startDate = dayjs(req.body.startDate);
    const endDate = dayjs(req.body.endDate);
    const daysBetweenArrayObj = getDaysBetween(startDate, endDate);

    const daysBetweenArray = daysBetweenArrayObj.map((date) => {
      return date.format('YYYY-MM-DD');
    });

    const hasInvalidValue = value.some((leaveItem: any) => {
      return !daysBetweenArray.includes(leaveItem.date)
    });

    return !hasInvalidValue;

  }).withMessage('Leave items is invalid'),
  LeavesController.createLeave
);

leaveRouter.put("/:leaveId",
  body('startDate').custom((value, {req}) => {
    return dayjs(value, 'YYYY-MM-DD', true).isValid();
  }).withMessage('Start Date is invalid'),
  body('endDate').custom((value, {req}) => {
    return dayjs(value, 'YYYY-MM-DD', true).isValid();
  }).withMessage('End Date is invalid'),
  body('type').trim().notEmpty().withMessage('type is required'),
  body('reason').trim().notEmpty().withMessage('reason is required'),
  body('items').custom((value, {req}) => {
    const startDate = dayjs(req.body.startDate);
    const endDate = dayjs(req.body.endDate);
    const daysBetweenArrayObj = getDaysBetween(startDate, endDate);

    const daysBetweenArray = daysBetweenArrayObj.map((date) => {
      return date.format('YYYY-MM-DD');
    });

    const hasInvalidValue = value.some((leaveItem: any) => {
      return !daysBetweenArray.includes(leaveItem.date)
    });

    return !hasInvalidValue;

  }).withMessage('Leave items is invalid'),
  LeavesController.updateLeave
);

leaveRouter.delete("/:leaveId", LeavesController.deleteLeave);

export default leaveRouter;