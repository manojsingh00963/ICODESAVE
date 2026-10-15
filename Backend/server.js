import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToMongo from './db.js';
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

dotenv.config();

// Connect to MongoDB
connectToMongo();

const app = express();
const port = process.env.PORT || 5000;

// Dynamic CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for snippet sharing across domains
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'authToken', 'auth-token'],
  })
);

// Payload parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root info route
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'ICODESAVE API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      notes: '/api/notes',
      feedback: '/api/feedback',
      health: '/health',
    },
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/feedback', feedbackRoutes);

// Catch-all route for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handling Middleware (Requires 4 arguments in Express!)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong on the server!',
  });
});

app.listen(port, () => {
  console.log(`🚀 ICODESAVE backend server is running on port: ${port}`);
});
