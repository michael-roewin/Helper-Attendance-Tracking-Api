import express from 'express';
import { AuthController } from './auth.controller';
import { body } from 'express-validator';

const authRouter = express.Router();

authRouter.post("/login",
  body('username').trim().notEmpty(),
  body('password').trim().notEmpty(),
  AuthController.login
);

authRouter.post("/forgot-password", AuthController.forgotPassword);


export default authRouter;