import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import adoptionRoutes from './routes/adoptionRoutes.js';
import authRoutes from './routes/authRoutes.js';
import petRoutes from './routes/petRoutes.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
  }),
);
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/pets', petRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    message: 'Pet Adoption API is running',
  });
});

export default app;
