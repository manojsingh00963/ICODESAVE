import express from 'express'
const router = express.Router();
import Feedback from '../models/feedback.model.js';
import { body, validationResult } from 'express-validator'
import fetchuser from '../middleware/fetchuser.js'

// @route   POST /api/feedback
// @desc    Submit feedback
// @access  Public or Authenticated (Modify as needed)
router.post(
  "/submit",
  fetchuser,
  [
    body("rating", "Rating is required").isInt({ min: 1, max: 5 }),
    body("feedback", "Feedback must be at least 5 characters long").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }    
    try {

      const { rating, feedback } = req.body;
      const userId = req.user.id; // Extracted from authMiddleware

      if (!rating || !feedback) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
  
      const newFeedback = new Feedback({
        user:userId,
        rating,
        feedback,
      });

      await newFeedback.save();
      res.status(201).json({ message: "Feedback submitted successfully", feedback: newFeedback });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// @route   GET /api/feedback
// @desc    Get all feedbacks
// @access  Public or Admin (Modify as needed) 
// but can only watch now admin
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default router;