import express from 'express';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import fetchuser from '../middleware/fetchuser.js';
import Note from '../models/note.model.js';

const router = express.Router();

// ROUTE 1: Get all notes using: GET "/api/notes/fetchnotes". Login required
router.get('/fetchnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(notes);
  } catch (error) {
    console.error('Error in /fetchnotes:', error.message);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// ROUTE 2: Get a single note by ID using: GET "/api/notes/getnote/:id". Login optional / required
router.get('/getnote/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid Note ID format' });
    }

    const note = await Note.findById(id).populate('user', 'name');
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    return res.json({ success: true, note, ...note.toObject() });
  } catch (error) {
    console.error('Error in /getnote/:id:', error.message);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// ROUTE 3: Add a new note using: POST "/api/notes/addnote". Login required
router.post(
  '/addnote',
  fetchuser,
  [
    body('title', 'Title must be at least 2 characters.').trim().isLength({ min: 2 }),
    body('content', 'Content cannot be blank.').trim().notEmpty(),
    body('tag', 'Tag length should be less than 20 characters.').optional().isLength({ max: 20 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMsg = errors.array().map((e) => e.msg).join(', ');
        return res.status(400).json({ success: false, error: errorMsg, errors: errors.array() });
      }

      const { title, content, tag, language } = req.body;

      const note = new Note({
        title: title.trim(),
        content,
        tag: tag ? tag.trim() : 'Code',
        language: language ? language.trim().toLowerCase() : 'javascript',
        user: req.user.id,
      });

      const savedNote = await note.save();
      // Return note object directly for frontend compatibility
      return res.status(201).json(savedNote);
    } catch (error) {
      console.error('Error in /addnote:', error.message);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

// ROUTE 4: Update an existing note using: PUT "/api/notes/updatenote/:id". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid Note ID format' });
    }

    const { title, content, tag, language } = req.body;

    const newNote = {};
    if (title !== undefined) newNote.title = title.trim();
    if (content !== undefined) newNote.content = content;
    if (tag !== undefined) newNote.tag = tag.trim();
    if (language !== undefined) newNote.language = language.trim().toLowerCase();

    let note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not allowed to modify this note' });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { $set: newNote },
      { new: true, runValidators: true }
    );

    // Return both note property and flat properties so all consumer expectations are met
    return res.json({
      success: true,
      note: updatedNote,
      ...updatedNote.toObject(),
    });
  } catch (error) {
    console.error('Error in /updatenote/:id:', error.message);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// ROUTE 5: Delete an existing note using: DELETE "/api/notes/deletenote/:id". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid Note ID format' });
    }

    let note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not allowed to delete this note' });
    }

    await Note.findByIdAndDelete(id);
    return res.json({
      success: true,
      message: 'Note has been deleted successfully',
      id,
      note,
    });
  } catch (error) {
    console.error('Error in /deletenote/:id:', error.message);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

export default router;
