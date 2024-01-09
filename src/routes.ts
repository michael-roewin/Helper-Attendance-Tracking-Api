import express from 'express';
const app = express();
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import employeeRoutes from './modules/employees/employees.routes';
import { verifyToken } from './middlewares/auth.middleware';

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/employees", verifyToken, employeeRoutes);


export default app;