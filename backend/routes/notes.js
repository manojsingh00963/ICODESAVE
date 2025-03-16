import express from 'express';
import { body, validationResult } from 'express-validator';
import fetchuser from '../middleware/fetchuser.js';
import Note from '../models/note.model.js'

const router = express.Router();

// ROUTE 1: Get all notes using: GET "/api/notes/fetchnotes". Login required
router.get('/fetchnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error.');
    }
});

// ROUTE 2: Add a new note using: POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title.').isLength({ min: 3 }),
    body('content', 'content must be at least 5 characters.').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, content, tag } = req.body;

        // If there are errors, return Bad Request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        // Create a new note
        const note = new Note({
            title,
            content,
            tag,
            user: req.user.id
        });

        const savedNote = await note.save();
        res.json(savedNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error.');
    }
});

// ROUTE 3: Update an existing note using: PUT "/api/notes/updatenote/:id". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, content, tag } = req.body;

        // Create a new note object
        const newNote = {};
        if (title) newNote.title = title;
        if (content) newNote.content = content;
        if (tag) newNote.tag = tag;

        // Find the note to be updated
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send('Not Found!');
        }

        // Allow update only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('Not Allowed!');
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error.');
    }
});

// ROUTE 4: Delete an existing note using: DELETE "/api/notes/deletenote/:id". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send('Not Found!');
        }

        // Allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('Not Allowed!');
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ success: 'Note has been deleted', note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error.');
    }
});

export default router;
