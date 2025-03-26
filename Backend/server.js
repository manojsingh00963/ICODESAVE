import express from 'express';
import cors from 'cors';
import connectToMongo from './db.js';
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import feedbackRoutes from './routes/feedbackRoutes.js'
import dotenv from 'dotenv';

dotenv.config();
connectToMongo();

const app = express();
// eslint-disable-next-line no-undef
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/feedback', feedbackRoutes )

app.listen(port, () => {
  console.log(`ICODECOPY backend server is running on port: ${port}`);
});
