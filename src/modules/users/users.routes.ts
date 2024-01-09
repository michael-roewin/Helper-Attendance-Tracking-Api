import express from 'express';
import { UsersController } from './users.controller';
import { body, param } from 'express-validator';

const userRouter = express.Router();

userRouter.get("/", UsersController.getUserList);
userRouter.get("/:userId", param('userId').isNumeric().toInt(), UsersController.getUser);

userRouter.post("/",
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('username').trim().notEmpty().withMessage('username is required'),
  body('password').trim().notEmpty().withMessage('password is required'),
  body('cpassword').custom((value, {req}) => {
    return value === req.body.password;
  }).withMessage('Password does not match'),
  body('active').isBoolean().withMessage('active must be boolean'),
  UsersController.createUser
);

userRouter.put("/:userId",
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('username').trim().notEmpty().withMessage('username is required'),
  body('password').trim().optional(),
  body('cpassword').custom((value, {req}) => {
    return value === req.body.password;
  }).withMessage('Password does not match'),
  body('active').isBoolean().withMessage('active must be boolean'),
  UsersController.updateUser
);

userRouter.delete("/:userId", param('userId').isNumeric().toInt(), UsersController.deleteUser);


export default userRouter;