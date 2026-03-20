import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  }),
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({
    message: 'Pet Adoption API is running',
  });
});

export default app;

