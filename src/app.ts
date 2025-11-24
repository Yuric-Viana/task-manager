import express from 'express';
import "express-async-error"

import { errorHandlingMiddleware } from './middlewares/error-handling';
import { router } from './routes';

const app = express();

app.use(express.json());
app.use(router)
app.use(errorHandlingMiddleware)

export { app };