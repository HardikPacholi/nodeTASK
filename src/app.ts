import express from 'express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes';

dotenv.config();  

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', userRoutes);

mongoose.connect(process.env.MONGO_URI as string).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
