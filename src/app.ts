import express from 'express';
import { errorHandlingMiddleware } from './middlewares/error-handling';

const app = express();

app.use(express.json());
app.use(errorHandlingMiddleware)

export { app };