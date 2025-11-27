
import express from 'express';
import { authControllers } from '../controllers/authController.js';

const authRouter = express.Router();
authRouter.post('/register', authControllers.register);
authRouter.post('', authControllers.login);


export { authRouter }
