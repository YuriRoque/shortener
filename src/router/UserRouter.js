import express from 'express';

import UserController from '../controller/UserController.js';
const UserRouter = express.Router();

const userController = new UserController();

UserRouter.get('/api/user', userController.index);
UserRouter.get('/api/user/:id', userController.getOne);
UserRouter.post('/api/user', userController.store);
UserRouter.post('/api/login', userController.login);
UserRouter.put('/api/user/:id', userController.update);
UserRouter.delete('/api/user/:id', userController.remove);

export default UserRouter;
