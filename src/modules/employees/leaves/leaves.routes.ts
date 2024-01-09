import express from 'express';
import { LeavesController } from './leaves.controller';
import { body } from 'express-validator';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
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
  LeavesController.updateLeave
);

leaveRouter.delete("/:leaveId", LeavesController.deleteLeave);

export default leaveRouter;