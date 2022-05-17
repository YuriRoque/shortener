import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';

import ShortnerController from './controller/ShortnerController.js';
import { AuthMiddleware } from './middleware/auth.middleware.js';
import ShortnerRouter from './router/ShortnerRouter.js';
import UserRouter from './router/UserRouter.js';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;

const shortnerController = new ShortnerController();

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log('Database connected...');
  })
  .catch(error => {
    console.error(`Error to connect to database: ${error.message}`);
  });

const app = express();

app.use(express.json());

app.get('/', (request, response) => response.json({ message: 'Shortner...' }));
app.get('/:hash', shortnerController.redirect);

app.use(AuthMiddleware);

app.use(morgan('dev'));

app.use(UserRouter);
app.use(ShortnerRouter);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
