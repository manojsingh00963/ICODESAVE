import express from 'express';
import cors from 'cors';
import connectToMongo from './db.js';
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';

connectToMongo();

const app = express();
const port = 5000;
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.listen(port, () => {
  console.log(`ICODECOPY backend server is running on port: ${port}`);
});
