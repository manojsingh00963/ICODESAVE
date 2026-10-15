import express from 'express';
import { body, validationResult } from 'express-validator';
import Feedback from '../models/feedback.model.js';
import fetchuser from '../middleware/fetchuser.js';

const router = express.Router();

// @route   POST /api/feedback/submit
// @desc    Submit feedback
// @access  Authenticated
router.post(
  '/submit',
  fetchuser,
  [
    body('rating', 'Rating is required and must be between 1 and 5').isInt({ min: 1, max: 5 }),
    body('feedback', 'Feedback must be at least 3 characters long').trim().isLength({ min: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((e) => e.msg).join(', ');
      return res.status(400).json({ success: false, error: errorMsg, errors: errors.array() });
    }

    try {
      const { rating, feedback } = req.body;
      const userId = req.user?.id;

      const newFeedback = new Feedback({
        user: userId,
        rating: Number(rating),
        feedback: feedback.trim(),
      });

      await newFeedback.save();
      return res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully',
        feedback: newFeedback,
      });
    } catch (error) {
      console.error('Error submitting feedback:', error.message);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

// @route   GET /api/feedback
// @desc    Get all feedbacks
// @access  Public
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('user', 'name role avatar')
      .sort({ createdAt: -1 })
      .limit(50);
    return res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    console.error('Error fetching feedbacks:', error.message);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

export default router;