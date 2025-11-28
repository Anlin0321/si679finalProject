import express from 'express';
import { itemController } from '../controllers/itemController.js';
import { validateJWT } from '../middlewares/validateJWT.js';

const itemRouter = express.Router();

itemRouter.get('', itemController.getItems);
itemRouter.post('', validateJWT, itemController.addItem);

export { itemRouter };
