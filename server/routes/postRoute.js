import express from 'express';
import { postController } from '../controllers/postController.js';
import { validateJWT } from '../middlewares/validateJWT.js';

const postRouter = express.Router();

// postRouter.get('', postController.getPosts);
postRouter.get('', postController.getPosts);
postRouter.post('', validateJWT, postController.addPost);
postRouter.patch('', validateJWT, postController.updatePost);
postRouter.delete('', validateJWT, postController.deletePost);

export {postRouter}