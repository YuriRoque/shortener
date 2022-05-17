import express from 'express';

import ShortnerController from '../controller/ShortnerController.js';
const ShortnerRouter = express.Router();

const shortnerController = new ShortnerController();

ShortnerRouter.get('/api/shortner', shortnerController.index);
ShortnerRouter.get('/api/shortner/:id', shortnerController.getOne);
ShortnerRouter.post('/api/shortner', shortnerController.store);
ShortnerRouter.put('/api/shortner/:id', shortnerController.update);
ShortnerRouter.delete('/api/shortner/:id', shortnerController.remove);

export default ShortnerRouter;
