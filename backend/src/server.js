import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
import petSeed from './data/petSeed.js';
import Pet from './models/Pet.js';

dotenv.config();

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;

async function startServer() {
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected');

      const totalPets = await Pet.countDocuments();

      if (totalPets === 0) {
        await Pet.insertMany(petSeed);
        console.log('Sample pets inserted');
      }
    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
    }
  }

  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}

startServer();
