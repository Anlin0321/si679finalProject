import express from 'express';
import { userController } from '../controllers/userController.js';
import { validateJWT } from '../middlewares/validateJWT.js';

const userRouter = express.Router();

userRouter.get('', userController.getUsers);
userRouter.post('', userController.addUser);
userRouter.patch('', userController.updateUser);
userRouter.delete('', userController.deleteUser);

export {userRouter}