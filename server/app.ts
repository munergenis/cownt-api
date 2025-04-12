import express from 'express';
import cowRouter from './cow/router';
import sheepRouter from './sheep/router';
import cors from 'cors';

const app = express();
app.use(cors());

// middlewares
app.use(express.json());

app.use('/api/cows', cowRouter);
app.use('/api/sheeps', sheepRouter);

export default app;
