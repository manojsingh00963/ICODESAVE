import express from 'express';
import cors from 'cors';
import connectToMongo from './db.js';
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import feedbackRoutes from './routes/feedbackRoutes.js'
import dotenv from 'dotenv';
import uploadImg from './routes/upload.js'

dotenv.config();
connectToMongo();

const app = express();
// eslint-disable-next-line no-undef
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Increase the request size limit to handle large payloads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/feedback', feedbackRoutes)
app.use('/api/upload', uploadImg)

// Catch-all route for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`ICODECOPY backend server is running on port: ${port}`);
});
