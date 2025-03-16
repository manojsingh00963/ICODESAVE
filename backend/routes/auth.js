import express from 'express';
import User from '../models/user.model.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetchuser from '../middleware/fetchuser.js';

const router = express.Router();

// NOTE It is a good practice to keep JWT secret in the code. Use .env file.

const JWT_SECRET = process.env.JWT_SECRET ;

// ROUTE 1: Create a user using POST "/api/auth/createUser". No login required
router.post('/createUser', [
    body('name', 'Enter a valid name.').isLength({ min: 3 }),
    body('email', 'Enter a valid email.').isEmail(),
    body('password', 'Password must be at least 5 characters.').isLength({ min: 6 }),
    body('role','Enter your role').notEmpty()
], async (req, res) => {
    let success = false;

    // If there are errors, return Bad Request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.array() });
    }

    try {
        // Check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: 'Sorry, a user with this email already exists' });
        }

        // Hash password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
            role: req.body.role,
        });

        // Generate JWT token
        const data = {
            user: {
                id: user.id,
            },
        };

        const authToken = jwt.sign(data, JWT_SECRET);

        success = true;
        res.json({ success, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error.');
    }
});

// ROUTE 2: Authenticate a user using POST "/api/auth/login". No login required
router.post('/login', [
    body('email', 'Enter a valid email.').isEmail(),
    body('password', 'Password cannot be blank.').exists(),
], async (req, res) => {
    let success = false;

    // If there are errors, return Bad Request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Please try to login with correct credentials' });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ success, error: 'Please try to login with correct credentials' });
        }

        // Generate JWT token
        const data = {
            user: {
                id: user.id,
            },
        };

        const authToken = jwt.sign(data, JWT_SECRET);

        success = true;
        res.json({ success, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error.');
    }
});

// ROUTE 3: Get logged-in user details using POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error.');
    }
});

export default router;
